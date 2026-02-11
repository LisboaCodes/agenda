import { useEffect, useState } from 'react';
import { Bell, X } from 'lucide-react';
import { Button } from './Button';
import { useNotifications } from '../../hooks/useNotifications';

export const NotificationPrompt = () => {
  const { permission, isSupported, requestPermission } = useNotifications();
  const [showPrompt, setShowPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if should show prompt
    const isDismissed = localStorage.getItem('notification-prompt-dismissed');

    if (!isSupported || isDismissed || permission === 'granted' || permission === 'denied') {
      return;
    }

    // Show prompt after 5 seconds
    const timer = setTimeout(() => {
      setShowPrompt(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, [isSupported, permission]);

  const handleEnable = async () => {
    const result = await requestPermission();
    if (result === 'granted') {
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setDismissed(true);
    localStorage.setItem('notification-prompt-dismissed', 'true');
  };

  if (!showPrompt || dismissed || !isSupported || permission !== 'default') {
    return null;
  }

  return (
    <div className="fixed top-20 right-4 w-96 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 border border-gray-200 dark:border-gray-700 z-40 animate-slide-down">
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
        aria-label="Fechar"
      >
        <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
      </button>

      <div className="flex items-start gap-3">
        <div className="bg-primary-50 dark:bg-primary-900/30 p-2 rounded-lg">
          <Bell className="w-6 h-6 text-primary-600 dark:text-primary-400" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-1">
            Ativar Notificações
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Receba alertas sobre lembretes importantes e pagamentos pendentes
          </p>
          <div className="flex gap-2">
            <Button onClick={handleEnable} size="sm">
              Ativar
            </Button>
            <Button onClick={handleDismiss} variant="secondary" size="sm">
              Agora não
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
