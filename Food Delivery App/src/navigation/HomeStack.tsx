import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import RestaurantScreen from '../screens/RestaurantScreen';
import CartScreen from '../screens/CartScreen';
import OrderPlacedScreen from '../screens/OrderPlacedScreen';
import TrackingScreen from '../screens/TrackingScreen';
import { useTheme } from '../context/ThemeContext';

const homeStack = createStackNavigator();

export function HomeStack() {
  const { theme } = useTheme();

  return (
    <homeStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.headerBg, borderBottomWidth: 1, borderBottomColor: theme.border, shadowOpacity: 0, elevation: 0 },
        headerTintColor: theme.text,
        headerBackTitle: 'BACK',
        headerTitleStyle: { fontWeight: '900', letterSpacing: 2, fontSize: 13 },
        cardStyleInterpolator: ({ current, layouts }) => ({
          cardStyle: {
            transform: [{
              translateX: current.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [layouts.screen.width, 0],
              }),
            }],
          },
        }),
      }}
    >
      <homeStack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <homeStack.Screen
        name="RestaurantDetail"
        component={RestaurantScreen}
        options={({ route }: { route: any }) => ({
          title: (route.params?.restaurant?.name || 'RESTAURANT').toUpperCase(),
        })}
      />
      <homeStack.Screen
        name="Cart"
        component={CartScreen}
        options={{ title: 'YOUR CART', presentation: 'modal' }}
      />
      <homeStack.Screen
        name="OrderPlaced"
        component={OrderPlacedScreen}
        options={{ headerShown: false, presentation: 'modal' }}
      />
      <homeStack.Screen
        name="Tracking"
        component={TrackingScreen}
        options={{ headerShown: false }}
      />
    </homeStack.Navigator>
  );
}
