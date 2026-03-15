import { Bill, Task, MaintenanceRecord } from '@/types';

export interface MonthlySpending {
  month: string;
  bills: number;
  maintenance: number;
  total: number;
}

export interface CategorySpending {
  category: string;
  amount: number;
  percentage: number;
}

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  completionRate: number;
  byCategory: { category: string; count: number }[];
}

export interface BillTrends {
  onTimePayments: number;
  latePayments: number;
  averageAmount: number;
  recurringTotal: number;
  paymentRate: number;
}

export interface MaintenanceInsights {
  totalCost: number;
  averageCost: number;
  byType: { type: string; cost: number; count: number }[];
  upcomingCosts: number;
}

export interface PredictiveInsights {
  nextMonthEstimate: number;
  costTrend: 'increasing' | 'decreasing' | 'stable';
  savingsOpportunities: string[];
  highPriorityActions: string[];
}

export const calculateMonthlySpending = (
  bills: Bill[],
  maintenance: MaintenanceRecord[],
  months: number = 6
): MonthlySpending[] => {
  const now = new Date();
  const monthlyData: MonthlySpending[] = [];

  for (let i = months - 1; i >= 0; i--) {
    const targetDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = targetDate.toLocaleString('default', { month: 'short' });
    
    // Calculate bills for this month
    const monthBills = bills.filter(b => {
      const billDate = b.paidDate ? new Date(b.paidDate) : new Date(b.dueDate);
      return billDate.getMonth() === targetDate.getMonth() && 
             billDate.getFullYear() === targetDate.getFullYear();
    });
    const billsTotal = monthBills.reduce((sum, b) => sum + b.amount, 0);

    // Calculate maintenance for this month
    const monthMaintenance = maintenance.filter(m => {
      const serviceDate = new Date(m.lastService);
      return serviceDate.getMonth() === targetDate.getMonth() && 
             serviceDate.getFullYear() === targetDate.getFullYear();
    });
    const maintenanceTotal = monthMaintenance.reduce((sum, m) => sum + (m.cost || 0), 0);

    monthlyData.push({
      month: monthName,
      bills: billsTotal,
      maintenance: maintenanceTotal,
      total: billsTotal + maintenanceTotal,
    });
  }

  return monthlyData;
};

export const calculateCategorySpending = (bills: Bill[]): CategorySpending[] => {
  const categoryTotals: Record<string, number> = {};
  const total = bills.reduce((sum, b) => {
    categoryTotals[b.category] = (categoryTotals[b.category] || 0) + b.amount;
    return sum + b.amount;
  }, 0);

  return Object.entries(categoryTotals)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: total > 0 ? (amount / total) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);
};

export const calculateTaskStats = (tasks: Task[]): TaskStats => {
  const completed = tasks.filter(t => t.isCompleted).length;
  const pending = tasks.filter(t => !t.isCompleted).length;
  
  const byCategory = tasks.reduce((acc, task) => {
    const existing = acc.find(c => c.category === task.category);
    if (existing) {
      existing.count++;
    } else {
      acc.push({ category: task.category, count: 1 });
    }
    return acc;
  }, [] as { category: string; count: number }[]);

  return {
    total: tasks.length,
    completed,
    pending,
    completionRate: tasks.length > 0 ? (completed / tasks.length) * 100 : 0,
    byCategory: byCategory.sort((a, b) => b.count - a.count),
  };
};

export const calculateBillTrends = (bills: Bill[]): BillTrends => {
  const paidBills = bills.filter(b => b.isPaid);
  const onTime = paidBills.filter(b => {
    if (!b.paidDate) return false;
    return new Date(b.paidDate) <= new Date(b.dueDate);
  }).length;
  const late = paidBills.length - onTime;

  const totalAmount = bills.reduce((sum, b) => sum + b.amount, 0);
  const averageAmount = bills.length > 0 ? totalAmount / bills.length : 0;
  
  const recurringTotal = bills
    .filter(b => b.isRecurring)
    .reduce((sum, b) => sum + b.amount, 0);

  const paymentRate = bills.length > 0 ? (paidBills.length / bills.length) * 100 : 0;

  return {
    onTimePayments: onTime,
    latePayments: late,
    averageAmount,
    recurringTotal,
    paymentRate,
  };
};

