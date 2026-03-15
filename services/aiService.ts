import { AIAlert, Bill, Task, MaintenanceRecord } from '@/types';

// Enhanced AI prediction service with ML-like seasonal and trend analysis
export const generateAIAlerts = (
  bills: Bill[],
  maintenance: MaintenanceRecord[],
  tasks?: Task[]
): AIAlert[] => {
  const alerts: AIAlert[] = [];
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentSeason = getSeason(currentMonth);

  // Bill spike prediction
  const unpaidBills = bills.filter(b => !b.isPaid);
  const totalUnpaid = unpaidBills.reduce((sum, b) => sum + b.amount, 0);
  
  if (totalUnpaid > 500) {
    alerts.push({
      id: `alert-bill-${Date.now()}`,
      type: 'warning',
      category: 'bill',
      title: 'High Unpaid Bills Detected',
      message: `You have $${totalUnpaid.toFixed(2)} in unpaid bills. Consider paying soon to avoid late fees.`,
      priority: 'high',
      timestamp: new Date().toISOString(),
      isRead: false,
    });
  }

  // Overdue bills
  unpaidBills.forEach(bill => {
    const dueDate = new Date(bill.dueDate);
    if (dueDate < now) {
      const daysOverdue = Math.ceil((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
      alerts.push({
        id: `alert-overdue-${bill.id}`,
        type: 'warning',
        category: 'bill',
        title: `${bill.name} is Overdue`,
        message: `Payment of $${bill.amount} was due ${daysOverdue} days ago. Late fees may apply.`,
        priority: 'high',
        timestamp: new Date().toISOString(),
        isRead: false,
      });
    }
  });

  // Recurring bill optimization
  const recurringBills = bills.filter(b => b.isRecurring);
  if (recurringBills.length > 0) {
    const avgMonthlyRecurring = recurringBills.reduce((sum, b) => sum + b.amount, 0);
    if (avgMonthlyRecurring > 400) {
      alerts.push({
        id: `alert-recurring-optimize-${Date.now()}`,
        type: 'suggestion',
        category: 'bill',
        title: 'Recurring Bill Optimization',
        message: `Your monthly recurring bills total $${avgMonthlyRecurring.toFixed(2)}. Consider reviewing subscriptions and bundling services for potential savings.`,
        priority: 'medium',
        timestamp: new Date().toISOString(),
        isRead: false,
      });
    }
  }

  // Seasonal maintenance predictions
  const seasonalMaintenance = getSeasonalMaintenanceTasks(currentSeason);
  seasonalMaintenance.forEach(task => {
    const hasScheduled = maintenance.some(m => 
      m.item.toLowerCase().includes(task.keyword.toLowerCase())
    );
    
    if (!hasScheduled) {
      alerts.push({
        id: `alert-seasonal-${task.keyword}-${Date.now()}`,
        type: 'prediction',
        category: 'maintenance',
        title: `Seasonal ${currentSeason} Maintenance: ${task.name}`,
        message: task.message,
        priority: 'medium',
        timestamp: new Date().toISOString(),
        isRead: false,
      });
    }
  });

  // Maintenance predictions
  maintenance.forEach(record => {
    const nextService = new Date(record.nextService);
    const daysUntil = Math.ceil((nextService.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntil <= 7 && daysUntil > 0) {
      const estimatedCost = record.cost || estimateMaintenanceCost(record.type);
      alerts.push({
        id: `alert-maintenance-${record.id}`,
        type: 'prediction',
        category: 'maintenance',
        title: `${record.item} Service Due Soon`,
        message: `Maintenance scheduled in ${daysUntil} days. Estimated cost: $${estimatedCost.toFixed(2)}. Book early to secure best rates.`,
        priority: 'medium',
        timestamp: new Date().toISOString(),
        isRead: false,
      });
    } else if (daysUntil < 0) {
      alerts.push({
        id: `alert-maintenance-overdue-${record.id}`,
        type: 'warning',
        category: 'maintenance',
        title: `${record.item} Maintenance Overdue`,
        message: 'Delayed service may lead to breakdown and higher repair costs. Schedule immediately.',
        priority: 'high',
        timestamp: new Date().toISOString(),
        isRead: false,
      });
    }
  });

  // Energy optimization suggestions
  const energyInsights = generateEnergyInsights(bills, currentSeason);
  energyInsights.forEach(insight => {
    alerts.push({
      id: `alert-energy-${insight.type}-${Date.now()}`,
      type: 'suggestion',
      category: 'energy',
      title: insight.title,
      message: insight.message,
      priority: insight.priority,
      timestamp: new Date().toISOString(),
      isRead: false,
    });
  });

  // Smart cost predictions
  const costPrediction = predictNextMonthCosts(bills, maintenance);
  if (costPrediction.total > 0) {
    alerts.push({
      id: `alert-cost-prediction-${Date.now()}`,
      type: 'prediction',
      category: 'bill',
      title: 'Next Month Cost Forecast',
      message: `Predicted expenses: $${costPrediction.total.toFixed(2)} (Bills: $${costPrediction.bills.toFixed(2)}, Maintenance: $${costPrediction.maintenance.toFixed(2)})`,
      priority: 'low',
      timestamp: new Date().toISOString(),
      isRead: false,
    });
  }

  return alerts.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
};

function getSeason(month: number): string {
  if (month >= 2 && month <= 4) return 'Spring';
  if (month >= 5 && month <= 7) return 'Summer';
  if (month >= 8 && month <= 10) return 'Fall';
  return 'Winter';
}

function getSeasonalMaintenanceTasks(season: string) {
  const tasks = {
    Spring: [
      { name: 'AC Service', keyword: 'ac', message: 'Service your AC before summer heat. Clean filters, check refrigerant levels, and ensure optimal cooling efficiency.' },
      { name: 'Gutter Cleaning', keyword: 'gutter', message: 'Spring rain season requires clean gutters to prevent water damage and foundation issues.' },
    ],
    Summer: [
      { name: 'AC Filter Check', keyword: 'ac', message: 'High AC usage in summer. Replace filters monthly for better efficiency and lower electricity bills.' },
      { name: 'Water Heater', keyword: 'heater', message: 'Summer is ideal for water heater maintenance when hot water demand is lower.' },
    ],
    Fall: [
      { name: 'Heating System', keyword: 'heating', message: 'Service heating system before winter. Clean vents, replace filters, and test thermostat.' },
      { name: 'Roof Inspection', keyword: 'roof', message: 'Inspect roof before winter storms. Check for damaged shingles and seal potential leaks.' },
    ],
    Winter: [
      { name: 'Pipe Insulation', keyword: 'pipe', message: 'Insulate exposed pipes to prevent freezing and costly burst pipe repairs.' },
      { name: 'Heating Efficiency', keyword: 'heating', message: 'Monitor heating costs. Seal windows and doors to reduce heat loss and save 15-20% on bills.' },
    ],
  };
  return tasks[season as keyof typeof tasks] || [];
}

function estimateMaintenanceCost(type: string): number {
  const costEstimates: Record<string, number> = {
    appliance: 150,
    hvac: 200,
    plumbing: 180,
    electrical: 160,
    other: 120,
  };
  return costEstimates[type] || 120;
}

function generateEnergyInsights(bills: Bill[], season: string) {
  const insights: Array<{ type: string; title: string; message: string; priority: 'low' | 'medium' | 'high' }> = [];
  
  const electricBill = bills.find(b => b.category === 'electricity' && !b.isPaid);
  const waterBill = bills.find(b => b.category === 'water' && !b.isPaid);
  
  if (electricBill && electricBill.amount > 150) {
    const seasonalTip = season === 'Summer' 
      ? 'Set AC to 78°F when home, 85°F when away. Use ceiling fans to circulate air.'
      : season === 'Winter'
      ? 'Lower thermostat by 2°F at night. Use thermal curtains to retain heat.'
      : 'Open windows for natural ventilation. Reduce AC/heating usage.';
    
    insights.push({
      type: 'electricity',
      title: 'High Electricity Usage Detected',
      message: `Current bill: $${electricBill.amount}. ${seasonalTip} Potential savings: $30-50/month.`,
      priority: 'medium',
    });
  }

  if (waterBill && waterBill.amount > 100) {
    insights.push({
      type: 'water',
      title: 'Water Conservation Opportunity',
      message: `Water bill is $${waterBill.amount}. Check for leaks, install low-flow showerheads, and run dishwasher/washer with full loads only.`,
      priority: 'medium',
    });
  }

  // Smart lighting suggestion
  if (electricBill && electricBill.amount > 120) {
    insights.push({
      type: 'lighting',
      title: 'Energy-Efficient Lighting',
      message: 'Switch to LED bulbs (75% less energy). Install motion sensors in hallways. Use natural light during daytime.',
      priority: 'low',
    });
  }

  return insights;
}

function predictNextMonthCosts(bills: Bill[], maintenance: MaintenanceRecord[]) {
  // Predict bills
  const recurringBills = bills.filter(b => b.isRecurring);
  const billsCost = recurringBills.reduce((sum, b) => sum + b.amount, 0);

  // Predict maintenance
  const upcomingMaintenance = maintenance.filter(m => {
    const nextService = new Date(m.nextService);
    const now = new Date();
    const daysUntil = (nextService.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return daysUntil > 0 && daysUntil <= 30;
  });
  const maintenanceCost = upcomingMaintenance.reduce((sum, m) => 
    sum + (m.cost || estimateMaintenanceCost(m.type)), 0
  );

  return {
    bills: billsCost,
    maintenance: maintenanceCost,
    total: billsCost + maintenanceCost,
  };
}
