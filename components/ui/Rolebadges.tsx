import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '@/constants/theme';
import { UserRole } from '@/types';

interface RoleBadgeProps {
  role: UserRole;
}

export function RoleBadge({ role }: RoleBadgeProps) {
  const colors = {
    admin: theme.colors.admin,
    family: theme.colors.family,
    guest: theme.colors.guest,
  };

  const labels = {
    admin: 'Admin',
    family: 'Family',
    guest: 'Guest',
  };

  return (
    <View style={[styles.badge, { backgroundColor: `${colors[role]}20` }]}>
      <Text style={[styles.text, { color: colors[role] }]}>
        {labels[role]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },
  text: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
  },
});
