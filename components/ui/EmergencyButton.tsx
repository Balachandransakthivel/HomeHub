import React from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { useAlert } from '@/template';

interface EmergencyButtonProps {
  onTrigger: () => void;
}

export function EmergencyButton({ onTrigger }: EmergencyButtonProps) {
  const { showAlert } = useAlert();
  const [pressed, setPressed] = React.useState(false);

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
      onPress={handlePress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={[styles.wrap, pressed && styles.pressed]}
    >
      <LinearGradient
        colors={['#FF6B6B', '#EF4444', '#DC2626']}
        style={styles.button}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.iconWrap}>
          <MaterialIcons name="warning" size={22} color="#FFF" />
        </View>
        <View style={styles.textWrap}>
          <Text style={styles.label}>EMERGENCY ALERT</Text>
          <Text style={styles.sub}>Tap to notify all contacts instantly</Text>
        </View>
        <MaterialIcons name="chevron-right" size={24} color="rgba(255,255,255,0.7)" />
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: { flex: 1 },
  label: { color: '#FFF', fontWeight: theme.fontWeight.heavy, fontSize: theme.fontSize.sm, letterSpacing: 1 },
  sub: { color: 'rgba(255,255,255,0.75)', fontSize: theme.fontSize.xs, marginTop: 2 },
});
