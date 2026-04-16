import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { UserRole } from '@/types';

interface RoleBadgeProps {
  role: UserRole;
}

const roleConfig: Record<UserRole, {
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  colors: string[];
}> = {
  admin: {
    label: 'Admin',
    icon: 'admin-panel-settings',
    colors: ['#00C9A7', '#00A0E8'],
  },
  family: {
    label: 'Family',
    icon: 'people',
    colors: ['#7C3AED', '#C026D3'],
  },
  guest: {
    label: 'Guest',
    icon: 'person-outline',
    colors: ['#64748B', '#94A3B8'],
  },
};

export function RoleBadge({ role }: RoleBadgeProps) {
  const config = roleConfig[role];
  return (
    <LinearGradient
      colors={config.colors as [string, string]}
      style={styles.badge}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      <MaterialIcons name={config.icon} size={12} color="#FFF" />
      <Text style={styles.text}>{config.label}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: theme.borderRadius.full,
  },
  text: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: '#FFF',
  },
});