export const calculateMaintenanceInsights = (maintenance: MaintenanceRecord[]): MaintenanceInsights => {
  const withCost = maintenance.filter(m => m.cost !== undefined);
  const totalCost = withCost.reduce((sum, m) => sum + (m.cost || 0), 0);
  const averageCost = withCost.length > 0 ? totalCost / withCost.length : 0;

  const byType = maintenance.reduce((acc, m) => {
    const existing = acc.find(t => t.type === m.type);
    if (existing) {
      existing.cost += m.cost || 0;
      existing.count++;
    } else {
      acc.push({ type: m.type, cost: m.cost || 0, count: 1 });
    }
    return acc;
  }, [] as { type: string; cost: number; count: number }[]);

  const now = new Date();
  const upcomingCosts = maintenance
    .filter(m => {
      const nextService = new Date(m.nextService);
      const daysUntil = (nextService.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
      return daysUntil > 0 && daysUntil <= 30;
    })
    .reduce((sum, m) => sum + (m.cost || 150), 0);

  return {
    totalCost,
    averageCost,
    byType: byType.sort((a, b) => b.cost - a.cost),
    upcomingCosts,
  };
};

export const generatePredictiveInsights = (
  bills: Bill[],
  maintenance: MaintenanceRecord[],
  tasks: Task[]
): PredictiveInsights => {
  // Predict next month
  const recurringBills = bills.filter(b => b.isRecurring);
  const recurringTotal = recurringBills.reduce((sum, b) => sum + b.amount, 0);
  
  const upcomingMaintenance = maintenance.filter(m => {
    const nextService = new Date(m.nextService);
    const daysUntil = (nextService.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24);
    return daysUntil > 0 && daysUntil <= 30;
  });
  const upcomingMaintenanceCost = upcomingMaintenance.reduce((sum, m) => sum + (m.cost || 150), 0);
  
  const nextMonthEstimate = recurringTotal + upcomingMaintenanceCost;

  // Determine trend
  const monthlyData = calculateMonthlySpending(bills, maintenance, 3);
  let costTrend: 'increasing' | 'decreasing' | 'stable' = 'stable';
  if (monthlyData.length >= 2) {
    const recent = monthlyData[monthlyData.length - 1].total;
    const previous = monthlyData[monthlyData.length - 2].total;
    if (recent > previous * 1.1) costTrend = 'increasing';
    else if (recent < previous * 0.9) costTrend = 'decreasing';
  }

  // Savings opportunities
  const savingsOpportunities: string[] = [];
  const categorySpending = calculateCategorySpending(bills);
  
  const electricitySpend = categorySpending.find(c => c.category === 'electricity');
  if (electricitySpend && electricitySpend.amount > 150) {
    savingsOpportunities.push(`Reduce electricity by 15% with LED bulbs and smart thermostat (Save ~$${(electricitySpend.amount * 0.15).toFixed(0)}/mo)`);
  }

  const internetSpend = categorySpending.find(c => c.category === 'internet');
  if (internetSpend && internetSpend.amount > 80) {
    savingsOpportunities.push('Review internet plan - competitors may offer better rates');
  }

  if (categorySpending.length > 5) {
    savingsOpportunities.push('Bundle utilities with single provider for 10-15% discount');
  }

  // High priority actions
  const highPriorityActions: string[] = [];
  const overdueBills = bills.filter(b => !b.isPaid && new Date(b.dueDate) < new Date());
  if (overdueBills.length > 0) {
    highPriorityActions.push(`Pay ${overdueBills.length} overdue bill${overdueBills.length > 1 ? 's' : ''} to avoid late fees`);
  }

  const overdueMaintenance = maintenance.filter(m => new Date(m.nextService) < new Date());
  if (overdueMaintenance.length > 0) {
    highPriorityActions.push(`Schedule ${overdueMaintenance.length} overdue maintenance task${overdueMaintenance.length > 1 ? 's' : ''}`);
  }

  const pendingTasks = tasks.filter(t => !t.isCompleted);
  if (pendingTasks.length > 10) {
    highPriorityActions.push(`Complete ${pendingTasks.length} pending tasks for better home organization`);
  }

  return {
    nextMonthEstimate,
    costTrend,
    savingsOpportunities: savingsOpportunities.slice(0, 3),
    highPriorityActions: highPriorityActions.slice(0, 3),
  };
};
