import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { AIAlert } from '@/types';

interface AIAlertCardProps {
  alert: AIAlert;
  onPress?: () => void;
}

const typeIcons: Record<AIAlert['type'], keyof typeof MaterialIcons.glyphMap> = {
  prediction: 'lightbulb',
  warning: 'warning',
  suggestion: 'tips-and-updates',
};

const priorityColors = {
  low: theme.colors.primary,
  medium: theme.colors.warning,
  high: theme.colors.danger,
};

export function AIAlertCard({ alert, onPress }: AIAlertCardProps) {
  const [pressed, setPressed] = React.useState(false);
  const color = priorityColors[alert.priority];

  return (
    <Pressable
      style={[
        styles.card,
        { borderLeftColor: color },
        alert.isRead && styles.readCard,
        pressed && styles.cardPressed,
      ]}
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
        <MaterialIcons name={typeIcons[alert.type]} size={24} color={color} />
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{alert.title}</Text>
          {!alert.isRead && <View style={[styles.unreadDot, { backgroundColor: color }]} />}
        </View>
        <Text style={styles.message}>{alert.message}</Text>
        <Text style={styles.time}>
          {new Date(alert.timestamp).toLocaleString()}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    borderLeftWidth: 4,
    gap: theme.spacing.md,
    ...theme.shadows.sm,
  },
  cardPressed: {
    opacity: 0.7,
  },
  readCard: {
    opacity: 0.6,
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  title: {
    flex: 1,
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  message: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: 8,
    lineHeight: 20,
  },
  time: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textTertiary,
  },
});
