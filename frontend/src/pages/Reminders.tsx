import { useEffect, useState, useCallback } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { useNotifications } from '../hooks/useNotifications';
import api from '../services/api';
import { Reminder } from '../types';
import { Plus, Trash2, Edit, Check, Clock, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { format, isPast, isToday, isTomorrow, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const Reminders = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('pending');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    reminderDate: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    isRecurring: false,
    recurrencePattern: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const { requestPermission, showReminder, scheduleNotification } = useNotifications();

  useEffect(() => {
    loadReminders();
    requestPermission();
    checkUpcomingReminders();

    // Check for upcoming reminders every minute
    const interval = setInterval(checkUpcomingReminders, 60000);
    return () => clearInterval(interval);
  }, []);

  const checkUpcomingReminders = useCallback(() => {
    reminders.forEach((reminder) => {
      if (!reminder.isCompleted && !reminder.notificationSent) {
        const reminderTime = parseISO(reminder.reminderDate);
        const now = new Date();
        const timeDiff = reminderTime.getTime() - now.getTime();

        // Notify 5 minutes before
        if (timeDiff > 0 && timeDiff <= 5 * 60 * 1000) {
          showReminder({
            id: reminder.id,
            title: reminder.title,
            description: reminder.description,
            priority: reminder.priority,
          });
        }
      }
    });
  }, [reminders, showReminder]);

  const loadReminders = async () => {
    try {
      const response = await api.get('/reminders');
      setReminders(response.data);
    } catch (error) {
      toast.error('Erro ao carregar lembretes');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let reminder;
      if (editingId) {
        const response = await api.put(`/reminders/${editingId}`, formData);
        reminder = response.data;
        toast.success('Lembrete atualizado!');
      } else {
        const response = await api.post('/reminders', formData);
        reminder = response.data;
        toast.success('Lembrete criado!');

        // Schedule notification for new reminder
        const reminderTime = parseISO(formData.reminderDate);
        scheduleNotification(
          {
            title: `🔔 Lembrete: ${formData.title}`,
            body: formData.description || 'Você tem um lembrete',
          },
          reminderTime
        );
      }
      resetForm();
      loadReminders();
    } catch (error) {
      toast.error('Erro ao salvar lembrete');
    }
  };

  const handleEdit = (reminder: Reminder) => {
    setFormData({
      title: reminder.title,
      description: reminder.description || '',
      reminderDate: format(parseISO(reminder.reminderDate), "yyyy-MM-dd'T'HH:mm"),
      priority: reminder.priority as any || 'medium',
      isRecurring: reminder.isRecurring,
      recurrencePattern: reminder.recurrencePattern || '',
    });
    setEditingId(reminder.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir este lembrete?')) return;
    try {
      await api.delete(`/reminders/${id}`);
      toast.success('Lembrete excluído!');
      loadReminders();
    } catch (error) {
      toast.error('Erro ao excluir lembrete');
    }
  };

  const handleToggleComplete = async (id: string) => {
    try {
      await api.patch(`/reminders/${id}/complete`);
      loadReminders();
      toast.success('Status atualizado!');
    } catch (error) {
      toast.error('Erro ao atualizar status');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      reminderDate: '',
      priority: 'medium',
      isRecurring: false,
      recurrencePattern: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'high':
        return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'low':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getPriorityIcon = (priority?: string) => {
    switch (priority) {
      case 'urgent':
        return '🔴';
      case 'high':
        return '🟠';
      case 'medium':
        return '🟡';
      case 'low':
        return '🔵';
      default:
        return '⚪';
    }
  };

  const getDateLabel = (dateString: string) => {
    const date = parseISO(dateString);
    if (isToday(date)) return 'Hoje';
    if (isTomorrow(date)) return 'Amanhã';
    if (isPast(date)) return 'Atrasado';
    return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  };

  const getFilteredReminders = () => {
    return reminders.filter(reminder => {
      if (filter === 'completed') return reminder.isCompleted;
      if (filter === 'pending') return !reminder.isCompleted;
      return true;
    });
  };

  const groupedReminders = {
    overdue: getFilteredReminders().filter(r => !r.isCompleted && isPast(parseISO(r.reminderDate))),
    today: getFilteredReminders().filter(r => !r.isCompleted && isToday(parseISO(r.reminderDate))),
    upcoming: getFilteredReminders().filter(r => !r.isCompleted && !isPast(parseISO(r.reminderDate)) && !isToday(parseISO(r.reminderDate))),
    completed: getFilteredReminders().filter(r => r.isCompleted),
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Lembretes</h1>
          <p className="text-gray-600 mt-1">Nunca esqueça nada importante</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Lembrete
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'primary' : 'secondary'}
            onClick={() => setFilter('all')}
          >
            Todos ({reminders.length})
          </Button>
          <Button
            variant={filter === 'pending' ? 'primary' : 'secondary'}
            onClick={() => setFilter('pending')}
          >
            Pendentes ({reminders.filter(r => !r.isCompleted).length})
          </Button>
          <Button
            variant={filter === 'completed' ? 'primary' : 'secondary'}
            onClick={() => setFilter('completed')}
          >
            Concluídos ({reminders.filter(r => r.isCompleted).length})
          </Button>
        </div>
      </Card>

      {/* Form */}
      {showForm && (
        <Card className="mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingId ? 'Editar Lembrete' : 'Novo Lembrete'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Título *"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="O que você precisa lembrar?"
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input min-h-[80px]"
                placeholder="Detalhes adicionais..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Data e Hora *"
                type="datetime-local"
                value={formData.reminderDate}
                onChange={(e) => setFormData({ ...formData, reminderDate: e.target.value })}
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prioridade
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                  className="input"
                >
                  <option value="low">🔵 Baixa</option>
                  <option value="medium">🟡 Média</option>
                  <option value="high">🟠 Alta</option>
                  <option value="urgent">🔴 Urgente</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isRecurring"
                checked={formData.isRecurring}
                onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
                className="w-4 h-4 text-primary-600 rounded"
              />
              <label htmlFor="isRecurring" className="text-sm text-gray-700">
                Lembrete recorrente
              </label>
            </div>

            {formData.isRecurring && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Padrão de Recorrência
                </label>
                <select
                  value={formData.recurrencePattern}
                  onChange={(e) => setFormData({ ...formData, recurrencePattern: e.target.value })}
                  className="input"
                >
                  <option value="">Selecione...</option>
                  <option value="daily">Diariamente</option>
                  <option value="weekly">Semanalmente</option>
                  <option value="monthly">Mensalmente</option>
                  <option value="yearly">Anualmente</option>
                </select>
              </div>
            )}

            <div className="flex gap-2">
              <Button type="submit">{editingId ? 'Atualizar' : 'Criar'}</Button>
              <Button variant="secondary" onClick={resetForm}>
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Overdue */}
      {groupedReminders.overdue.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-red-600 mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Atrasados ({groupedReminders.overdue.length})
          </h2>
          <div className="space-y-3">
            {groupedReminders.overdue.map((reminder) => (
              <Card key={reminder.id} className="border-l-4 border-red-500 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <button
                      onClick={() => handleToggleComplete(reminder.id)}
                      className="mt-1 w-5 h-5 rounded border-2 border-gray-300 flex items-center justify-center hover:border-primary-600 transition-colors"
                    >
                      {reminder.isCompleted && <Check className="w-4 h-4 text-primary-600" />}
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{getPriorityIcon(reminder.priority)}</span>
                        <h3 className={`text-lg font-semibold ${reminder.isCompleted ? 'line-through text-gray-400' : ''}`}>
                          {reminder.title}
                        </h3>
                      </div>
                      {reminder.description && (
                        <p className="text-gray-600 text-sm mb-2">{reminder.description}</p>
                      )}
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-red-600" />
                        <span className="text-red-600 font-medium">{getDateLabel(reminder.reminderDate)}</span>
                        {reminder.isRecurring && (
                          <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs">
                            Recorrente
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(reminder)}
                      className="p-2 hover:bg-gray-100 rounded"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(reminder.id)}
                      className="p-2 hover:bg-gray-100 rounded text-red-600"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Today */}
      {groupedReminders.today.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-600 mb-3 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Hoje ({groupedReminders.today.length})
          </h2>
          <div className="space-y-3">
            {groupedReminders.today.map((reminder) => (
              <Card key={reminder.id} className="border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <button
                      onClick={() => handleToggleComplete(reminder.id)}
                      className="mt-1 w-5 h-5 rounded border-2 border-gray-300 flex items-center justify-center hover:border-primary-600 transition-colors"
                    >
                      {reminder.isCompleted && <Check className="w-4 h-4 text-primary-600" />}
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{getPriorityIcon(reminder.priority)}</span>
                        <h3 className={`text-lg font-semibold ${reminder.isCompleted ? 'line-through text-gray-400' : ''}`}>
                          {reminder.title}
                        </h3>
                      </div>
                      {reminder.description && (
                        <p className="text-gray-600 text-sm mb-2">{reminder.description}</p>
                      )}
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span className="text-blue-600 font-medium">{format(parseISO(reminder.reminderDate), 'HH:mm')}</span>
                        {reminder.isRecurring && (
                          <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs">
                            Recorrente
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(reminder)}
                      className="p-2 hover:bg-gray-100 rounded"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(reminder.id)}
                      className="p-2 hover:bg-gray-100 rounded text-red-600"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming */}
      {groupedReminders.upcoming.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">
            Próximos ({groupedReminders.upcoming.length})
          </h2>
          <div className="space-y-3">
            {groupedReminders.upcoming.map((reminder) => (
              <Card key={reminder.id} className="hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <button
                      onClick={() => handleToggleComplete(reminder.id)}
                      className="mt-1 w-5 h-5 rounded border-2 border-gray-300 flex items-center justify-center hover:border-primary-600 transition-colors"
                    >
                      {reminder.isCompleted && <Check className="w-4 h-4 text-primary-600" />}
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{getPriorityIcon(reminder.priority)}</span>
                        <h3 className={`text-lg font-semibold ${reminder.isCompleted ? 'line-through text-gray-400' : ''}`}>
                          {reminder.title}
                        </h3>
                      </div>
                      {reminder.description && (
                        <p className="text-gray-600 text-sm mb-2">{reminder.description}</p>
                      )}
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{getDateLabel(reminder.reminderDate)}</span>
                        {reminder.isRecurring && (
                          <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs">
                            Recorrente
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(reminder)}
                      className="p-2 hover:bg-gray-100 rounded"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(reminder.id)}
                      className="p-2 hover:bg-gray-100 rounded text-red-600"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Completed */}
      {filter === 'all' && groupedReminders.completed.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-green-600 mb-3 flex items-center gap-2">
            <Check className="w-5 h-5" />
            Concluídos ({groupedReminders.completed.length})
          </h2>
          <div className="space-y-3 opacity-60">
            {groupedReminders.completed.map((reminder) => (
              <Card key={reminder.id} className="hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <button
                      onClick={() => handleToggleComplete(reminder.id)}
                      className="mt-1 w-5 h-5 rounded border-2 border-green-600 bg-green-600 flex items-center justify-center"
                    >
                      <Check className="w-4 h-4 text-white" />
                    </button>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold line-through text-gray-400">
                        {reminder.title}
                      </h3>
                      {reminder.description && (
                        <p className="text-gray-400 text-sm mb-2 line-through">{reminder.description}</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(reminder.id)}
                    className="p-2 hover:bg-gray-100 rounded text-red-600"
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {getFilteredReminders().length === 0 && (
        <div className="text-center py-12">
          <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Nenhum lembrete {filter === 'completed' ? 'concluído' : filter === 'pending' ? 'pendente' : 'encontrado'}</p>
          <p className="text-gray-400 text-sm">
            Clique em "Novo Lembrete" para começar
          </p>
        </div>
      )}
    </div>
  );
};
