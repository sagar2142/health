import { Tabs } from 'expo-router';
import { MaterialIcons, FontAwesome5, Ionicons, FontAwesome } from '@expo/vector-icons';
import { Text } from 'react-native';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' }, // Hide default tab bar since we have custom navbar
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Ionicons name="home" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="../pages/DailyTrack"
        options={{
          title: 'Daily Track',
          tabBarIcon: ({ color }) => <FontAwesome name="heartbeat" size={26} color={color} />,
        }}
      />
    </Tabs>
  );
}
