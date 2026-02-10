import { useEffect, useState } from 'react';
import { Card } from '../components/common/Card';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import {
  StickyNote,
  Image,
  Lock,
  Users,
  DollarSign,
  Bell,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

export const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    notes: 0,
    memories: 0,
    passwords: 0,
    clients: 0,
    reminders: 0,
    balance: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [notes, memories, passwords, clients, reminders, summary] = await Promise.all([
        api.get('/notes'),
        api.get('/memories'),
        api.get('/passwords'),
        api.get('/clients'),
        api.get('/reminders?isCompleted=false'),
        api.get('/transactions/summary'),
      ]);

      setStats({
        notes: notes.data.length,
        memories: memories.data.length,
        passwords: passwords.data.length,
        clients: clients.data.length,
        reminders: reminders.data.length,
        balance: Number(summary.data.balance) || 0,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const statCards = [
    {
      title: 'Anotações',
      value: stats.notes,
      icon: StickyNote,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      title: 'Memórias',
      value: stats.memories,
      icon: Image,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      title: 'Senhas',
      value: stats.passwords,
      icon: Lock,
      color: 'text-red-600',
      bg: 'bg-red-50',
    },
    {
      title: 'Clientes',
      value: stats.clients,
      icon: Users,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      title: 'Lembretes Ativos',
      value: stats.reminders,
      icon: Bell,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Bem-vindo, {user?.name}!
        </h1>
        <p className="text-gray-600">
          Aqui está um resumo das suas informações
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
              </div>
              <div className={`${stat.bg} p-3 rounded-full`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </Card>
        ))}

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Saldo</p>
              <p
                className={`text-3xl font-bold ${
                  stats.balance >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                R$ {stats.balance.toFixed(2)}
              </p>
            </div>
            <div
              className={`${
                stats.balance >= 0 ? 'bg-green-50' : 'bg-red-50'
              } p-3 rounded-full`}
            >
              {stats.balance >= 0 ? (
                <TrendingUp className="w-6 h-6 text-green-600" />
              ) : (
                <TrendingDown className="w-6 h-6 text-red-600" />
              )}
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Atividade Recente">
          <p className="text-gray-500">Nenhuma atividade recente</p>
        </Card>

        <Card title="Lembretes Próximos">
          <p className="text-gray-500">Nenhum lembrete próximo</p>
        </Card>
      </div>
    </div>
  );
};
