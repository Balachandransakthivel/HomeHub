import React, { useState } from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { useAlert } from '@/template';

interface EmergencyButtonProps {
  onTrigger: () => void;
}

export function EmergencyButton({ onTrigger }: EmergencyButtonProps) {
  const { showAlert } = useAlert();
  const [pressed, setPressed] = useState(false);

  const handlePress = () => {
    showAlert(
      'Trigger Emergency Alert?',
      'This will notify all emergency contacts immediately.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Trigger',
          style: 'destructive',
          onPress: () => {
            onTrigger();
            showAlert('Emergency Alert Sent', 'All contacts have been notified.');
          },
        },
      ]
    );
  };

  return (
    <Pressable
      style={[styles.button, pressed && styles.buttonPressed]}
      onPress={handlePress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
    >
      <MaterialIcons name="warning" size={24} color="#FFF" />
      <Text style={styles.text}>Emergency</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: theme.colors.danger,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.md,
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  text: {
    color: '#FFF',
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.bold,
  },
});
