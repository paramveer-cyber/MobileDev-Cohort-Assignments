import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { View, Text, StyleSheet } from 'react-native';
import { HomeStack } from './HomeStack';
import { SearchStack } from './SearchStack';
import { OrdersStack } from './OrdersStack';
import { ProfileStack } from './ProfileStack';
import { useNavigationState } from '@react-navigation/native';

function CartBadge() {
    const { items } = useCart();
    const count = items.reduce((sum, item) => sum + item.qty, 0);
    if (count === 0) return null;
    return (
        <View style={badgeStyles.dot}>
            <Text style={badgeStyles.text}>{count > 9 ? '9+' : count}</Text>
        </View>
    );
}

const badgeStyles = StyleSheet.create({
    dot: {
        position: 'absolute',
        top: -4,
        right: -8,
        backgroundColor: '#B91C1C',
        minWidth: 16,
        height: 16,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 3,
    },
    text: { color: '#fff', fontSize: 9, fontWeight: '900' },
});

const bottomTab = createBottomTabNavigator();

function isTabBarHidden(navState: any) {
    if (!navState) return false;
    const homeTab = navState.routes?.find((r: any) => r.name === 'HomeTab');
    if (!homeTab?.state) return false;
    const activeRoute = homeTab.state.routes[homeTab.state.index ?? 0];
    return (
        activeRoute?.name === 'RestaurantDetail' || activeRoute?.name === 'Cart'
    );
}

export function BottomTab() {
    const navState = useNavigationState((s) => s);
    const { theme } = useTheme();
    const tabBarHidden = isTabBarHidden(navState);

    return (
        <bottomTab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: tabBarHidden
                    ? { display: 'none' }
                    : {
                          backgroundColor: theme.tabBar,
                          borderTopColor: theme.border,
                          borderTopWidth: 1,
                          height: 60,
                          paddingBottom: 8,
                          paddingTop: 6,
                      },
                tabBarActiveTintColor: '#B91C1C',
                tabBarInactiveTintColor: theme.textMuted,
                tabBarLabelStyle: {
                    fontSize: 9,
                    fontWeight: '900',
                    letterSpacing: 1,
                },
            }}
        >
            <bottomTab.Screen
                name="HomeTab"
                component={HomeStack}
                options={{
                    title: 'HOME',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home" color={color} size={size - 2} />
                    ),
                }}
            />
            <bottomTab.Screen
                name="SearchTab"
                component={SearchStack}
                options={{
                    title: 'SEARCH',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="search" color={color} size={size - 2} />
                    ),
                }}
            />
            <bottomTab.Screen
                name="OrdersTab"
                component={OrdersStack}
                options={{
                    title: 'ORDERS',
                    tabBarIcon: ({ color, size }) => (
                        <View>
                            <Ionicons
                                name="list"
                                color={color}
                                size={size - 2}
                            />
                            <CartBadge />
                        </View>
                    ),
                }}
            />
            <bottomTab.Screen
                name="ProfileTab"
                component={ProfileStack}
                options={{
                    title: 'PROFILE',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person" color={color} size={size - 2} />
                    ),
                }}
            />
        </bottomTab.Navigator>
    );
}
