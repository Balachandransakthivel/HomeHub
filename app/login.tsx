import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
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
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);

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
    {
      value: 'admin' as const,
      label: 'Family Admin',
      icon: 'admin-panel-settings' as const,
      gradient: ['#00C9A7', '#00A0E8'] as string[],
      desc: 'Full control',
    },
    {
      value: 'family' as const,
      label: 'Family Member',
      icon: 'people' as const,
      gradient: ['#7C3AED', '#C026D3'] as string[],
      desc: 'View & manage',
    },
    {
      value: 'guest' as const,
      label: 'Guest',
      icon: 'person-outline' as const,
      gradient: ['#64748B', '#94A3B8'] as string[],
      desc: 'View only',
    },
  ];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.heroWrapper}>
          <LinearGradient
            colors={['#12143A', '#1E1060', '#0D2C4F']}
            style={styles.heroBg}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {/* Decorative circles */}
            <View style={styles.decorCircle1} />
            <View style={styles.decorCircle2} />
            <View style={styles.decorCircle3} />
            <Image
              source={require('@/assets/images/hero-dashboard.png')}
              style={styles.heroImage}
              contentFit="cover"
              transition={400}
            />
          </LinearGradient>

          {/* App badge */}
          <View style={styles.appBadge}>
            <LinearGradient colors={['#00C9A7', '#7C3AED']} style={styles.appBadgeGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              <MaterialIcons name="home" size={16} color="#FFF" />
              <Text style={styles.appBadgeText}>HomeHub AI</Text>
            </LinearGradient>
          </View>
        </View>

        {/* Content card */}
        <View style={styles.card}>
          <Text style={styles.title}>Welcome Back 👋</Text>
          <Text style={styles.subtitle}>Your smart home command center</Text>

          <View style={styles.form}>
            {/* Name input */}
            <View style={[styles.inputWrapper, nameFocused && styles.inputWrapperFocused]}>
              <MaterialIcons
                name="person"
                size={20}
                color={nameFocused ? theme.colors.primary : theme.colors.textTertiary}
              />
              <TextInput
                style={styles.input}
                placeholder="Your name"
                placeholderTextColor={theme.colors.textTertiary}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                onFocus={() => setNameFocused(true)}
                onBlur={() => setNameFocused(false)}
              />
            </View>

            {/* Email input */}
            <View style={[styles.inputWrapper, emailFocused && styles.inputWrapperFocused]}>
              <MaterialIcons
                name="email"
                size={20}
                color={emailFocused ? theme.colors.primary : theme.colors.textTertiary}
              />
              <TextInput
                style={styles.input}
                placeholder="Email address"
                placeholderTextColor={theme.colors.textTertiary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
              />
            </View>

            {/* Role selector */}
            <Text style={styles.roleLabel}>Choose your role</Text>
            <View style={styles.roleGrid}>
              {roleOptions.map(option => (
                <Pressable
                  key={option.value}
                  style={[styles.roleCard, role === option.value && styles.roleCardSelected]}
                  onPress={() => setRole(option.value)}
                >
                  {role === option.value ? (
                    <LinearGradient
                      colors={option.gradient}
                      style={styles.roleIconGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <MaterialIcons name={option.icon} size={22} color="#FFF" />
                    </LinearGradient>
                  ) : (
                    <View style={styles.roleIconPlain}>
                      <MaterialIcons name={option.icon} size={22} color={theme.colors.textTertiary} />
                    </View>
                  )}
                  <Text style={[styles.roleName, role === option.value && styles.roleNameSelected]}>
                    {option.label}
                  </Text>
                  <Text style={styles.roleDesc}>{option.desc}</Text>
                  {role === option.value && (
                    <View style={styles.roleCheck}>
                      <MaterialIcons name="check-circle" size={16} color={option.gradient[0]} />
                    </View>
                  )}
                </Pressable>
              ))}
            </View>

            {/* CTA */}
            <Pressable
              disabled={!name.trim() || !email.trim()}
              onPress={handleLogin}
            >
              <LinearGradient
                colors={
                  name.trim() && email.trim()
                    ? ['#00C9A7', '#7C3AED']
                    : [theme.colors.border, theme.colors.border]
                }
                style={styles.loginButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.loginButtonText}>Get Started</Text>
                <MaterialIcons name="arrow-forward" size={20} color="#FFF" />
              </LinearGradient>
            </Pressable>

            <Text style={styles.note}>🔒 Data stored securely on your device</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  scrollContent: { flexGrow: 1 },

  heroWrapper: { position: 'relative' },
  heroBg: {
    height: 320,
    overflow: 'hidden',
  },
  decorCircle1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(0,201,167,0.12)',
    top: -60,
    left: -60,
  },
  decorCircle2: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(124,58,237,0.15)',
    top: 40,
    right: -40,
  },
  decorCircle3: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(0,201,167,0.08)',
    bottom: 20,
    left: 80,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    opacity: 0.85,
  },
  appBadge: {
    position: 'absolute',
    bottom: -18,
    alignSelf: 'center',
    borderRadius: 20,
    overflow: 'hidden',
    ...theme.shadows.md,
  },
  appBadgeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 20,
  },
  appBadgeText: {
    color: '#FFF',
    fontWeight: theme.fontWeight.bold,
    fontSize: theme.fontSize.sm,
    letterSpacing: 0.5,
  },

  card: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.borderRadius.xxl,
    borderTopRightRadius: theme.borderRadius.xxl,
    marginTop: 4,
    padding: theme.spacing.lg,
    paddingTop: 40,
    flex: 1,
    ...theme.shadows.md,
  },
  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.heavy,
    color: theme.colors.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: theme.fontSize.base,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: theme.spacing.xl,
  },

  form: { gap: theme.spacing.md },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: theme.colors.surfaceTinted,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  inputWrapperFocused: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryLight,
  },
  input: {
    flex: 1,
    fontSize: theme.fontSize.base,
    color: theme.colors.text,
  },

  roleLabel: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  roleGrid: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  roleCard: {
    flex: 1,
    backgroundColor: theme.colors.surfaceTinted,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    alignItems: 'center',
    gap: 6,
    borderWidth: 1.5,
    borderColor: 'transparent',
    position: 'relative',
  },
  roleCardSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: '#F0FFFB',
  },
  roleIconGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.teal,
  },
  roleIconPlain: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.border,
  },
  roleName: {
    fontSize: 11,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  roleNameSelected: {
    color: theme.colors.text,
  },
  roleDesc: {
    fontSize: 10,
    color: theme.colors.textTertiary,
    textAlign: 'center',
  },
  roleCheck: {
    position: 'absolute',
    top: 6,
    right: 6,
  },

  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: theme.borderRadius.lg,
    marginTop: 4,
    ...theme.shadows.teal,
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.bold,
  },
  note: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textTertiary,
    textAlign: 'center',
  },
});
