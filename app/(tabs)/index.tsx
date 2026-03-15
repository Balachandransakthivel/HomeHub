import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useHome } from '@/hooks/useHome';
import { theme } from '@/constants/theme';
import { RoleBadge } from '@/components/ui/Rolebadges';
import { EmergencyButton } from '@/components/ui/EmergencyButton';
import { StatCard } from '@/components/ui/StatCard';
import { AIAlertCard } from '@/components/alerts/AIAlertCard';
import { BillCard } from '@/components/bills/BillCard';
import { TaskCard } from '@/components/tasks/TaskCard';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const {
    user,
    bills,
    tasks,
    aiAlerts,
    refreshAIAlerts,
    markAlertAsRead,
    updateBill,
    updateTask,
    triggerEmergency,
  } = useHome();

  useEffect(() => {
    refreshAIAlerts();
  }, [bills]);

  const unpaidBills = bills.filter(b => !b.isPaid);
  const overdueBills = unpaidBills.filter(b => new Date(b.dueDate) < new Date());
  const activeTasks = tasks.filter(t => !t.isCompleted);
  const unreadAlerts = aiAlerts.filter(a => !a.isRead);

  const upcomingBills = unpaidBills.slice(0, 3);
  const upcomingTasks = activeTasks.slice(0, 3);
  const topAlerts = aiAlerts.slice(0, 3);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <View style={[styles.avatar, { backgroundColor: user?.avatarColor }]}>
              <Text style={styles.avatarText}>
                {user?.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View>
              <Text style={styles.greeting}>Welcome back,</Text>
              <Text style={styles.userName}>{user?.name}</Text>
            </View>
          </View>
          <RoleBadge role={user?.role || 'family'} />
        </View>

        {/* Emergency Button */}
        <View style={styles.emergencySection}>
          <EmergencyButton onTrigger={triggerEmergency} />
        </View>

        {/* Stats Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.statsGrid}>
            <StatCard
              icon="receipt-long"
              label="Unpaid Bills"
              value={unpaidBills.length}
              color={overdueBills.length > 0 ? theme.colors.danger : theme.colors.primary}
              onPress={() => router.push('/(tabs)/bills')}
            />
            <StatCard
              icon="task"
              label="Active Tasks"
              value={activeTasks.length}
              color={theme.colors.secondary}
              onPress={() => router.push('/(tabs)/tasks')}
            />
          </View>
          <StatCard
            icon="notifications-active"
            label="AI Alerts"
            value={unreadAlerts.length > 0 ? `${unreadAlerts.length} Unread` : 'All Clear'}
            color={unreadAlerts.length > 0 ? theme.colors.warning : theme.colors.success}
          />
        </View>

        {/* AI Insights */}
        {topAlerts.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>AI Insights</Text>
              <Image
                source={require('@/assets/images/ai-assistant.png')}
                style={styles.aiIcon}
                contentFit="contain"
              />
            </View>
            <View style={styles.list}>
              {topAlerts.map(alert => (
                <AIAlertCard
                  key={alert.id}
                  alert={alert}
                  onPress={() => markAlertAsRead(alert.id)}
                />
              ))}
            </View>
          </View>
        )}

        {/* Upcoming Bills */}
        {upcomingBills.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Upcoming Bills</Text>
              <Pressable onPress={() => router.push('/(tabs)/bills')}>
                <Text style={styles.seeAll}>See All</Text>
              </Pressable>
            </View>
            <View style={styles.list}>
              {upcomingBills.map(bill => (
                <BillCard
                  key={bill.id}
                  bill={bill}
                  onTogglePaid={() =>
                    updateBill(bill.id, {
                      isPaid: !bill.isPaid,
                      paidDate: !bill.isPaid ? new Date().toISOString() : undefined,
                    })
                  }
                />
              ))}
            </View>
          </View>
        )}

        {/* Upcoming Tasks */}
        {upcomingTasks.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Upcoming Tasks</Text>
              <Pressable onPress={() => router.push('/(tabs)/tasks')}>
                <Text style={styles.seeAll}>See All</Text>
              </Pressable>
            </View>
            <View style={styles.list}>
              {upcomingTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggleComplete={() =>
                    updateTask(task.id, {
                      isCompleted: !task.isCompleted,
                      completedDate: !task.isCompleted ? new Date().toISOString() : undefined,
                    })
                  }
                />
              ))}
            </View>
          </View>
        )}

        {/* Empty State */}
        {unpaidBills.length === 0 && activeTasks.length === 0 && aiAlerts.length === 0 && (
          <View style={styles.emptyState}>
            <Image
              source={require('@/assets/images/empty-state.png')}
              style={styles.emptyImage}
              contentFit="contain"
            />
            <Text style={styles.emptyTitle}>All Clear!</Text>
            <Text style={styles.emptyText}>
              No pending bills, tasks, or alerts. Your home is running smoothly.
            </Text>
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
  scroll: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFF',
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
  },
  greeting: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  userName: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  emergencySection: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  section: {
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  aiIcon: {
    width: 32,
    height: 32,
  },
  seeAll: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.semibold,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  list: {
    gap: theme.spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    padding: theme.spacing.xxl,
  },
  emptyImage: {
    width: 120,
    height: 120,
    marginBottom: theme.spacing.lg,
  },
  emptyTitle: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  emptyText: {
    fontSize: theme.fontSize.base,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  bottomPadding: {
    height: theme.spacing.xxl,
  },
});
