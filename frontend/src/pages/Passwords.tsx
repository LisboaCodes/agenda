import { useEffect, useState } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import api from '../services/api';
import { Password } from '../types';
import { Plus, Trash2, Edit, Eye, EyeOff, Copy, RefreshCw, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

export const Passwords = () => {
  const [passwords, setPasswords] = useState<Password[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showPassword, setShowPassword] = useState<string | null>(null);
  const [pin, setPin] = useState('');
  const [showPinModal, setShowPinModal] = useState(false);
  const [selectedPasswordId, setSelectedPasswordId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    serviceName: '',
    username: '',
    email: '',
    password: '',
    url: '',
    category: '',
    notes: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    loadPasswords();
  }, []);

  useEffect(() => {
    if (formData.password) {
      calculatePasswordStrength(formData.password);
    }
  }, [formData.password]);

  const loadPasswords = async () => {
    try {
      const response = await api.get('/passwords');
      setPasswords(response.data);
    } catch (error) {
      toast.error('Erro ao carregar senhas');
    }
  };

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 10;
    setPasswordStrength(Math.min(strength, 100));
  };

  const generatePassword = async () => {
    try {
      const response = await api.get('/passwords/generate?length=16');
      const newPassword = response.data.password;
      setGeneratedPassword(newPassword);
      setFormData({ ...formData, password: newPassword });
      toast.success('Senha gerada!');
    } catch (error) {
      toast.error('Erro ao gerar senha');
    }
  };

  const handleViewPassword = async (id: string) => {
    setSelectedPasswordId(id);
    setShowPinModal(true);
  };

  const verifyPinAndShowPassword = async () => {
    // Simulação de PIN - em produção, validar no backend
    if (pin.length < 4) {
      toast.error('PIN deve ter pelo menos 4 dígitos');
      return;
    }

    try {
      const response = await api.get(`/passwords/${selectedPasswordId}`);
      setShowPassword(selectedPasswordId);
      toast.success('Senha revelada!');
      setShowPinModal(false);
      setPin('');

      // Auto-esconder após 30 segundos
      setTimeout(() => {
        setShowPassword(null);
      }, 30000);
    } catch (error) {
      toast.error('Erro ao buscar senha');
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copiado para a área de transferência!');
    } catch (error) {
      toast.error('Erro ao copiar');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/passwords/${editingId}`, formData);
        toast.success('Senha atualizada!');
      } else {
        await api.post('/passwords', formData);
        toast.success('Senha criada!');
      }
      resetForm();
      loadPasswords();
    } catch (error) {
      toast.error('Erro ao salvar senha');
    }
  };

  const handleEdit = (password: Password) => {
    setFormData({
      serviceName: password.serviceName,
      username: password.username || '',
      email: password.email || '',
      password: '',
      url: password.url || '',
      category: password.category || '',
      notes: '',
    });
    setEditingId(password.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir esta senha?')) return;
    try {
      await api.delete(`/passwords/${id}`);
      toast.success('Senha excluída!');
      loadPasswords();
    } catch (error) {
      toast.error('Erro ao excluir senha');
    }
  };

  const resetForm = () => {
    setFormData({
      serviceName: '',
      username: '',
      email: '',
      password: '',
      url: '',
      category: '',
      notes: '',
    });
    setEditingId(null);
    setShowForm(false);
    setGeneratedPassword('');
    setPasswordStrength(0);
  };

  const getStrengthColor = () => {
    if (passwordStrength < 40) return 'bg-red-500';
    if (passwordStrength < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    if (passwordStrength < 40) return 'Fraca';
    if (passwordStrength < 70) return 'Média';
    return 'Forte';
  };

  const getCategoryIcon = (category?: string) => {
    const icons: any = {
      email: '📧',
      social: '👥',
      banco: '🏦',
      trabalho: '💼',
      pessoal: '🔑',
    };
    return icons[category || 'pessoal'] || '🔐';
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gerenciador de Senhas</h1>
          <p className="text-gray-600 mt-1">Suas senhas criptografadas com AES-256</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Senha
        </Button>
      </div>

      {/* PIN Modal */}
      {showPinModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-6 h-6 text-primary-600" />
              <h3 className="text-xl font-semibold">Digite seu PIN</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Para sua segurança, digite o PIN para visualizar a senha
            </p>
            <Input
              type="password"
              label="PIN de Segurança"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="****"
              maxLength={6}
              autoFocus
            />
            <div className="flex gap-2 mt-4">
              <Button onClick={verifyPinAndShowPassword}>
                Confirmar
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowPinModal(false);
                  setPin('');
                }}
              >
                Cancelar
              </Button>
            </div>
          </Card>
        </div>
      )}

      {showForm && (
        <Card className="mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingId ? 'Editar Senha' : 'Nova Senha'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Serviço *"
                value={formData.serviceName}
                onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
                placeholder="Ex: Gmail, GitHub, Netflix"
                required
              />
              <Input
                label="Categoria"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="email, social, banco, trabalho"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Usuário"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="seu_usuario"
              />
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@exemplo.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Senha *
              </label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Input
                    type="text"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Digite ou gere uma senha"
                    required
                  />
                </div>
                <Button type="button" onClick={generatePassword} variant="secondary">
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>

              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">Força da senha:</span>
                    <span className={`font-medium ${
                      passwordStrength < 40 ? 'text-red-600' :
                      passwordStrength < 70 ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {getStrengthText()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`${getStrengthColor()} h-2 rounded-full transition-all duration-300`}
                      style={{ width: `${passwordStrength}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <Input
              label="URL"
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="https://exemplo.com"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Observações
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="input min-h-[80px]"
                placeholder="Anotações adicionais..."
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit">{editingId ? 'Atualizar' : 'Salvar'}</Button>
              <Button variant="secondary" onClick={resetForm}>
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {passwords.map((password) => (
          <Card key={password.id} className="hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{getCategoryIcon(password.category)}</span>
                <div>
                  <h3 className="text-lg font-semibold">{password.serviceName}</h3>
                  {password.category && (
                    <span className="text-xs text-gray-500 capitalize">
                      {password.category}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {password.username && (
              <div className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Usuário:</span> {password.username}
              </div>
            )}

            {password.email && (
              <div className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Email:</span> {password.email}
              </div>
            )}

            {password.url && (
              <div className="text-sm text-gray-600 mb-3">
                <a
                  href={password.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:underline"
                >
                  Acessar site →
                </a>
              </div>
            )}

            <div className="flex gap-2 mt-4 pt-4 border-t">
              <button
                onClick={() => handleViewPassword(password.id)}
                className="flex-1 p-2 hover:bg-gray-100 rounded flex items-center justify-center gap-1 text-sm"
                title="Ver senha"
              >
                {showPassword === password.id ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={() => handleEdit(password)}
                className="flex-1 p-2 hover:bg-gray-100 rounded flex items-center justify-center gap-1 text-sm"
                title="Editar"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(password.id)}
                className="flex-1 p-2 hover:bg-gray-100 rounded text-red-600 flex items-center justify-center gap-1 text-sm"
                title="Excluir"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </Card>
        ))}
      </div>

      {passwords.length === 0 && !showForm && (
        <div className="text-center py-12">
          <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Nenhuma senha cadastrada</p>
          <p className="text-gray-400 text-sm">
            Clique em "Nova Senha" para começar
          </p>
        </div>
      )}
    </div>
  );
};
