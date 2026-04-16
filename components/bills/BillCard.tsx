import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { Bill } from '@/types';

interface BillCardProps {
  bill: Bill;
  onPress?: () => void;
  onTogglePaid?: () => void;
}

const categoryIcons: Record<Bill['category'], keyof typeof MaterialIcons.glyphMap> = {
  electricity: 'bolt',
  water: 'water-drop',
  gas: 'local-fire-department',
  internet: 'wifi',
  rent: 'home',
  other: 'receipt',
};

export function BillCard({ bill, onPress, onTogglePaid }: BillCardProps) {
  const [pressed, setPressed] = React.useState(false);
  
  const dueDate = new Date(bill.dueDate);
  const now = new Date();
  const isOverdue = !bill.isPaid && dueDate < now;
  const isDueSoon = !bill.isPaid && dueDate <= new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const statusColor = bill.isPaid
    ? theme.colors.paid
    : isOverdue
    ? theme.colors.overdue
    : isDueSoon
    ? theme.colors.dueSoon
    : theme.colors.textSecondary;

  return (
    <Pressable
      style={[styles.card, pressed && styles.cardPressed]}
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
    >
      {/* Left accent stripe */}
      <View style={[styles.stripe, { backgroundColor: statusColor }]} />

      <LinearGradient
        colors={[`${statusColor}12`, 'transparent']}
        style={styles.iconContainer}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <MaterialIcons name={categoryIcons[bill.category]} size={22} color={statusColor} />
      </LinearGradient>

      <View style={styles.content}>
        <Text style={styles.name}>{bill.name}</Text>
        <View style={styles.metaRow}>
          <MaterialIcons name="event" size={12} color={theme.colors.textTertiary} />
          <Text style={styles.date}>{dueDate.toLocaleDateString()}</Text>
          {bill.isRecurring && (
            <View style={styles.recurBadge}>
              <MaterialIcons name="repeat" size={10} color={theme.colors.primary} />
              <Text style={styles.recurText}>Monthly</Text>
            </View>
          )}
        </View>
        {isOverdue && <Text style={styles.overdueLabel}>⚠️ Overdue</Text>}
        {isDueSoon && !isOverdue && <Text style={styles.dueSoonLabel}>Due Soon</Text>}
      </View>

      <View style={styles.right}>
        <Text style={[styles.amount, { color: statusColor }]}>₹{bill.amount.toFixed(2)}</Text>
        {onTogglePaid && (
          <Pressable onPress={onTogglePaid} hitSlop={8} style={[styles.checkBtn, { borderColor: statusColor }]}>
            <MaterialIcons
              name={bill.isPaid ? 'check-circle' : 'radio-button-unchecked'}
              size={22}
              color={statusColor}
            />
          </Pressable>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    gap: 12,
    overflow: 'hidden',
    paddingRight: theme.spacing.md,
    paddingVertical: 12,
    ...theme.shadows.sm,
  },
  cardPressed: { opacity: 0.75, transform: [{ scale: 0.98 }] },
  stripe: { width: 4, height: '100%', minHeight: 60, borderRadius: 2, marginLeft: 0 },
  iconContainer: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: 'center', justifyContent: 'center',
  },
  content: { flex: 1 },
  name: {
    fontSize: theme.fontSize.base, fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text, marginBottom: 4,
  },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  date: { fontSize: theme.fontSize.xs, color: theme.colors.textSecondary },
  recurBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 2,
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: 6, paddingVertical: 2,
    borderRadius: theme.borderRadius.full,
  },
  recurText: { fontSize: 9, color: theme.colors.primary, fontWeight: theme.fontWeight.semibold },
  overdueLabel: { fontSize: theme.fontSize.xs, color: theme.colors.danger, fontWeight: theme.fontWeight.semibold, marginTop: 2 },
  dueSoonLabel: { fontSize: theme.fontSize.xs, color: theme.colors.warning, fontWeight: theme.fontWeight.semibold, marginTop: 2 },
  right: { alignItems: 'flex-end', gap: 6 },
  amount: { fontSize: theme.fontSize.lg, fontWeight: theme.fontWeight.bold },
  checkBtn: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
});
