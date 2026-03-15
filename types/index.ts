export type UserRole = 'admin' | 'family' | 'guest';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarColor: string;
}

export interface Bill {
  id: string;
  name: string;
  category: 'electricity' | 'water' | 'gas' | 'internet' | 'rent' | 'other';
  amount: number;
  dueDate: string;
  isPaid: boolean;
  isRecurring: boolean;
  paidDate?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  category: 'cleaning' | 'maintenance' | 'shopping' | 'other';
  assignedTo: string;
  dueDate: string;
  isCompleted: boolean;
  priority: 'low' | 'medium' | 'high';
  completedDate?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  location: string;
  purchaseDate?: string;
  warrantyExpiry?: string;
  notes?: string;
}

export interface MaintenanceRecord {
  id: string;
  item: string;
  type: 'appliance' | 'hvac' | 'plumbing' | 'electrical' | 'other';
  lastService: string;
  nextService: string;
  notes?: string;
  cost?: number;
  isRecurring?: boolean;
  recurringInterval?: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  photos?: string[];
  serviceHistory?: ServiceHistoryEntry[];
}

export interface ServiceHistoryEntry {
  id: string;
  date: string;
  description: string;
  cost: number;
  technician?: string;
  photos?: string[];
}

export interface AIAlert {
  id: string;
  type: 'prediction' | 'warning' | 'suggestion';
  category: 'bill' | 'maintenance' | 'energy' | 'security';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  timestamp: string;
  isRead: boolean;
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}
