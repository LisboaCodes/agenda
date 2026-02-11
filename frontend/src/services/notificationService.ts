/**
 * Notification Service
 * Handles browser notifications for reminders and other events
 */

export type NotificationPermission = 'granted' | 'denied' | 'default';

export interface NotificationOptions {
  title: string;
  body?: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: any;
  requireInteraction?: boolean;
  silent?: boolean;
  vibrate?: number[];
}

class NotificationService {
  private permission: NotificationPermission = 'default';

  constructor() {
    if ('Notification' in window) {
      this.permission = Notification.permission;
    }
  }

  /**
   * Request notification permission from user
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.warn('Browser does not support notifications');
      return 'denied';
    }

    if (this.permission === 'granted') {
      return 'granted';
    }

    const permission = await Notification.requestPermission();
    this.permission = permission;
    return permission;
  }

  /**
   * Check if notifications are supported and permitted
   */
  isSupported(): boolean {
    return 'Notification' in window;
  }

  /**
   * Check if permission is granted
   */
  isGranted(): boolean {
    return this.permission === 'granted';
  }

  /**
   * Get current permission status
   */
  getPermission(): NotificationPermission {
    return this.permission;
  }

  /**
   * Show a notification
   */
  async show(options: NotificationOptions): Promise<boolean> {
    if (!this.isSupported()) {
      console.warn('Notifications not supported');
      return false;
    }

    if (!this.isGranted()) {
      const permission = await this.requestPermission();
      if (permission !== 'granted') {
        return false;
      }
    }

    try {
      const notification = new Notification(options.title, {
        body: options.body,
        icon: options.icon || '/icon-192.png',
        badge: options.badge || '/icon-192.png',
        tag: options.tag,
        data: options.data,
        requireInteraction: options.requireInteraction || false,
        silent: options.silent || false,
        vibrate: options.vibrate || [200, 100, 200],
      });

      // Handle notification click
      notification.onclick = (event) => {
        event.preventDefault();
        window.focus();
        notification.close();

        // Navigate to specific page if data contains a URL
        if (options.data?.url) {
          window.location.href = options.data.url;
        }
      };

      return true;
    } catch (error) {
      console.error('Error showing notification:', error);
      return false;
    }
  }

  /**
   * Show reminder notification
   */
  async showReminder(reminder: {
    id: string;
    title: string;
    description?: string;
    priority?: string;
  }): Promise<boolean> {
    const priorityEmojis: Record<string, string> = {
      urgent: '🔴',
      high: '🟠',
      medium: '🟡',
      low: '🔵',
    };

    const emoji = priorityEmojis[reminder.priority || 'medium'] || '🔔';

    return this.show({
      title: `${emoji} Lembrete: ${reminder.title}`,
      body: reminder.description || 'Você tem um lembrete',
      tag: `reminder-${reminder.id}`,
      requireInteraction: reminder.priority === 'urgent',
      data: {
        url: '/reminders',
        reminderId: reminder.id,
      },
    });
  }

  /**
   * Show financial notification
   */
  async showFinancialAlert(alert: {
    title: string;
    amount: number;
    type: 'payment' | 'income' | 'expense';
  }): Promise<boolean> {
    const icons: Record<string, string> = {
      payment: '💰',
      income: '💵',
      expense: '💸',
    };

    return this.show({
      title: `${icons[alert.type]} ${alert.title}`,
      body: `R$ ${alert.amount.toFixed(2)}`,
      tag: `financial-${Date.now()}`,
      data: {
        url: '/financial',
      },
    });
  }

  /**
   * Schedule notification for a specific time
   */
  scheduleNotification(
    options: NotificationOptions,
    scheduledTime: Date
  ): number | null {
    const now = new Date();
    const delay = scheduledTime.getTime() - now.getTime();

    if (delay <= 0) {
      // Time has passed, show immediately
      this.show(options);
      return null;
    }

    // Schedule notification
    const timeoutId = window.setTimeout(() => {
      this.show(options);
    }, delay);

    return timeoutId;
  }

  /**
   * Cancel scheduled notification
   */
  cancelScheduledNotification(timeoutId: number): void {
    clearTimeout(timeoutId);
  }
}

// Export singleton instance
export const notificationService = new NotificationService();
