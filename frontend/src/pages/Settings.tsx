import { useState, useEffect } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import api from '../services/api';
import {
  User,
  Shield,
  FileText,
  Settings as SettingsIcon,
  Moon,
  Sun,
  Check,
  X,
  Smartphone,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type Tab = 'profile' | 'security' | 'audit' | 'preferences';

export const Settings = () => {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Profile state
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  // Security state
  const [securitySummary, setSecuritySummary] = useState<any>(null);
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [verificationCode, setVerificationCode] = useState('');

  // Audit logs state
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  useEffect(() => {
    if (activeTab === 'security') {
      loadSecuritySummary();
    } else if (activeTab === 'audit') {
      loadAuditLogs();
    }
  }, [activeTab]);

  const loadSecuritySummary = async () => {
    try {
      const response = await api.get('/security/summary');
      setSecuritySummary(response.data.data);
    } catch (error) {
      toast.error('Erro ao carregar resumo de segurança');
    }
  };

  const loadAuditLogs = async () => {
    try {
      const response = await api.get('/security/audit-logs?limit=50');
      setAuditLogs(response.data.data);
    } catch (error) {
      toast.error('Erro ao carregar logs de auditoria');
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put('/auth/profile', profileData);
      toast.success('Perfil atualizado!');
    } catch (error) {
      toast.error('Erro ao atualizar perfil');
    }
  };

  const handleEnable2FA = async () => {
    try {
      const response = await api.post('/security/2fa/enable');
      setQrCode(response.data.data.qrCodeData);
      setBackupCodes(response.data.data.backupCodes);
      setShow2FASetup(true);
    } catch (error) {
      toast.error('Erro ao iniciar configuração 2FA');
    }
  };

  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/security/2fa/verify', {
        token: verificationCode,
        backupCodes,
      });
      toast.success('2FA ativado com sucesso!');
      setShow2FASetup(false);
      setVerificationCode('');
      loadSecuritySummary();
    } catch (error) {
      toast.error('Código inválido');
    }
  };

  const handleDisable2FA = async () => {
    if (!confirm('Deseja realmente desativar a autenticação de dois fatores?')) return;
    try {
      await api.post('/security/2fa/disable', {});
      toast.success('2FA desativado');
      loadSecuritySummary();
    } catch (error) {
      toast.error('Erro ao desativar 2FA');
    }
  };

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'security', label: 'Segurança', icon: Shield },
    { id: 'audit', label: 'Auditoria', icon: FileText },
    { id: 'preferences', label: 'Preferências', icon: SettingsIcon },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Configurações</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Gerencie seu perfil e preferências
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-600 dark:border-primary-400 text-primary-600 dark:text-primary-400 font-medium'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <Card>
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            Informações do Perfil
          </h2>
          <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-md">
            <Input
              label="Nome"
              value={profileData.name}
              onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              required
            />
            <Input
              label="Email"
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
              required
            />
            <Input
              label="Telefone"
              value={profileData.phone}
              onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
            />
            <Button type="submit">Salvar Alterações</Button>
          </form>
        </Card>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                  Autenticação de Dois Fatores (2FA)
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Adicione uma camada extra de segurança à sua conta
                </p>
              </div>
              {securitySummary?.twoFactorEnabled ? (
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <Check className="w-5 h-5" />
                  <span className="font-medium">Ativado</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <X className="w-5 h-5" />
                  <span>Desativado</span>
                </div>
              )}
            </div>

            {!securitySummary?.twoFactorEnabled && !show2FASetup && (
              <Button onClick={handleEnable2FA}>
                <Smartphone className="w-4 h-4 mr-2" />
                Ativar 2FA
              </Button>
            )}

            {securitySummary?.twoFactorEnabled && (
              <Button variant="danger" onClick={handleDisable2FA}>
                Desativar 2FA
              </Button>
            )}

            {show2FASetup && (
              <div className="mt-6 space-y-4">
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 text-gray-800 dark:text-white">
                    1. Escaneie o QR Code
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Use um app autenticador (Google Authenticator, Authy, etc.)
                  </p>
                  <div className="bg-white p-4 rounded inline-block">
                    <img src={qrCode} alt="QR Code" className="w-48 h-48" />
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 text-gray-800 dark:text-white">
                    2. Códigos de Backup
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Guarde estes códigos em local seguro
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {backupCodes.map((code, index) => (
                      <code
                        key={index}
                        className="bg-white dark:bg-gray-800 px-3 py-2 rounded text-sm font-mono"
                      >
                        {code}
                      </code>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleVerify2FA} className="space-y-4">
                  <Input
                    label="3. Digite o código do app"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="000000"
                    maxLength={6}
                    required
                  />
                  <div className="flex gap-2">
                    <Button type="submit">Verificar e Ativar</Button>
                    <Button variant="secondary" onClick={() => setShow2FASetup(false)}>
                      Cancelar
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </Card>

          {securitySummary && (
            <Card>
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                Resumo de Segurança
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Conta criada em:</span>
                  <span className="font-medium text-gray-800 dark:text-white">
                    {format(new Date(securitySummary.accountCreated), 'dd/MM/yyyy', {
                      locale: ptBR,
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Atividades nos últimos 7 dias:
                  </span>
                  <span className="font-medium text-gray-800 dark:text-white">
                    {securitySummary.recentActivityCount}
                  </span>
                </div>
                {securitySummary.lastActivity && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Última atividade:</span>
                    <span className="font-medium text-gray-800 dark:text-white">
                      {format(
                        new Date(securitySummary.lastActivity),
                        "dd/MM/yyyy 'às' HH:mm",
                        { locale: ptBR }
                      )}
                    </span>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Audit Tab */}
      {activeTab === 'audit' && (
        <Card>
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            Log de Auditoria
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Histórico de atividades da sua conta
          </p>
          <div className="space-y-2">
            {auditLogs.map((log: any) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-800 dark:text-white">
                    {log.action.replace(/_/g, ' ')}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    IP: {log.ip_address}
                  </p>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {format(new Date(log.created_at), "dd/MM 'às' HH:mm", { locale: ptBR })}
                </span>
              </div>
            ))}
            {auditLogs.length === 0 && (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                Nenhuma atividade registrada
              </p>
            )}
          </div>
        </Card>
      )}

      {/* Preferences Tab */}
      {activeTab === 'preferences' && (
        <Card>
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            Preferências
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div>
                <p className="font-medium text-gray-800 dark:text-white">Tema</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {theme === 'dark' ? 'Modo escuro' : 'Modo claro'}
                </p>
              </div>
              <button
                onClick={toggleTheme}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                {theme === 'dark' ? (
                  <Sun className="w-6 h-6 text-yellow-500" />
                ) : (
                  <Moon className="w-6 h-6 text-gray-600" />
                )}
              </button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
