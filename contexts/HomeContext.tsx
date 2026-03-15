import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User, Bill, Task, InventoryItem, MaintenanceRecord, AIAlert, EmergencyContact } from '@/types';
import * as storage from '@/services/storage';
import { generateAIAlerts } from '@/services/aiService';

interface HomeContextType {
  user: User | null;
  bills: Bill[];
  tasks: Task[];
  inventory: InventoryItem[];
  maintenance: MaintenanceRecord[];
  aiAlerts: AIAlert[];
  emergencyContacts: EmergencyContact[];
  
  setUser: (user: User) => void;
  logout: () => void;
  
  addBill: (bill: Bill) => void;
  updateBill: (id: string, updates: Partial<Bill>) => void;
  deleteBill: (id: string) => void;
  
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  
  addInventoryItem: (item: InventoryItem) => void;
  updateInventoryItem: (id: string, updates: Partial<InventoryItem>) => void;
  deleteInventoryItem: (id: string) => void;
  
  addMaintenanceRecord: (record: MaintenanceRecord) => void;
  updateMaintenanceRecord: (id: string, updates: Partial<MaintenanceRecord>) => void;
  deleteMaintenanceRecord: (id: string) => void;
  
  markAlertAsRead: (id: string) => void;
  refreshAIAlerts: () => void;
  
  addEmergencyContact: (contact: EmergencyContact) => void;
  deleteEmergencyContact: (id: string) => void;
  triggerEmergency: () => void;
}

export const HomeContext = createContext<HomeContextType | undefined>(undefined);

export function HomeProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [bills, setBills] = useState<Bill[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [maintenance, setMaintenance] = useState<MaintenanceRecord[]>([]);
  const [aiAlerts, setAIAlerts] = useState<AIAlert[]>([]);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [
      loadedUser,
      loadedBills,
      loadedTasks,
      loadedInventory,
      loadedMaintenance,
      loadedAlerts,
      loadedContacts,
    ] = await Promise.all([
      storage.getUser(),
      storage.getBills(),
      storage.getTasks(),
      storage.getInventory(),
      storage.getMaintenance(),
      storage.getAIAlerts(),
      storage.getEmergencyContacts(),
    ]);

    if (loadedUser) setUserState(loadedUser);
    setBills(loadedBills);
    setTasks(loadedTasks);
    setInventory(loadedInventory);
    setMaintenance(loadedMaintenance);
    setAIAlerts(loadedAlerts);
    setEmergencyContacts(loadedContacts);
  };

  const setUser = async (newUser: User) => {
    setUserState(newUser);
    await storage.saveUser(newUser);
  };

  const logout = async () => {
    setUserState(null);
    await storage.clearUser();
  };

  // Bills
  const addBill = async (bill: Bill) => {
    const updated = [...bills, bill];
    setBills(updated);
    await storage.saveBills(updated);
    refreshAIAlerts();
  };

  const updateBill = async (id: string, updates: Partial<Bill>) => {
    const updated = bills.map(b => b.id === id ? { ...b, ...updates } : b);
    setBills(updated);
    await storage.saveBills(updated);
    refreshAIAlerts();
  };

  const deleteBill = async (id: string) => {
    const updated = bills.filter(b => b.id !== id);
    setBills(updated);
    await storage.saveBills(updated);
  };

  // Tasks
  const addTask = async (task: Task) => {
    const updated = [...tasks, task];
    setTasks(updated);
    await storage.saveTasks(updated);
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    const updated = tasks.map(t => t.id === id ? { ...t, ...updates } : t);
    setTasks(updated);
    await storage.saveTasks(updated);
  };

  const deleteTask = async (id: string) => {
    const updated = tasks.filter(t => t.id !== id);
    setTasks(updated);
    await storage.saveTasks(updated);
  };

  // Inventory
  const addInventoryItem = async (item: InventoryItem) => {
    const updated = [...inventory, item];
    setInventory(updated);
    await storage.saveInventory(updated);
  };

  const updateInventoryItem = async (id: string, updates: Partial<InventoryItem>) => {
    const updated = inventory.map(i => i.id === id ? { ...i, ...updates } : i);
    setInventory(updated);
    await storage.saveInventory(updated);
  };

  const deleteInventoryItem = async (id: string) => {
    const updated = inventory.filter(i => i.id !== id);
    setInventory(updated);
    await storage.saveInventory(updated);
  };

  // Maintenance
  const addMaintenanceRecord = async (record: MaintenanceRecord) => {
    const updated = [...maintenance, record];
    setMaintenance(updated);
    await storage.saveMaintenance(updated);
    refreshAIAlerts();
  };

  const updateMaintenanceRecord = async (id: string, updates: Partial<MaintenanceRecord>) => {
    const updated = maintenance.map(m => m.id === id ? { ...m, ...updates } : m);
    setMaintenance(updated);
    await storage.saveMaintenance(updated);
    refreshAIAlerts();
  };

  const deleteMaintenanceRecord = async (id: string) => {
    const updated = maintenance.filter(m => m.id !== id);
    setMaintenance(updated);
    await storage.saveMaintenance(updated);
  };

  // AI Alerts
  const refreshAIAlerts = async () => {
    const newAlerts = generateAIAlerts(bills, maintenance);
    setAIAlerts(newAlerts);
    await storage.saveAIAlerts(newAlerts);
  };

  const markAlertAsRead = async (id: string) => {
    const updated = aiAlerts.map(a => a.id === id ? { ...a, isRead: true } : a);
    setAIAlerts(updated);
    await storage.saveAIAlerts(updated);
  };

  // Emergency Contacts
  const addEmergencyContact = async (contact: EmergencyContact) => {
    const updated = [...emergencyContacts, contact];
    setEmergencyContacts(updated);
    await storage.saveEmergencyContacts(updated);
  };

  const deleteEmergencyContact = async (id: string) => {
    const updated = emergencyContacts.filter(c => c.id !== id);
    setEmergencyContacts(updated);
    await storage.saveEmergencyContacts(updated);
  };

  const triggerEmergency = () => {
    // In real implementation, this would send SMS/push notifications
    console.log('EMERGENCY TRIGGERED - Notifying contacts:', emergencyContacts);
  };

  return (
    <HomeContext.Provider
      value={{
        user,
        bills,
        tasks,
        inventory,
        maintenance,
        aiAlerts,
        emergencyContacts,
        setUser,
        logout,
        addBill,
        updateBill,
        deleteBill,
        addTask,
        updateTask,
        deleteTask,
        addInventoryItem,
        updateInventoryItem,
        deleteInventoryItem,
        addMaintenanceRecord,
        updateMaintenanceRecord,
        deleteMaintenanceRecord,
        markAlertAsRead,
        refreshAIAlerts,
        addEmergencyContact,
        deleteEmergencyContact,
        triggerEmergency,
      }}
    >
      {children}
    </HomeContext.Provider>
  );
}
