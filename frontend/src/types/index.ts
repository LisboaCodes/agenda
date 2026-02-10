export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Note {
  id: string;
  userId: string;
  title: string;
  content?: string;
  category?: string;
  tags: string[];
  isPinned: boolean;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Memory {
  id: string;
  userId: string;
  title: string;
  description?: string;
  memoryDate?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
  files?: File[];
}

export interface File {
  id: string;
  userId: string;
  referenceType?: string;
  referenceId?: string;
  fileName: string;
  fileType?: string;
  fileUrl: string;
  fileSize?: number;
  mimeType?: string;
  createdAt: string;
}

export interface Password {
  id: string;
  userId: string;
  serviceName: string;
  username?: string;
  email?: string;
  url?: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
  password?: string;
}

export interface Service {
  id: string;
  userId: string;
  serviceName: string;
  description?: string;
  provider?: string;
  contractStart?: string;
  contractEnd?: string;
  monthlyCost?: number;
  status?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: string;
  userId: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  address?: string;
  notes?: string;
  status?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  userId: string;
  clientId?: string;
  serviceId?: string;
  description: string;
  amount: number;
  paymentType: string;
  paymentMethod?: string;
  dueDate?: string;
  paidDate?: string;
  status: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  client?: { id: string; name: string; email?: string };
  service?: { id: string; serviceName: string };
}

export interface Transaction {
  id: string;
  userId: string;
  description: string;
  amount: number;
  transactionType: string;
  category?: string;
  transactionDate: string;
  paymentMethod?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Reminder {
  id: string;
  userId: string;
  title: string;
  description?: string;
  reminderDate: string;
  isRecurring: boolean;
  recurrencePattern?: string;
  isCompleted: boolean;
  priority?: string;
  notificationSent: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FinancialSummary {
  income: number;
  expense: number;
  balance: number;
  byCategory: {
    category: string | null;
    transactionType: string;
    _sum: { amount: number | null };
    _count: number;
  }[];
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}
