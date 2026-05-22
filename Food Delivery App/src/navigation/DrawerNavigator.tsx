import {
    createDrawerNavigator,
    DrawerContentScrollView,
} from '@react-navigation/drawer';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { BottomTab } from './BottomTab';

const appIcon = require('../../assets/icon.png');

function CustomDrawerContent(props: any) {
    const { userName, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();

    const drawerItems = [
        {
            label: 'My Orders',
            iconName: 'receipt-outline',
            tabName: 'OrdersTab',
        },
        {
            label: 'Settings',
            iconName: 'settings-outline',
            tabName: 'ProfileTab',
        },
        {
            label: 'Help',
            iconName: 'help-circle-outline',
            tabName: 'ProfileTab',
        },
    ];

    function navigateToTab(tabName: string) {
        props.navigation.closeDrawer();
        props.navigation.navigate('MainTabs', { screen: tabName });
    }

    return (
        <DrawerContentScrollView
            {...props}
            style={{ backgroundColor: theme.bg }}
        >
            <View style={[styles.header, { borderBottomColor: theme.border }]}>
                <Image
                    source={appIcon}
                    style={styles.drawerLogo}
                    resizeMode="contain"
                />
            </View>
            <View style={[styles.userRow, { borderBottomColor: theme.border }]}>
                <View style={[styles.avatar, { backgroundColor: '#B91C1C' }]}>
                    <Text style={styles.avatarText}>
                        {(userName || 'G')[0].toUpperCase()}
                    </Text>
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={[styles.name, { color: theme.text }]}>
                        {userName || 'Guest'}
                    </Text>
                    <Text style={[styles.email, { color: theme.textMuted }]}>
                        foodlover@fooodu.in
                    </Text>
                </View>
            </View>

            <View style={styles.nav}>
                {drawerItems.map((item) => (
                    <Pressable
                        key={item.label}
                        style={({ pressed }) => [
                            styles.navRow,
                            {
                                backgroundColor: pressed
                                    ? theme.card
                                    : 'transparent',
                            },
                        ]}
                        onPress={() => navigateToTab(item.tabName)}
                    >
                        <View
                            style={[
                                styles.navIconWrap,
                                { backgroundColor: '#B91C1C15' },
                            ]}
                        >
                            <Ionicons
                                name={item.iconName as any}
                                size={18}
                                color="#B91C1C"
                            />
                        </View>
                        <Text style={[styles.navLabel, { color: theme.text }]}>
                            {item.label}
                        </Text>
                        <Ionicons
                            name="chevron-forward"
                            size={14}
                            color={theme.textMuted}
                        />
                    </Pressable>
                ))}

                <Pressable
                    style={({ pressed }) => [
                        styles.navRow,
                        {
                            backgroundColor: pressed
                                ? theme.card
                                : 'transparent',
                        },
                    ]}
                    onPress={toggleTheme}
                >
                    <View
                        style={[
                            styles.navIconWrap,
                            { backgroundColor: '#B91C1C15' },
                        ]}
                    >
                        <Ionicons
                            name={
                                theme.isDark ? 'sunny-outline' : 'moon-outline'
                            }
                            size={18}
                            color="#B91C1C"
                        />
                    </View>
                    <Text style={[styles.navLabel, { color: theme.text }]}>
                        {theme.isDark ? 'Light Mode' : 'Dark Mode'}
                    </Text>
                </Pressable>
            </View>

            <Pressable
                style={({ pressed }) => [
                    styles.logoutRow,
                    {
                        borderTopColor: theme.border,
                        backgroundColor: pressed ? theme.card : 'transparent',
                    },
                ]}
                onPress={() => {
                    props.navigation.closeDrawer();
                    logout();
                }}
            >
                <View
                    style={[styles.navIconWrap, { backgroundColor: '#FEE2E2' }]}
                >
                    <Ionicons
                        name="log-out-outline"
                        size={18}
                        color="#B91C1C"
                    />
                </View>
                <Text style={styles.logoutLabel}>Logout</Text>
            </Pressable>
        </DrawerContentScrollView>
    );
}

const Drawer = createDrawerNavigator();

export function DrawerNavigator() {
    const { theme } = useTheme();

    return (
        <Drawer.Navigator
            id="DrawerNavigator"
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
                headerShown: false,
                drawerStyle: { backgroundColor: theme.bg, width: 280 },
                drawerType: 'slide',
                overlayColor: 'rgba(0,0,0,0.5)',
                swipeEdgeWidth: 40,
            }}
        >
            <Drawer.Screen name="MainTabs" component={BottomTab} />
        </Drawer.Navigator>
    );
}

const styles = StyleSheet.create({
    header: {
        padding: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
    },
    drawerLogo: { width: 96, height: 96 },
    userRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        paddingTop: 16,
        paddingBottom: 20,
        borderBottomWidth: 1,
        marginBottom: 8,
        gap: 14,
    },
    avatar: {
        width: 52,
        height: 52,
        borderRadius: 26,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: { color: '#fff', fontSize: 20, fontWeight: '900' },
    name: { fontSize: 15, fontWeight: '800', marginBottom: 2 },
    email: { fontSize: 12 },
    nav: { paddingHorizontal: 12, paddingVertical: 8 },
    navRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 12,
        borderRadius: 12,
        gap: 12,
        marginBottom: 2,
    },
    navIconWrap: {
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    navLabel: { flex: 1, fontSize: 14, fontWeight: '600' },
    logoutRow: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 12,
        paddingHorizontal: 10,
        paddingVertical: 12,
        borderRadius: 12,
        gap: 12,
        marginTop: 0,
    },
    logoutLabel: { color: '#B91C1C', fontSize: 14, fontWeight: '700' },
});
