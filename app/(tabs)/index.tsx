import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useHome } from '@/hooks/useHome';
import { theme } from '@/constants/theme';
import { RoleBadge } from '@/components/ui/Rolebadges';
import { EmergencyButton } from '@/components/ui/EmergencyButton';
import { AIAlertCard } from '@/components/alerts/AIAlertCard';
import { BillCard } from '@/components/bills/BillCard';
import { TaskCard } from '@/components/tasks/TaskCard';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, bills, tasks, aiAlerts, refreshAIAlerts, markAlertAsRead, updateBill, updateTask, triggerEmergency } = useHome();

  useEffect(() => { refreshAIAlerts(); }, [bills]);

  const unpaidBills = bills.filter(b => !b.isPaid);
  const overdueBills = unpaidBills.filter(b => new Date(b.dueDate) < new Date());
  const activeTasks = tasks.filter(t => !t.isCompleted);
  const unreadAlerts = aiAlerts.filter(a => !a.isRead);
  const upcomingBills = unpaidBills.slice(0, 3);
  const upcomingTasks = activeTasks.slice(0, 3);
  const topAlerts = aiAlerts.slice(0, 3);

  const initials = user?.name ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : 'HH';

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Header ─────────────────────────────── */}
        <LinearGradient
          colors={['#12143A', '#1E1060', '#0A2A50']}
          style={styles.headerGrad}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Background circles */}
          <View style={styles.hCircle1} />
          <View style={styles.hCircle2} />

          <View style={styles.headerRow}>
            <View style={styles.userRow}>
              <LinearGradient colors={['#00C9A7', '#7C3AED']} style={styles.avatar} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                <Text style={styles.avatarText}>{initials}</Text>
              </LinearGradient>
              <View>
                <Text style={styles.greet}>Good day,</Text>
                <Text style={styles.userName}>{user?.name ?? 'Homeowner'}</Text>
              </View>
            </View>
            <RoleBadge role={user?.role || 'family'} />
          </View>

          {/* Summary chips */}
          <View style={styles.chipRow}>
            <Pressable style={styles.chip} onPress={() => router.push('/(tabs)/bills')}>
              <MaterialIcons name="receipt-long" size={16} color={overdueBills.length > 0 ? theme.colors.accent : theme.colors.primary} />
              <Text style={styles.chipVal}>{unpaidBills.length}</Text>
              <Text style={styles.chipLabel}>Bills</Text>
            </Pressable>
            <View style={styles.chipDivider} />
            <Pressable style={styles.chip} onPress={() => router.push('/(tabs)/tasks')}>
              <MaterialIcons name="task-alt" size={16} color={theme.colors.primary} />
              <Text style={styles.chipVal}>{activeTasks.length}</Text>
              <Text style={styles.chipLabel}>Tasks</Text>
            </Pressable>
            <View style={styles.chipDivider} />
            <Pressable style={styles.chip}>
              <MaterialIcons name="notifications-active" size={16} color={unreadAlerts.length > 0 ? theme.colors.gold : theme.colors.primary} />
              <Text style={styles.chipVal}>{unreadAlerts.length}</Text>
              <Text style={styles.chipLabel}>Alerts</Text>
            </Pressable>
          </View>
        </LinearGradient>

        {/* ── Emergency Button ───────────────────── */}
        <View style={styles.emergencySection}>
          <EmergencyButton onTrigger={triggerEmergency} />
        </View>

        {/* ── Quick Stats Cards ──────────────────── */}
        <View style={styles.statsRow}>
          <Pressable style={styles.statCardWrap} onPress={() => router.push('/(tabs)/bills')}>
            <LinearGradient colors={['#00C9A7', '#00A0E8']} style={styles.statCard} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
              <MaterialIcons name="receipt-long" size={28} color="#FFF" />
              <Text style={styles.statVal}>{unpaidBills.length}</Text>
              <Text style={styles.statLbl}>Unpaid Bills</Text>
              {overdueBills.length > 0 && (
                <View style={styles.statBadge}>
                  <Text style={styles.statBadgeText}>{overdueBills.length} Overdue</Text>
                </View>
              )}
            </LinearGradient>
          </Pressable>
          <Pressable style={styles.statCardWrap} onPress={() => router.push('/(tabs)/tasks')}>
            <LinearGradient colors={['#7C3AED', '#C026D3']} style={styles.statCard} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
              <MaterialIcons name="task-alt" size={28} color="#FFF" />
              <Text style={styles.statVal}>{activeTasks.length}</Text>
              <Text style={styles.statLbl}>Active Tasks</Text>
            </LinearGradient>
          </Pressable>
          <Pressable style={styles.statCardWrap} onPress={() => router.push('/(tabs)/analytics')}>
            <LinearGradient colors={['#FF6B6B', '#FFA500']} style={styles.statCard} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
              <MaterialIcons name="insights" size={28} color="#FFF" />
              <Text style={styles.statVal}>{aiAlerts.length}</Text>
              <Text style={styles.statLbl}>AI Insights</Text>
            </LinearGradient>
          </Pressable>
        </View>

        {/* ── AI Insights ────────────────────────── */}
        {topAlerts.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <LinearGradient colors={['#F59E0B', '#EF4444']} style={styles.sectionDot} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} />
                <Text style={styles.sectionTitle}>AI Insights</Text>
              </View>
              <Image source={require('@/assets/images/ai-assistant.png')} style={styles.aiIcon} contentFit="contain" />
            </View>
            <View style={styles.list}>
              {topAlerts.map(alert => (
                <AIAlertCard key={alert.id} alert={alert} onPress={() => markAlertAsRead(alert.id)} />
              ))}
            </View>
          </View>
        )}

        {/* ── Upcoming Bills ─────────────────────── */}
        {upcomingBills.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <LinearGradient colors={['#00C9A7', '#00A0E8']} style={styles.sectionDot} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} />
                <Text style={styles.sectionTitle}>Upcoming Bills</Text>
              </View>
              <Pressable onPress={() => router.push('/(tabs)/bills')}>
                <Text style={styles.seeAll}>See All →</Text>
              </Pressable>
            </View>
            <View style={styles.list}>
              {upcomingBills.map(bill => (
                <BillCard
                  key={bill.id}
                  bill={bill}
                  onTogglePaid={() => updateBill(bill.id, { isPaid: !bill.isPaid, paidDate: !bill.isPaid ? new Date().toISOString() : undefined })}
                />
              ))}
            </View>
          </View>
        )}

        {/* ── Upcoming Tasks ─────────────────────── */}
        {upcomingTasks.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <LinearGradient colors={['#7C3AED', '#C026D3']} style={styles.sectionDot} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} />
                <Text style={styles.sectionTitle}>Upcoming Tasks</Text>
              </View>
              <Pressable onPress={() => router.push('/(tabs)/tasks')}>
                <Text style={styles.seeAll}>See All →</Text>
              </Pressable>
            </View>
            <View style={styles.list}>
              {upcomingTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggleComplete={() => updateTask(task.id, { isCompleted: !task.isCompleted, completedDate: !task.isCompleted ? new Date().toISOString() : undefined })}
                />
              ))}
            </View>
          </View>
        )}

        {/* ── Empty State ─────────────────────────── */}
        {unpaidBills.length === 0 && activeTasks.length === 0 && aiAlerts.length === 0 && (
          <View style={styles.emptyState}>
            <Image source={require('@/assets/images/empty-state.png')} style={styles.emptyImage} contentFit="contain" />
            <Text style={styles.emptyTitle}>All Clear! 🎉</Text>
            <Text style={styles.emptyText}>No pending bills, tasks, or alerts. Your home is running smoothly.</Text>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  scroll: { flex: 1 },

  // Header gradient
  headerGrad: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: 28,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
  },
  hCircle1: {
    position: 'absolute', width: 180, height: 180, borderRadius: 90,
    backgroundColor: 'rgba(0,201,167,0.10)', top: -60, right: -30,
  },
  hCircle2: {
    position: 'absolute', width: 120, height: 120, borderRadius: 60,
    backgroundColor: 'rgba(124,58,237,0.12)', bottom: -20, left: 20,
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.lg },
  userRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: {
    width: 48, height: 48, borderRadius: 24,
    alignItems: 'center', justifyContent: 'center',
    ...theme.shadows.teal,
  },
  avatarText: { color: '#FFF', fontSize: theme.fontSize.lg, fontWeight: theme.fontWeight.bold },
  greet: { fontSize: theme.fontSize.xs, color: 'rgba(255,255,255,0.6)' },
  userName: { fontSize: theme.fontSize.lg, fontWeight: theme.fontWeight.bold, color: '#FFF' },

  chipRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  chip: { flex: 1, alignItems: 'center', gap: 4 },
  chipDivider: { width: 1, height: 32, backgroundColor: 'rgba(255,255,255,0.15)' },
  chipVal: { fontSize: theme.fontSize.xl, fontWeight: theme.fontWeight.bold, color: '#FFF' },
  chipLabel: { fontSize: theme.fontSize.xs, color: 'rgba(255,255,255,0.6)' },

  // Emergency
  emergencySection: { paddingHorizontal: theme.spacing.lg, marginTop: theme.spacing.lg },

  // Stats row
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.sm,
    marginTop: theme.spacing.lg,
  },
  statCardWrap: { flex: 1 },
  statCard: {
    borderRadius: theme.borderRadius.lg,
    padding: 14,
    alignItems: 'center',
    gap: 4,
    position: 'relative',
    ...theme.shadows.md,
  },
  statVal: { fontSize: theme.fontSize.xxl, fontWeight: theme.fontWeight.heavy, color: '#FFF' },
  statLbl: { fontSize: 10, color: 'rgba(255,255,255,0.8)', textAlign: 'center' },
  statBadge: {
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  statBadgeText: { fontSize: 9, color: '#FFF', fontWeight: theme.fontWeight.bold },

  // Sections
  section: { paddingHorizontal: theme.spacing.lg, paddingTop: theme.spacing.lg, gap: theme.spacing.md },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionDot: { width: 4, height: 20, borderRadius: 2 },
  sectionTitle: { fontSize: theme.fontSize.lg, fontWeight: theme.fontWeight.bold, color: theme.colors.text },
  seeAll: { fontSize: theme.fontSize.sm, color: theme.colors.primary, fontWeight: theme.fontWeight.semibold },
  aiIcon: { width: 36, height: 36 },
  list: { gap: theme.spacing.md },

  // Empty
  emptyState: { alignItems: 'center', padding: theme.spacing.xxl },
  emptyImage: { width: 140, height: 140, marginBottom: theme.spacing.lg },
  emptyTitle: { fontSize: theme.fontSize.xxl, fontWeight: theme.fontWeight.bold, color: theme.colors.text, marginBottom: theme.spacing.sm },
  emptyText: { fontSize: theme.fontSize.base, color: theme.colors.textSecondary, textAlign: 'center', lineHeight: 24 },
});
