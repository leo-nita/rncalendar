import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppHeader from '../components/AppHeader';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/Profile';
import { theme } from '../constants/theme';

const Tab = createBottomTabNavigator();

const TAB_TITLES: Record<string, string> = {
  Calendar: 'Calendar',
  Profile: 'Profile',
};

function TabBarIcon({ label, color }: { label: string; color: string }) {
  const symbol = label === 'Calendar' ? '▦' : '◎';

  return <Text style={[styles.tabIcon, { color }]}>{symbol}</Text>;
}

export default function MainTabs() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        header: () => (
          <AppHeader title={TAB_TITLES[route.name] ?? route.name} />
        ),
        tabBarStyle: [
          styles.tabBar,
          { height: 56 + insets.bottom, paddingBottom: insets.bottom },
        ],
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: theme.textMuted,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ color }) => (
          <TabBarIcon label={route.name} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Calendar" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: theme.card,
    borderTopColor: theme.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 6,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  tabIcon: {
    fontSize: 18,
    fontWeight: '700',
  },
});
