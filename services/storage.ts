import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Bill, Task, InventoryItem, MaintenanceRecord, AIAlert, EmergencyContact } from '@/types';

const KEYS = {
  USER: 'user',
  BILLS: 'bills',
  TASKS: 'tasks',
  INVENTORY: 'inventory',
  MAINTENANCE: 'maintenance',
  AI_ALERTS: 'ai_alerts',
  EMERGENCY_CONTACTS: 'emergency_contacts',
};

// User
export const saveUser = async (user: User): Promise<void> => {
  await AsyncStorage.setItem(KEYS.USER, JSON.stringify(user));
};

export const getUser = async (): Promise<User | null> => {
  const data = await AsyncStorage.getItem(KEYS.USER);
  return data ? JSON.parse(data) : null;
};

export const clearUser = async (): Promise<void> => {
  await AsyncStorage.removeItem(KEYS.USER);
};

// Bills
export const saveBills = async (bills: Bill[]): Promise<void> => {
  await AsyncStorage.setItem(KEYS.BILLS, JSON.stringify(bills));
};

export const getBills = async (): Promise<Bill[]> => {
  const data = await AsyncStorage.getItem(KEYS.BILLS);
  return data ? JSON.parse(data) : [];
};

// Tasks
export const saveTasks = async (tasks: Task[]): Promise<void> => {
  await AsyncStorage.setItem(KEYS.TASKS, JSON.stringify(tasks));
};

export const getTasks = async (): Promise<Task[]> => {
  const data = await AsyncStorage.getItem(KEYS.TASKS);
  return data ? JSON.parse(data) : [];
};

// Inventory
export const saveInventory = async (items: InventoryItem[]): Promise<void> => {
  await AsyncStorage.setItem(KEYS.INVENTORY, JSON.stringify(items));
};

export const getInventory = async (): Promise<InventoryItem[]> => {
  const data = await AsyncStorage.getItem(KEYS.INVENTORY);
  return data ? JSON.parse(data) : [];
};

// Maintenance
export const saveMaintenance = async (records: MaintenanceRecord[]): Promise<void> => {
  await AsyncStorage.setItem(KEYS.MAINTENANCE, JSON.stringify(records));
};

export const getMaintenance = async (): Promise<MaintenanceRecord[]> => {
  const data = await AsyncStorage.getItem(KEYS.MAINTENANCE);
  return data ? JSON.parse(data) : [];
};

// AI Alerts
export const saveAIAlerts = async (alerts: AIAlert[]): Promise<void> => {
  await AsyncStorage.setItem(KEYS.AI_ALERTS, JSON.stringify(alerts));
};

export const getAIAlerts = async (): Promise<AIAlert[]> => {
  const data = await AsyncStorage.getItem(KEYS.AI_ALERTS);
  return data ? JSON.parse(data) : [];
};

// Emergency Contacts
export const saveEmergencyContacts = async (contacts: EmergencyContact[]): Promise<void> => {
  await AsyncStorage.setItem(KEYS.EMERGENCY_CONTACTS, JSON.stringify(contacts));
};

export const getEmergencyContacts = async (): Promise<EmergencyContact[]> => {
  const data = await AsyncStorage.getItem(KEYS.EMERGENCY_CONTACTS);
  return data ? JSON.parse(data) : [];
};
