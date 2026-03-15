import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
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
      <View style={[styles.iconContainer, { backgroundColor: `${statusColor}15` }]}>
        <MaterialIcons name={categoryIcons[bill.category]} size={24} color={statusColor} />
      </View>
      
      <View style={styles.content}>
        <Text style={styles.name}>{bill.name}</Text>
        <Text style={styles.date}>
          Due: {dueDate.toLocaleDateString()}
          {bill.isRecurring && ' • Recurring'}
        </Text>
      </View>
      
      <View style={styles.right}>
        <Text style={[styles.amount, { color: statusColor }]}>
          ${bill.amount.toFixed(2)}
        </Text>
        {onTogglePaid && (
          <Pressable onPress={onTogglePaid} hitSlop={8}>
            <MaterialIcons
              name={bill.isPaid ? 'check-circle' : 'radio-button-unchecked'}
              size={24}
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
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    gap: theme.spacing.md,
    ...theme.shadows.sm,
  },
  cardPressed: {
    opacity: 0.7,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: 4,
  },
  date: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  right: {
    alignItems: 'flex-end',
    gap: 8,
  },
  amount: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
  },
});
