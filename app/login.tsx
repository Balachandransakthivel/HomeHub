import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useHome } from '@/hooks/useHome';
import { theme } from '@/constants/theme';
import { User } from '@/types';

export default function LoginScreen() {
  const router = useRouter();
  const { setUser } = useHome();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'family' | 'guest'>('admin');

  const handleLogin = () => {
    if (!name.trim() || !email.trim()) return;

    const newUser: User = {
      id: Date.now().toString(),
      name: name.trim(),
      email: email.trim(),
      role,
      avatarColor: theme.colors[role],
    };

    setUser(newUser);
    router.replace('/(tabs)');
  };

  const roleOptions = [
    { value: 'admin' as const, label: 'Family Admin', color: theme.colors.admin },
    { value: 'family' as const, label: 'Family Member', color: theme.colors.family },
    { value: 'guest' as const, label: 'Guest', color: theme.colors.guest },
  ];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image
          source={require('@/assets/images/hero-dashboard.png')}
          style={styles.heroImage}
          contentFit="contain"
          transition={200}
        />

        <View style={styles.content}>
          <Text style={styles.title}>Welcome to HomeHub</Text>
          <Text style={styles.subtitle}>Manage your home with AI-powered insights</Text>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Your Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="your@email.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Your Role</Text>
              <View style={styles.roleOptions}>
                {roleOptions.map(option => (
                  <Pressable
                    key={option.value}
                    style={[
                      styles.roleButton,
                      { borderColor: option.color },
                      role === option.value && { backgroundColor: `${option.color}20` },
                    ]}
                    onPress={() => setRole(option.value)}
                  >
                    <View
                      style={[
                        styles.roleRadio,
                        { borderColor: option.color },
                        role === option.value && { backgroundColor: option.color },
                      ]}
                    />
                    <Text style={[styles.roleLabel, { color: option.color }]}>
                      {option.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <Pressable
              style={[styles.loginButton, (!name.trim() || !email.trim()) && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={!name.trim() || !email.trim()}
            >
              <Text style={styles.loginButtonText}>Get Started</Text>
            </Pressable>

            <Text style={styles.note}>
              Note: This is a demo. Data is stored locally on your device.
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  heroImage: {
    width: '100%',
    height: 280,
    marginTop: 60,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  title: {
    fontSize: theme.fontSize.xxxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.fontSize.base,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  form: {
    gap: theme.spacing.lg,
  },
  inputGroup: {
    gap: theme.spacing.sm,
  },
  label: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: theme.fontSize.base,
    color: theme.colors.text,
  },
  roleOptions: {
    gap: theme.spacing.sm,
  },
  roleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderWidth: 2,
    borderRadius: theme.borderRadius.md,
    gap: theme.spacing.md,
  },
  roleRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
  },
  roleLabel: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.medium,
  },
  loginButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    marginTop: theme.spacing.md,
    ...theme.shadows.md,
  },
  loginButtonDisabled: {
    opacity: 0.5,
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.bold,
  },
  note: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textTertiary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
