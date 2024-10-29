import { DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native';
import { Tabs } from "expo-router";
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { useColorScheme } from '@/hooks/useColorScheme';
import 'react-native-reanimated';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import Intro from '../components/Intro';
import FlashMessage from 'react-native-flash-message';
import { CartProvider } from '../components/context/CartContext';
import CartIcon from '../components/custom/CartIcon'; 



import {
  Ubuntu_500Medium
} from '@expo-google-fonts/ubuntu';


SplashScreen.preventAutoHideAsync();
const tabColor = "#ff6347";
  
export default function RootLayout({ navigation, route }) {
  const [showIntro, setShowIntro] = useState(true); 
  const colorScheme = useColorScheme();

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    Ubuntu_500Medium
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
    const timer = setTimeout(() => {
      setShowIntro(false); // Hide intro screen after 4 seconds
    }, 4000);

    return () => clearTimeout(timer); 

  }, [loaded]);

  if (!loaded) {
    return null;  
  }


  if (showIntro)
      return <Intro/>

  return (
    <>
  
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <CartProvider>
          <FlashMessage position="top" />
          <CartIcon />
          <Tabs
            screenOptions={{
              tabBarActiveTintColor: '#ff6347', // Active tab text color (e.g., tomato color)
              tabBarInactiveTintColor: '#a9a9a9', // Inactive tab text color (e.g., gray)4
              headerStyle: {
                // backgroundColor: '#ff6347',
              },
              // headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          >
            <Tabs.Screen name="(home)" 
              options={{
              title: 'Menu',
              headerTitle:'The Food House',
              headerShown: false,
              tabBarIcon: ({ color, focused }) => (
                  <TabBarIcon name={focused ? 'book' : 'book-outline'} color={tabColor} />
              ),
              }}
            />
            <Tabs.Screen name="cart"
              options={{
                title: 'Cart',
                headerShown: false,
                tabBarIcon: ({ color, focused }) => (
                  <TabBarIcon name={focused ? 'cart' : 'cart-outline'} color={tabColor} />
                ),
              }}
            />
            <Tabs.Screen name="history"
              options={{
                title: 'History',
                
                tabBarIcon: ({ color, focused }) => (
                  <TabBarIcon name={focused ? 'time' : 'time-outline'} color={tabColor} />
                ),
              }}
            />
            <Tabs.Screen name="profile"
                options={{
                  title: 'Profile',
                  tabBarIcon: ({ color, focused }) => (
                    <TabBarIcon name={focused ? 'person' : 'person-outline'} color={tabColor} />
                  ),
                }}
              />
          </Tabs>
        </CartProvider>
      </ThemeProvider>
    </>
  );
}
