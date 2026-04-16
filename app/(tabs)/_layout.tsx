import { MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform, View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '@/constants/theme';

function GradientIcon({ name, focused }: { name: keyof typeof MaterialIcons.glyphMap; focused: boolean }) {
  if (!focused) {
    return <MaterialIcons name={name} size={24} color={theme.colors.textTertiary} />;
  }
  return (
    <View style={tabStyles.activeIconWrap}>
      <LinearGradient colors={['#00C9A7', '#7C3AED']} style={tabStyles.activeIconGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <MaterialIcons name={name} size={22} color="#FFF" />
      </LinearGradient>
    </View>
  );
}

const tabStyles = StyleSheet.create({
  activeIconWrap: { alignItems: 'center', justifyContent: 'center' },
  activeIconGrad: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#00C9A7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
});

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: Platform.select({
            ios: insets.bottom + 64,
            android: insets.bottom + 64,
            default: 72,
          }),
          paddingTop: 8,
          paddingBottom: Platform.select({
            ios: insets.bottom + 10,
            android: insets.bottom + 10,
            default: 10,
          }),
          paddingHorizontal: 8,
          backgroundColor: theme.colors.surface,
          borderTopWidth: 0,
          shadowColor: '#7C3AED',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
          elevation: 12,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textTertiary,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginTop: 2,
        },
        tabBarShowLabel: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => <GradientIcon name="home" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="bills"
        options={{
          title: 'Bills',
          tabBarIcon: ({ focused }) => <GradientIcon name="receipt-long" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: 'Tasks',
          tabBarIcon: ({ focused }) => <GradientIcon name="task-alt" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="maintenance"
        options={{
          title: 'Maintain',
          tabBarIcon: ({ focused }) => <GradientIcon name="build" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: 'Analytics',
          tabBarIcon: ({ focused }) => <GradientIcon name="insights" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: 'More',
          tabBarIcon: ({ focused }) => <GradientIcon name="more-horiz" focused={focused} />,
        }}
      />
    </Tabs>
  );
}
