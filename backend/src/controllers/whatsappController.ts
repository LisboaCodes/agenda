import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import prisma from '../config/database';
import { sendWhatsAppMessage, getInstanceStatus } from '../config/evolution';

export const webhook = async (req: Request, res: Response) => {
  try {
    const { data } = req.body;

    if (!data || !data.key || !data.message) {
      return res.status(200).json({ success: true });
    }

    const phoneNumber = data.key.remoteJid.replace('@s.whatsapp.net', '');
    const messageText = data.message.conversation || data.message.extendedTextMessage?.text || '';

    // Find user by phone number
    const session = await prisma.whatsappSession.findUnique({
      where: { phoneNumber },
      include: { user: true },
    });

    if (!session || !session.isActive) {
      return res.status(200).json({ success: true });
    }

    // Update last interaction
    await prisma.whatsappSession.update({
      where: { id: session.id },
      data: { lastInteraction: new Date() },
    });

    // Process command
    const response = await processCommand(messageText, session.userId);

    // Send response
    if (response) {
      await sendWhatsAppMessage(phoneNumber, response);
    }

    res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
};

async function processCommand(message: string, userId: string): Promise<string | null> {
  const command = message.trim().toLowerCase();

  try {
    // Nota rápida: /nota [título] | [conteúdo]
    if (command.startsWith('/nota ')) {
      const content = message.substring(6);
      const [title, noteContent] = content.split('|').map(s => s.trim());

      if (!title) {
        return 'Formato: /nota [título] | [conteúdo]';
      }

      await prisma.note.create({
        data: {
          userId,
          title,
          content: noteContent || '',
          category: 'whatsapp',
        },
      });

      return `✅ Nota "${title}" criada com sucesso!`;
    }

    // Listar notas: /listar notas
    if (command === '/listar notas') {
      const notes = await prisma.note.findMany({
        where: { userId },
        orderBy: { updatedAt: 'desc' },
        take: 5,
        select: { title: true, createdAt: true },
      });

      if (notes.length === 0) {
        return 'Você não tem notas cadastradas.';
      }

      let response = '📝 *Últimas 5 notas:*\n\n';
      notes.forEach((note, index) => {
        response += `${index + 1}. ${note.title}\n`;
      });

      return response;
    }

    // Saldo: /saldo
    if (command === '/saldo') {
      const income = await prisma.transaction.aggregate({
        where: {
          userId,
          transactionType: 'income',
        },
        _sum: { amount: true },
      });

      const expense = await prisma.transaction.aggregate({
        where: {
          userId,
          transactionType: 'expense',
        },
        _sum: { amount: true },
      });

      const totalIncome = income._sum.amount || 0;
      const totalExpense = expense._sum.amount || 0;
      const balance = Number(totalIncome) - Number(totalExpense);

      return `💰 *Resumo Financeiro*\n\n` +
        `Entradas: R$ ${Number(totalIncome).toFixed(2)}\n` +
        `Saídas: R$ ${Number(totalExpense).toFixed(2)}\n` +
        `Saldo: R$ ${balance.toFixed(2)}`;
    }

    // Pagamentos pendentes: /pagamentos pendentes
    if (command === '/pagamentos pendentes') {
      const payments = await prisma.payment.findMany({
        where: {
          userId,
          status: 'pending',
        },
        orderBy: { dueDate: 'asc' },
        take: 5,
        include: {
          client: {
            select: { name: true },
          },
        },
      });

      if (payments.length === 0) {
        return 'Nenhum pagamento pendente.';
      }

      let response = '📋 *Pagamentos Pendentes:*\n\n';
      payments.forEach((payment, index) => {
        const clientName = payment.client?.name || 'Sem cliente';
        response += `${index + 1}. ${payment.description}\n`;
        response += `   Cliente: ${clientName}\n`;
        response += `   Valor: R$ ${Number(payment.amount).toFixed(2)}\n`;
        response += `   Vencimento: ${payment.dueDate?.toLocaleDateString('pt-BR')}\n\n`;
      });

      return response;
    }

    // Lembretes hoje: /lembretes hoje
    if (command === '/lembretes hoje') {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      const reminders = await prisma.reminder.findMany({
        where: {
          userId,
          isCompleted: false,
          reminderDate: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
        orderBy: { reminderDate: 'asc' },
      });

      if (reminders.length === 0) {
        return 'Nenhum lembrete para hoje.';
      }

      let response = '🔔 *Lembretes de Hoje:*\n\n';
      reminders.forEach((reminder, index) => {
        const time = reminder.reminderDate.toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
        });
        response += `${index + 1}. ${reminder.title} - ${time}\n`;
      });

      return response;
    }

    // Registrar entrada: /registrar entrada [valor] [descrição]
    if (command.startsWith('/registrar entrada ')) {
      const content = message.substring(19).trim();
      const parts = content.split(' ');
      const amount = parseFloat(parts[0]);
      const description = parts.slice(1).join(' ');

      if (isNaN(amount) || !description) {
        return 'Formato: /registrar entrada [valor] [descrição]';
      }

      await prisma.transaction.create({
        data: {
          userId,
          description,
          amount,
          transactionType: 'income',
          transactionDate: new Date(),
          category: 'whatsapp',
        },
      });

      return `✅ Entrada de R$ ${amount.toFixed(2)} registrada!\nDescrição: ${description}`;
    }

    // Registrar saída: /registrar saída [valor] [descrição]
    if (command.startsWith('/registrar saida ') || command.startsWith('/registrar saída ')) {
      const content = message.substring(17).trim();
      const parts = content.split(' ');
      const amount = parseFloat(parts[0]);
      const description = parts.slice(1).join(' ');

      if (isNaN(amount) || !description) {
        return 'Formato: /registrar saída [valor] [descrição]';
      }

      await prisma.transaction.create({
        data: {
          userId,
          description,
          amount,
          transactionType: 'expense',
          transactionDate: new Date(),
          category: 'whatsapp',
        },
      });

      return `✅ Saída de R$ ${amount.toFixed(2)} registrada!\nDescrição: ${description}`;
    }

    // Ajuda: /ajuda
    if (command === '/ajuda' || command === '/help') {
      return `🤖 *Comandos Disponíveis:*\n\n` +
        `📝 /nota [título] | [conteúdo]\n` +
        `📝 /listar notas\n` +
        `💰 /saldo\n` +
        `📋 /pagamentos pendentes\n` +
        `🔔 /lembretes hoje\n` +
        `💵 /registrar entrada [valor] [desc]\n` +
        `💸 /registrar saída [valor] [desc]\n` +
        `❓ /ajuda`;
    }

    return null;
  } catch (error) {
    console.error('Command processing error:', error);
    return 'Erro ao processar comando. Tente novamente.';
  }
}

export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { phoneNumber, message } = req.body;

    if (!phoneNumber || !message) {
      return res.status(400).json({ error: 'Phone number and message are required' });
    }

    await sendWhatsAppMessage(phoneNumber, message);

    res.json({ message: 'Message sent successfully' });
  } catch (error: any) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
};

export const connectPhone = async (req: AuthRequest, res: Response) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    // Check if session already exists
    const existingSession = await prisma.whatsappSession.findUnique({
      where: { phoneNumber },
    });

    if (existingSession) {
      return res.status(409).json({ error: 'Phone number already connected' });
    }

    // Create new session
    const session = await prisma.whatsappSession.create({
      data: {
        userId: req.userId!,
        phoneNumber,
        isActive: true,
      },
    });

    res.status(201).json(session);
  } catch (error: any) {
    console.error('Connect phone error:', error);
    res.status(500).json({ error: 'Failed to connect phone' });
  }
};

export const getStatus = async (req: AuthRequest, res: Response) => {
  try {
    const status = await getInstanceStatus();

    res.json(status);
  } catch (error: any) {
    console.error('Get status error:', error);
    res.status(500).json({ error: 'Failed to get status' });
  }
};
