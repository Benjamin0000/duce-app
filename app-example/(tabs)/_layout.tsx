import { Tabs } from 'expo-router';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';

export default function TabLayout() {
  return (
    <Tabs 
        screenOptions={{
            headerShown: false,
      }}>

      <Tabs.Screen name="(home)"
            options={{
            title: 'Home',
            tabBarIcon: ({ color, focused }) => (
                <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
            ),
            }}
      />
    </Tabs>
  );
}