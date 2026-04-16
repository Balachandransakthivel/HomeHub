import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { Task } from '@/types';

interface TaskCardProps {
  task: Task;
  onPress?: () => void;
  onToggleComplete?: () => void;
}

const categoryConfig: Record<string, { icon: keyof typeof MaterialIcons.glyphMap; gradient: string[] }> = {
  cleaning: { icon: 'cleaning-services', gradient: ['#00C9A7', '#00A0E8'] },
  maintenance: { icon: 'build', gradient: ['#F59E0B', '#EF4444'] },
  shopping: { icon: 'shopping-cart', gradient: ['#7C3AED', '#C026D3'] },
  cooking: { icon: 'restaurant', gradient: ['#EF4444', '#F97316'] },
  other: { icon: 'task-alt', gradient: ['#64748B', '#94A3B8'] },
};

const priorityColors = {
  low: '#10B981',
  medium: '#F59E0B',
  high: '#EF4444',
};

export function TaskCard({ task, onPress, onToggleComplete }: TaskCardProps) {
  const [pressed, setPressed] = React.useState(false);
  const config = categoryConfig[task.category] || categoryConfig.other;
  const priColor = priorityColors[task.priority];

  return (
    <Pressable
      style={[styles.card, task.isCompleted && styles.completedCard, pressed && styles.cardPressed]}
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
    >
      {/* Priority stripe */}
      <View style={[styles.stripe, { backgroundColor: priColor }]} />

      {/* Category icon */}
      <LinearGradient
        colors={task.isCompleted ? ['#E2E8F0', '#CBD5E1'] : config.gradient as [string, string]}
        style={styles.icon}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <MaterialIcons name={config.icon} size={18} color="#FFF" />
      </LinearGradient>

      <View style={styles.content}>
        <Text style={[styles.title, task.isCompleted && styles.doneText]}>{task.title}</Text>
        <View style={styles.meta}>
          <MaterialIcons name="person" size={11} color={theme.colors.textTertiary} />
          <Text style={styles.metaText}>{task.assignedTo}</Text>
          <MaterialIcons name="event" size={11} color={theme.colors.textTertiary} />
          <Text style={styles.metaText}>{new Date(task.dueDate).toLocaleDateString()}</Text>
        </View>
        <View style={[styles.priBadge, { backgroundColor: `${priColor}18` }]}>
          <Text style={[styles.priText, { color: priColor }]}>{task.priority.toUpperCase()}</Text>
        </View>
      </View>

      <Pressable onPress={onToggleComplete} hitSlop={10} style={styles.checkWrap}>
        <LinearGradient
          colors={task.isCompleted ? ['#10B981', '#059669'] : ['#E2E8F0', '#CBD5E1']}
          style={styles.checkCircle}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <MaterialIcons
            name={task.isCompleted ? 'check' : 'radio-button-unchecked'}
            size={16}
            color={task.isCompleted ? '#FFF' : theme.colors.textTertiary}
          />
        </LinearGradient>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    gap: 12,
    paddingRight: 14,
    paddingVertical: 12,
    ...theme.shadows.sm,
  },
  completedCard: { opacity: 0.7 },
  cardPressed: { opacity: 0.8, transform: [{ scale: 0.98 }] },
  stripe: { width: 4, height: '100%', minHeight: 60 },
  icon: {
    width: 38, height: 38, borderRadius: 19,
    alignItems: 'center', justifyContent: 'center',
    ...theme.shadows.sm,
  },
  content: { flex: 1, gap: 4 },
  title: { fontSize: theme.fontSize.base, fontWeight: theme.fontWeight.semibold, color: theme.colors.text },
  doneText: { textDecorationLine: 'line-through', color: theme.colors.textSecondary },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 11, color: theme.colors.textTertiary, marginRight: 4 },
  priBadge: { alignSelf: 'flex-start', paddingHorizontal: 6, paddingVertical: 2, borderRadius: theme.borderRadius.full },
  priText: { fontSize: 9, fontWeight: theme.fontWeight.bold },
  checkWrap: { alignItems: 'center', justifyContent: 'center' },
  checkCircle: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
});
