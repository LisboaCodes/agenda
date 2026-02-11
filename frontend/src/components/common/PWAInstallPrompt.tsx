import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';
import { Button } from './Button';
import { promptPWAInstall, isPWAInstalled } from '../../utils/pwa';

export const PWAInstallPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if already installed or dismissed
    const isDismissed = localStorage.getItem('pwa-install-dismissed');
    if (isPWAInstalled() || isDismissed) {
      return;
    }

    const handleInstallAvailable = () => {
      setShowPrompt(true);
    };

    window.addEventListener('pwa-install-available', handleInstallAvailable);

    return () => {
      window.removeEventListener('pwa-install-available', handleInstallAvailable);
    };
  }, []);

  const handleInstall = async () => {
    const accepted = await promptPWAInstall();
    if (accepted) {
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setDismissed(true);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  if (!showPrompt || dismissed) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 border border-gray-200 dark:border-gray-700 z-50 animate-slide-up">
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
        aria-label="Fechar"
      >
        <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
      </button>

      <div className="flex items-start gap-3">
        <div className="bg-primary-50 dark:bg-primary-900/30 p-2 rounded-lg">
          <Download className="w-6 h-6 text-primary-600 dark:text-primary-400" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-1">
            Instalar CONTROLE
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Instale o app para acesso rápido e uso offline
          </p>
          <div className="flex gap-2">
            <Button onClick={handleInstall} size="sm">
              Instalar
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
