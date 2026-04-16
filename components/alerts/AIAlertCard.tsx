import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { AIAlert } from '@/types';

interface AIAlertCardProps {
  alert: AIAlert;
  onPress?: () => void;
}

const typeConfig: Record<AIAlert['type'], {
  icon: keyof typeof MaterialIcons.glyphMap;
  gradient: string[];
}> = {
  prediction: { icon: 'lightbulb', gradient: ['#F59E0B', '#EF4444'] },
  warning: { icon: 'warning', gradient: ['#EF4444', '#DC2626'] },
  suggestion: { icon: 'tips-and-updates', gradient: ['#00C9A7', '#7C3AED'] },
};

const priorityColors = {
  low: theme.colors.primary,
  medium: theme.colors.warning,
  high: theme.colors.danger,
};

const priorityBg = {
  low: theme.colors.primaryLight,
  medium: theme.colors.warningLight,
  high: theme.colors.dangerLight,
};

export function AIAlertCard({ alert, onPress }: AIAlertCardProps) {
  const [pressed, setPressed] = React.useState(false);
  const color = priorityColors[alert.priority];
  const config = typeConfig[alert.type];

  return (
    <Pressable
      style={[styles.card, alert.isRead && styles.readCard, pressed && styles.cardPressed]}
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
    >
      {/* Priority indicator */}
      <View style={[styles.priorityBar, { backgroundColor: color }]} />

      <LinearGradient
        colors={config.gradient as [string, string]}
        style={styles.iconWrap}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <MaterialIcons name={config.icon} size={20} color="#FFF" />
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.title} numberOfLines={1}>{alert.title}</Text>
          {!alert.isRead && (
            <LinearGradient colors={[color, color]} style={styles.dot} />
          )}
        </View>
        <Text style={styles.message} numberOfLines={2}>{alert.message}</Text>
        <View style={styles.footerRow}>
          <View style={[styles.priorityBadge, { backgroundColor: priorityBg[alert.priority] }]}>
            <Text style={[styles.priorityText, { color }]}>{alert.priority}</Text>
          </View>
          <Text style={styles.time}>{new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    gap: 12,
    alignItems: 'center',
    overflow: 'hidden',
    paddingRight: 12,
    paddingVertical: 12,
    ...theme.shadows.sm,
  },
  cardPressed: { opacity: 0.75, transform: [{ scale: 0.98 }] },
  readCard: { opacity: 0.55 },
  priorityBar: { width: 4, height: '100%', minHeight: 64, borderRadius: 2 },
  iconWrap: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
    ...theme.shadows.sm,
  },
  content: { flex: 1, gap: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  title: { flex: 1, fontSize: theme.fontSize.sm, fontWeight: theme.fontWeight.bold, color: theme.colors.text },
  dot: { width: 8, height: 8, borderRadius: 4 },
  message: { fontSize: theme.fontSize.xs, color: theme.colors.textSecondary, lineHeight: 16 },
  footerRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  priorityBadge: {
    paddingHorizontal: 6, paddingVertical: 2,
    borderRadius: theme.borderRadius.full,
  },
  priorityText: { fontSize: 10, fontWeight: theme.fontWeight.bold, textTransform: 'uppercase' },
  time: { fontSize: 10, color: theme.colors.textTertiary },
});
