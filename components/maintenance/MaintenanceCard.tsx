import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { MaintenanceRecord } from '@/types';
import { theme } from '@/constants/theme';

interface MaintenanceCardProps {
  record: MaintenanceRecord;
  onPress?: () => void;
}

export function MaintenanceCard({ record, onPress }: MaintenanceCardProps) {
  const getTypeIcon = () => {
    switch (record.type) {
      case 'appliance': return 'kitchen';
      case 'hvac': return 'ac-unit';
      case 'plumbing': return 'plumbing';
      case 'electrical': return 'electrical-services';
      default: return 'build';
    }
  };

  const getTypeColor = () => {
    switch (record.type) {
      case 'appliance': return theme.colors.primary;
      case 'hvac': return theme.colors.secondary;
      case 'plumbing': return '#2196F3';
      case 'electrical': return '#FF9800';
      default: return theme.colors.textSecondary;
    }
  };

  const isUpcoming = new Date(record.nextService) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const isOverdue = new Date(record.nextService) < new Date();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
        isOverdue && styles.overdueContainer,
      ]}
      onPress={onPress}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${getTypeColor()}20` }]}>
        <MaterialIcons name={getTypeIcon()} size={24} color={getTypeColor()} />
      </View>

      <View style={styles.content}>
        <Text style={styles.item}>{record.item}</Text>
        <View style={styles.dateRow}>
          <MaterialIcons name="event" size={14} color={theme.colors.textTertiary} />
          <Text style={styles.dateText}>
            Next: {new Date(record.nextService).toLocaleDateString()}
          </Text>
          {isUpcoming && !isOverdue && (
            <View style={styles.upcomingBadge}>
              <Text style={styles.upcomingText}>Soon</Text>
            </View>
          )}
          {isOverdue && (
            <View style={styles.overdueBadge}>
              <Text style={styles.overdueText}>Overdue</Text>
            </View>
          )}
        </View>
        {record.cost !== undefined && (
          <Text style={styles.cost}>Last cost: ₹{record.cost.toFixed(2)}</Text>
        )}
        {record.isRecurring && (
          <View style={styles.recurringBadge}>
            <MaterialIcons name="repeat" size={12} color={theme.colors.primary} />
            <Text style={styles.recurringText}>{record.recurringInterval}</Text>
          </View>
        )}
      </View>

      {record.photos && record.photos.length > 0 && (
        <MaterialIcons name="photo" size={20} color={theme.colors.textTertiary} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    gap: theme.spacing.md,
    ...theme.shadows.sm,
  },
  pressed: {
    opacity: 0.7,
  },
  overdueContainer: {
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.danger,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    gap: 4,
  },
  item: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  cost: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textTertiary,
  },
  upcomingBadge: {
    backgroundColor: `${theme.colors.warning}20`,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
    marginLeft: 4,
  },
  upcomingText: {
    fontSize: 10,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.warning,
  },
  overdueBadge: {
    backgroundColor: `${theme.colors.danger}20`,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
    marginLeft: 4,
  },
  overdueText: {
    fontSize: 10,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.danger,
  },
  recurringBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  recurringText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.primary,
    textTransform: 'capitalize',
  },
});
