import { useEffect, useState } from 'react';
import { notificationService, type NotificationPermission } from '../services/notificationService';

export const useNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>(
    notificationService.getPermission()
  );
  const [isSupported] = useState(notificationService.isSupported());

  useEffect(() => {
    // Update permission when it changes
    const checkPermission = () => {
      setPermission(notificationService.getPermission());
    };

    // Check permission periodically
    const interval = setInterval(checkPermission, 1000);

    return () => clearInterval(interval);
  }, []);

  const requestPermission = async () => {
    const newPermission = await notificationService.requestPermission();
    setPermission(newPermission);
    return newPermission;
  };

  const showNotification = async (options: {
    title: string;
    body?: string;
    icon?: string;
    tag?: string;
    data?: any;
  }) => {
    return notificationService.show(options);
  };

  const showReminder = async (reminder: {
    id: string;
    title: string;
    description?: string;
    priority?: string;
  }) => {
    return notificationService.showReminder(reminder);
  };

  const showFinancialAlert = async (alert: {
    title: string;
    amount: number;
    type: 'payment' | 'income' | 'expense';
  }) => {
    return notificationService.showFinancialAlert(alert);
  };

  const scheduleNotification = (
    options: { title: string; body?: string },
    scheduledTime: Date
  ) => {
    return notificationService.scheduleNotification(options, scheduledTime);
  };

  const cancelNotification = (timeoutId: number) => {
    notificationService.cancelScheduledNotification(timeoutId);
  };

  return {
    permission,
    isSupported,
    isGranted: permission === 'granted',
    requestPermission,
    showNotification,
    showReminder,
    showFinancialAlert,
    scheduleNotification,
    cancelNotification,
  };
};
