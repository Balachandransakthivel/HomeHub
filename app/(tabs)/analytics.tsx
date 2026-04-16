import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useHome } from '@/hooks/useHome';
import { theme } from '@/constants/theme';
import { ChartCard } from '@/components/analytics/ChartCard';
import { InsightCard } from '@/components/analytics/InsightCard';
import {
  calculateMonthlySpending,
  calculateCategorySpending,
  calculateTaskStats,
  calculateBillTrends,
  calculateMaintenanceInsights,
  generatePredictiveInsights,
} from '@/services/analyticsService';

export default function AnalyticsScreen() {
  const insets = useSafeAreaInsets();
  const { bills, tasks, maintenance } = useHome();

  // Calculate all analytics
  const monthlySpending = useMemo(() => calculateMonthlySpending(bills, maintenance, 6), [bills, maintenance]);
  const categorySpending = useMemo(() => calculateCategorySpending(bills), [bills]);
  const taskStats = useMemo(() => calculateTaskStats(tasks), [tasks]);
  const billTrends = useMemo(() => calculateBillTrends(bills), [bills]);
  const maintenanceInsights = useMemo(() => calculateMaintenanceInsights(maintenance), [maintenance]);
  const predictiveInsights = useMemo(() => generatePredictiveInsights(bills, maintenance, tasks), [bills, maintenance, tasks]);

  // Prepare chart data
  const monthlySpendingChartData = {
    labels: monthlySpending.map(m => m.month),
    datasets: [
      {
        data: monthlySpending.map(m => m.total),
        color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
        strokeWidth: 2,
      },
    ],
    legend: ['Total Spending'],
  };

  const categoryPieData = categorySpending.slice(0, 5).map((cat, index) => ({
    name: cat.category,
    amount: cat.amount,
    color: [
      theme.colors.primary,
      theme.colors.secondary,
      '#F59E0B',
      '#10B981',
      '#8B5CF6',
    ][index],
    legendFontColor: theme.colors.textSecondary,
    legendFontSize: 12,
  }));

  const taskCompletionData = {
    labels: taskStats.byCategory.map(c => c.category),
    datasets: [
      {
        data: taskStats.byCategory.map(c => c.count),
      },
    ],
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Analytics</Text>
        <MaterialIcons name="insights" size={28} color={theme.colors.primary} />
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Predictive Insights Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Predictive Insights</Text>
          <View style={styles.insightsGrid}>
            <InsightCard
              icon="trending-up"
              title="Next Month Forecast"
              value={`₹${predictiveInsights.nextMonthEstimate.toFixed(0)}`}
              subtitle={`Trend: ${predictiveInsights.costTrend}`}
              color={theme.colors.primary}
              trend={predictiveInsights.costTrend === 'increasing' ? 'up' : predictiveInsights.costTrend === 'decreasing' ? 'down' : 'stable'}
            />
            <InsightCard
              icon="account-balance-wallet"
              title="Monthly Average"
              value={`₹${billTrends.averageAmount.toFixed(0)}`}
              subtitle="Per bill"
              color={theme.colors.secondary}
            />
          </View>
        </View>

        {/* Monthly Spending Trend */}
        {monthlySpending.length > 0 && (
          <View style={styles.section}>
            <ChartCard
              title="Monthly Spending Trend"
              type="line"
              data={monthlySpendingChartData}
              height={200}
            />
          </View>
        )}

        {/* Bill Payment Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💰 Bill Payment Analytics</Text>
          <View style={styles.insightsGrid}>
            <InsightCard
              icon="check-circle"
              title="On-Time Payments"
              value={billTrends.onTimePayments}
              subtitle={`${billTrends.paymentRate.toFixed(0)}% payment rate`}
              color={theme.colors.success}
            />
            <InsightCard
              icon="schedule"
              title="Late Payments"
              value={billTrends.latePayments}
              color={theme.colors.danger}
            />
          </View>
          <InsightCard
            icon="refresh"
            title="Recurring Bills Total"
            value={`₹${billTrends.recurringTotal.toFixed(0)}`}
            subtitle="Monthly recurring expenses"
            color={theme.colors.warning}
          />
        </View>

        {/* Category Breakdown */}
        {categoryPieData.length > 0 && (
          <View style={styles.section}>
            <ChartCard
              title="Spending by Category"
              type="pie"
              data={categoryPieData}
              height={220}
            />
          </View>
        )}

        {/* Task Performance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>✅ Task Performance</Text>
          <View style={styles.insightsGrid}>
            <InsightCard
              icon="task-alt"
              title="Completion Rate"
              value={`${taskStats.completionRate.toFixed(0)}%`}
              subtitle={`${taskStats.completed}/${taskStats.total} completed`}
              color={theme.colors.success}
            />
            <InsightCard
              icon="pending-actions"
              title="Pending Tasks"
              value={taskStats.pending}
              color={theme.colors.warning}
            />
          </View>
        </View>

        {/* Task Distribution */}
        {taskStats.byCategory.length > 0 && (
          <View style={styles.section}>
            <ChartCard
              title="Tasks by Category"
              type="bar"
              data={taskCompletionData}
              height={200}
            />
          </View>
        )}

        {/* Maintenance Insights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔧 Maintenance Analytics</Text>
          <View style={styles.insightsGrid}>
            <InsightCard
              icon="attach-money"
              title="Total Maintenance Cost"
              value={`₹${maintenanceInsights.totalCost.toFixed(0)}`}
              subtitle={`Avg: ₹${maintenanceInsights.averageCost.toFixed(0)}`}
              color={theme.colors.primary}
            />
            <InsightCard
              icon="event"
              title="Upcoming Costs"
              value={`₹${maintenanceInsights.upcomingCosts.toFixed(0)}`}
              subtitle="Next 30 days"
              color={theme.colors.warning}
            />
          </View>

          {maintenanceInsights.byType.length > 0 && (
            <View style={styles.maintenanceBreakdown}>
              <Text style={styles.breakdownTitle}>Cost by Type</Text>
              {maintenanceInsights.byType.map(item => (
                <View key={item.type} style={styles.breakdownItem}>
                  <Text style={styles.breakdownType}>{item.type}</Text>
                  <Text style={styles.breakdownValue}>₹{item.cost.toFixed(0)}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Savings Opportunities */}
        {predictiveInsights.savingsOpportunities.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>💡 Savings Opportunities</Text>
            <View style={styles.opportunitiesCard}>
              {predictiveInsights.savingsOpportunities.map((opportunity, index) => (
                <View key={index} style={styles.opportunityItem}>
                  <MaterialIcons name="lightbulb" size={20} color={theme.colors.warning} />
                  <Text style={styles.opportunityText}>{opportunity}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* High Priority Actions */}
        {predictiveInsights.highPriorityActions.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🚨 Priority Actions</Text>
            <View style={styles.actionsCard}>
              {predictiveInsights.highPriorityActions.map((action, index) => (
                <View key={index} style={styles.actionItem}>
                  <MaterialIcons name="priority-high" size={20} color={theme.colors.danger} />
                  <Text style={styles.actionText}>{action}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  title: {
    fontSize: theme.fontSize.xxxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  scroll: {
    flex: 1,
  },
  section: {
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  insightsGrid: {
    gap: theme.spacing.md,
  },
  maintenanceBreakdown: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.sm,
  },
  breakdownTitle: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  breakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  breakdownType: {
    fontSize: theme.fontSize.base,
    color: theme.colors.textSecondary,
    textTransform: 'capitalize',
  },
  breakdownValue: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },
  opportunitiesCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    gap: theme.spacing.md,
    ...theme.shadows.sm,
  },
  opportunityItem: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    alignItems: 'flex-start',
  },
  opportunityText: {
    flex: 1,
    fontSize: theme.fontSize.base,
    color: theme.colors.text,
    lineHeight: 22,
  },
  actionsCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    gap: theme.spacing.md,
    ...theme.shadows.sm,
  },
  actionItem: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    alignItems: 'flex-start',
  },
  actionText: {
    flex: 1,
    fontSize: theme.fontSize.base,
    color: theme.colors.text,
    lineHeight: 22,
  },
  bottomPadding: {
    height: theme.spacing.xxl,
  },
});
