import { createStackNavigator } from '@react-navigation/stack';
import OrdersScreen from '../screens/OrdersScreen';
import TrackingScreen from '../screens/TrackingScreen';
import { useTheme } from '../context/ThemeContext';

const ordersStack = createStackNavigator();

export function OrdersStack() {
    const { theme } = useTheme();

    return (
        <ordersStack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: theme.headerBg,
                    borderBottomWidth: 1,
                    borderBottomColor: theme.border,
                    shadowOpacity: 0,
                    elevation: 0,
                },
                headerTintColor: theme.text,
                headerBackTitle: 'BACK',
                headerTitleStyle: {
                    fontWeight: '900',
                    letterSpacing: 2,
                    fontSize: 13,
                },
            }}
        >
            <ordersStack.Screen
                name="Orders"
                component={OrdersScreen}
                options={{ headerShown: false }}
            />
            <ordersStack.Screen
                name="Tracking"
                component={TrackingScreen}
                options={{ headerShown: false }}
            />
        </ordersStack.Navigator>
    );
}
