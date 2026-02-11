import { useEffect, useState } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import api from '../services/api';
import { Transaction, FinancialSummary } from '../types';
import { Plus, TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react';
import { LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export const Financial = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [period, setPeriod] = useState<'month' | 'year' | 'custom'>('month');
  const [startDate, setStartDate] = useState(format(startOfMonth(new Date()), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(endOfMonth(new Date()), 'yyyy-MM-dd'));
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    transactionType: 'expense' as 'income' | 'expense',
    category: '',
    transactionDate: format(new Date(), 'yyyy-MM-dd'),
    paymentMethod: '',
    notes: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [startDate, endDate]);

  const loadData = async () => {
    try {
      const [transactionsRes, summaryRes] = await Promise.all([
        api.get(`/transactions?startDate=${startDate}&endDate=${endDate}`),
        api.get(`/transactions/summary?startDate=${startDate}&endDate=${endDate}`),
      ]);
      setTransactions(transactionsRes.data);
      setSummary(summaryRes.data);
    } catch (error) {
      toast.error('Erro ao carregar dados financeiros');
    }
  };

  const handlePeriodChange = (newPeriod: 'month' | 'year' | 'custom') => {
    setPeriod(newPeriod);
    const now = new Date();

    if (newPeriod === 'month') {
      setStartDate(format(startOfMonth(now), 'yyyy-MM-dd'));
      setEndDate(format(endOfMonth(now), 'yyyy-MM-dd'));
    } else if (newPeriod === 'year') {
      setStartDate(format(new Date(now.getFullYear(), 0, 1), 'yyyy-MM-dd'));
      setEndDate(format(new Date(now.getFullYear(), 11, 31), 'yyyy-MM-dd'));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        amount: parseFloat(formData.amount),
      };

      if (editingId) {
        await api.put(`/transactions/${editingId}`, data);
        toast.success('Transação atualizada!');
      } else {
        await api.post('/transactions', data);
        toast.success('Transação registrada!');
      }
      resetForm();
      loadData();
    } catch (error) {
      toast.error('Erro ao salvar transação');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir esta transação?')) return;
    try {
      await api.delete(`/transactions/${id}`);
      toast.success('Transação excluída!');
      loadData();
    } catch (error) {
      toast.error('Erro ao excluir transação');
    }
  };

  const resetForm = () => {
    setFormData({
      description: '',
      amount: '',
      transactionType: 'expense',
      category: '',
      transactionDate: format(new Date(), 'yyyy-MM-dd'),
      paymentMethod: '',
      notes: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const getPieChartData = () => {
    if (!summary) return [];

    return summary.byCategory
      .filter(item => item.category)
      .map(item => ({
        name: item.category || 'Sem categoria',
        value: Number(item._sum.amount) || 0,
        type: item.transactionType,
      }))
      .filter(item => item.value > 0);
  };

  const getLineChartData = () => {
    // Agrupa transações por data
    const groupedByDate: { [key: string]: { income: number; expense: number } } = {};

    transactions.forEach(t => {
      const date = format(new Date(t.transactionDate), 'dd/MM');
      if (!groupedByDate[date]) {
        groupedByDate[date] = { income: 0, expense: 0 };
      }

      if (t.transactionType === 'income') {
        groupedByDate[date].income += Number(t.amount);
      } else {
        groupedByDate[date].expense += Number(t.amount);
      }
    });

    return Object.entries(groupedByDate)
      .map(([date, values]) => ({
        date,
        Entradas: values.income,
        Saídas: values.expense,
      }))
      .slice(-10); // Últimos 10 dias
  };

  const getCategoryBarData = () => {
    if (!summary) return [];

    const categories: { [key: string]: { income: number; expense: number } } = {};

    summary.byCategory.forEach(item => {
      const cat = item.category || 'Sem categoria';
      if (!categories[cat]) {
        categories[cat] = { income: 0, expense: 0 };
      }

      const value = Number(item._sum.amount) || 0;
      if (item.transactionType === 'income') {
        categories[cat].income = value;
      } else {
        categories[cat].expense = value;
      }
    });

    return Object.entries(categories).map(([name, values]) => ({
      name,
      Entradas: values.income,
      Saídas: values.expense,
    }));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Financeiro</h1>
          <p className="text-gray-600 mt-1">Controle completo de entradas e saídas</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Transação
        </Button>
      </div>

      {/* Period Filter */}
      <Card className="mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex gap-2">
            <Button
              variant={period === 'month' ? 'primary' : 'secondary'}
              onClick={() => handlePeriodChange('month')}
            >
              Mês
            </Button>
            <Button
              variant={period === 'year' ? 'primary' : 'secondary'}
              onClick={() => handlePeriodChange('year')}
            >
              Ano
            </Button>
            <Button
              variant={period === 'custom' ? 'primary' : 'secondary'}
              onClick={() => handlePeriodChange('custom')}
            >
              Personalizado
            </Button>
          </div>

          {period === 'custom' && (
            <div className="flex gap-2 items-center">
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <span>até</span>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
              <Button onClick={loadData}>Filtrar</Button>
            </div>
          )}
        </div>
      </Card>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Entradas</p>
                <p className="text-3xl font-bold text-green-600">
                  R$ {Number(summary.income).toFixed(2)}
                </p>
              </div>
              <div className="bg-green-50 p-3 rounded-full">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Saídas</p>
                <p className="text-3xl font-bold text-red-600">
                  R$ {Number(summary.expense).toFixed(2)}
                </p>
              </div>
              <div className="bg-red-50 p-3 rounded-full">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Saldo</p>
                <p className={`text-3xl font-bold ${
                  Number(summary.balance) >= 0 ? 'text-blue-600' : 'text-red-600'
                }`}>
                  R$ {Number(summary.balance).toFixed(2)}
                </p>
              </div>
              <div className={`${
                Number(summary.balance) >= 0 ? 'bg-blue-50' : 'bg-red-50'
              } p-3 rounded-full`}>
                <DollarSign className={`w-6 h-6 ${
                  Number(summary.balance) >= 0 ? 'text-blue-600' : 'text-red-600'
                }`} />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Line Chart */}
        <Card title="Entradas vs Saídas (Últimos 10 dias)">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={getLineChartData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => `R$ ${Number(value).toFixed(2)}`} />
              <Legend />
              <Line type="monotone" dataKey="Entradas" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="Saídas" stroke="#ef4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Pie Chart */}
        <Card title="Distribuição por Categoria">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={getPieChartData()}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {getPieChartData().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `R$ ${Number(value).toFixed(2)}`} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Bar Chart */}
        <Card title="Por Categoria" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getCategoryBarData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `R$ ${Number(value).toFixed(2)}`} />
              <Legend />
              <Bar dataKey="Entradas" fill="#10b981" />
              <Bar dataKey="Saídas" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Form */}
      {showForm && (
        <Card className="mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingId ? 'Editar Transação' : 'Nova Transação'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Descrição *"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
              <Input
                label="Valor *"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo *
                </label>
                <select
                  value={formData.transactionType}
                  onChange={(e) => setFormData({ ...formData, transactionType: e.target.value as 'income' | 'expense' })}
                  className="input"
                  required
                >
                  <option value="income">Entrada</option>
                  <option value="expense">Saída</option>
                </select>
              </div>

              <Input
                label="Categoria"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Ex: Alimentação, Salário"
              />

              <Input
                label="Data *"
                type="date"
                value={formData.transactionDate}
                onChange={(e) => setFormData({ ...formData, transactionDate: e.target.value })}
                required
              />
            </div>

            <Input
              label="Forma de Pagamento"
              value={formData.paymentMethod}
              onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              placeholder="Ex: PIX, Cartão, Dinheiro"
            />

            <div className="flex gap-2">
              <Button type="submit">{editingId ? 'Atualizar' : 'Salvar'}</Button>
              <Button variant="secondary" onClick={resetForm}>
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Transactions List */}
      <Card title="Últimas Transações">
        <div className="space-y-2">
          {transactions.slice(0, 10).map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className={`${
                  transaction.transactionType === 'income' ? 'bg-green-50' : 'bg-red-50'
                } p-2 rounded-full`}>
                  {transaction.transactionType === 'income' ? (
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{transaction.description}</p>
                  <div className="flex gap-2 text-sm text-gray-600">
                    {transaction.category && (
                      <span className="bg-gray-100 px-2 py-0.5 rounded">
                        {transaction.category}
                      </span>
                    )}
                    <span>{format(new Date(transaction.transactionDate), 'dd/MM/yyyy')}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-lg font-semibold ${
                  transaction.transactionType === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.transactionType === 'income' ? '+' : '-'}
                  R$ {Number(transaction.amount).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {transactions.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Nenhuma transação encontrada no período
          </div>
        )}
      </Card>
    </div>
  );
};
