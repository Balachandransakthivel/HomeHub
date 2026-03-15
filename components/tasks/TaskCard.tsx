import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { Task } from '@/types';

interface TaskCardProps {
  task: Task;
  onPress?: () => void;
  onToggleComplete?: () => void;
}

const categoryIcons: Record<Task['category'], keyof typeof MaterialIcons.glyphMap> = {
  cleaning: 'cleaning-services',
  maintenance: 'build',
  shopping: 'shopping-cart',
  other: 'task',
};

const priorityColors = {
  low: theme.colors.textSecondary,
  medium: theme.colors.warning,
  high: theme.colors.danger,
};

export function TaskCard({ task, onPress, onToggleComplete }: TaskCardProps) {
  const [pressed, setPressed] = React.useState(false);

  return (
    <Pressable
      style={[styles.card, pressed && styles.cardPressed]}
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
    >
      <Pressable onPress={onToggleComplete} hitSlop={8}>
        <MaterialIcons
          name={task.isCompleted ? 'check-circle' : 'radio-button-unchecked'}
          size={24}
          color={task.isCompleted ? theme.colors.success : theme.colors.textTertiary}
        />
      </Pressable>

      <View style={[styles.iconContainer, { backgroundColor: `${priorityColors[task.priority]}15` }]}>
        <MaterialIcons
          name={categoryIcons[task.category]}
          size={20}
          color={priorityColors[task.priority]}
        />
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, task.isCompleted && styles.completedText]}>
          {task.title}
        </Text>
        <Text style={styles.meta}>
          {task.assignedTo} • {new Date(task.dueDate).toLocaleDateString()}
        </Text>
      </View>

      <View style={[styles.priorityBadge, { backgroundColor: `${priorityColors[task.priority]}20` }]}>
        <Text style={[styles.priorityText, { color: priorityColors[task.priority] }]}>
          {task.priority.toUpperCase()}
        </Text>
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
    gap: theme.spacing.sm,
    ...theme.shadows.sm,
  },
  cardPressed: {
    opacity: 0.7,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: theme.borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
    marginBottom: 4,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: theme.colors.textSecondary,
  },
  meta: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },
  priorityText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
  },
});
