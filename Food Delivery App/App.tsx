import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { CartProvider } from './src/context/CartContext';
import { ThemeProvider } from './src/context/ThemeContext';
import { AuthStack } from './src/navigation/AuthStack';
import { DrawerNavigator } from './src/navigation/DrawerNavigator';

const deepLinkConfig = {
  prefixes: ['foodapp://'],
  config: {
    screens: {
      MainTabs: {
        screens: {
          HomeTab: {
            screens: {
              RestaurantDetail: 'restaurant/:id',
            },
          },
        },
      },
    },
  },
};

function RootNav() {
  const { isLoggedIn } = useAuth();
  return (
    <NavigationContainer linking={deepLinkConfig}>
      {isLoggedIn ? <DrawerNavigator /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <RootNav />
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
