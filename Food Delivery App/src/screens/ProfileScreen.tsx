import {
    View,
    Text,
    StyleSheet,
    Pressable,
    ScrollView,
    StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const NAV_ROWS = [
    {
        label: 'My Orders',
        iconName: 'receipt-outline',
        screenName: 'OrdersTab',
        isTab: true,
    },
    {
        label: 'Settings',
        iconName: 'settings-outline',
        screenName: 'Settings',
        isTab: false,
    },
    {
        label: 'Help & Support',
        iconName: 'help-circle-outline',
        screenName: 'Help',
        isTab: false,
    },
];

export default function ProfileScreen({ navigation }: { navigation: any }) {
    const { userName } = useAuth();
    const { theme, toggleTheme } = useTheme();

    function goToTab(tabName: string) {
        navigation.getParent()?.navigate(tabName);
    }

    return (
        <View style={[styles.root, { backgroundColor: theme.bg }]}>
            <StatusBar
                barStyle={theme.isDark ? 'light-content' : 'dark-content'}
                backgroundColor={theme.bg}
            />
            <SafeAreaView edges={['top']} style={{ backgroundColor: theme.bg }}>
                <View
                    style={[styles.topBar, { borderBottomColor: theme.border }]}
                >
                    <Text style={[styles.pageTitle, { color: theme.text }]}>
                        Profile
                    </Text>
                </View>
            </SafeAreaView>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingBottom: 100,
                }}
            >
                <View
                    style={[
                        styles.heroCard,
                        {
                            backgroundColor: theme.card,
                            borderColor: theme.border,
                        },
                    ]}
                >
                    <View
                        style={[styles.avatar, { backgroundColor: '#B91C1C' }]}
                    >
                        <Text style={styles.avatarLetter}>
                            {(userName || 'G')[0].toUpperCase()}
                        </Text>
                    </View>
                    <View style={styles.heroText}>
                        <Text style={[styles.name, { color: theme.text }]}>
                            {userName || 'Guest User'}
                        </Text>
                        <Text style={[styles.email, { color: theme.textSub }]}>
                            foodlover@fooodu.in
                        </Text>
                        <View
                            style={[
                                styles.goldBadge,
                                { backgroundColor: '#FEF3C7' },
                            ]}
                        >
                            <Ionicons name="star" size={12} color="#D97706" />
                            <Text style={styles.goldBadgeText}>
                                GOLD MEMBER
                            </Text>
                        </View>
                    </View>
                </View>

                <View
                    style={[
                        styles.statsCard,
                        {
                            backgroundColor: theme.card,
                            borderColor: theme.border,
                        },
                    ]}
                >
                    {[
                        { val: '12', label: 'Orders' },
                        { val: '4', label: 'Reviews' },
                        { val: '240', label: 'Points' },
                    ].map((s, i) => (
                        <View
                            key={s.label}
                            style={[
                                styles.statCell,
                                i < 2 && {
                                    borderRightWidth: 1,
                                    borderRightColor: theme.border,
                                },
                            ]}
                        >
                            <Text
                                style={[styles.statVal, { color: '#B91C1C' }]}
                            >
                                {s.val}
                            </Text>
                            <Text
                                style={[
                                    styles.statLabel,
                                    { color: theme.textMuted },
                                ]}
                            >
                                {s.label}
                            </Text>
                        </View>
                    ))}
                </View>

                <Text style={[styles.sectionLabel, { color: theme.textMuted }]}>
                    PREFERENCES
                </Text>

                <View
                    style={[
                        styles.menuCard,
                        {
                            backgroundColor: theme.card,
                            borderColor: theme.border,
                        },
                    ]}
                >
                    <Pressable style={styles.menuRow} onPress={toggleTheme}>
                        <View
                            style={[
                                styles.menuIcon,
                                { backgroundColor: '#B91C1C15' },
                            ]}
                        >
                            <Ionicons
                                name={
                                    theme.isDark
                                        ? 'sunny-outline'
                                        : 'moon-outline'
                                }
                                size={18}
                                color="#B91C1C"
                            />
                        </View>
                        <Text style={[styles.menuLabel, { color: theme.text }]}>
                            {theme.isDark ? 'Light Mode' : 'Dark Mode'}
                        </Text>
                        <View
                            style={[
                                styles.toggle,
                                {
                                    backgroundColor: theme.isDark
                                        ? '#B91C1C'
                                        : theme.border,
                                },
                            ]}
                        >
                            <View
                                style={[
                                    styles.knob,
                                    { marginLeft: theme.isDark ? 18 : 2 },
                                ]}
                            />
                        </View>
                    </Pressable>
                </View>

                <Text style={[styles.sectionLabel, { color: theme.textMuted }]}>
                    ACCOUNT
                </Text>

                <View
                    style={[
                        styles.menuCard,
                        {
                            backgroundColor: theme.card,
                            borderColor: theme.border,
                        },
                    ]}
                >
                    {NAV_ROWS.map((r, i) => (
                        <Pressable
                            key={r.label}
                            style={[
                                styles.menuRow,
                                i < NAV_ROWS.length - 1 && {
                                    borderBottomWidth: 1,
                                    borderBottomColor: theme.border,
                                },
                            ]}
                            onPress={() => {
                                if (r.isTab) {
                                    goToTab(r.screenName);
                                } else {
                                    navigation.navigate(r.screenName);
                                }
                            }}
                        >
                            <View
                                style={[
                                    styles.menuIcon,
                                    { backgroundColor: '#B91C1C15' },
                                ]}
                            >
                                <Ionicons
                                    name={r.iconName as any}
                                    size={18}
                                    color="#B91C1C"
                                />
                            </View>
                            <Text
                                style={[
                                    styles.menuLabel,
                                    { color: theme.text },
                                ]}
                            >
                                {r.label}
                            </Text>
                            <Ionicons
                                name="chevron-forward"
                                size={16}
                                color={theme.textMuted}
                            />
                        </Pressable>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1 },
    topBar: {
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 14,
        borderBottomWidth: 1,
    },
    pageTitle: { fontSize: 22, fontWeight: '800' },
    heroCard: {
        borderRadius: 20,
        borderWidth: 1,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginTop: 16,
        marginBottom: 12,
    },
    avatar: {
        width: 72,
        height: 72,
        borderRadius: 36,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarLetter: { color: '#fff', fontSize: 28, fontWeight: '900' },
    heroText: { flex: 1, gap: 4 },
    name: { fontSize: 18, fontWeight: '800' },
    email: { fontSize: 13 },
    goldBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        alignSelf: 'flex-start',
        marginTop: 4,
    },
    goldBadgeText: {
        fontSize: 10,
        fontWeight: '800',
        color: '#D97706',
        letterSpacing: 0.5,
    },
    statsCard: {
        borderRadius: 20,
        borderWidth: 1,
        flexDirection: 'row',
        marginBottom: 20,
        overflow: 'hidden',
    },
    statCell: { flex: 1, alignItems: 'center', paddingVertical: 18 },
    statVal: { fontSize: 22, fontWeight: '900' },
    statLabel: { fontSize: 12, marginTop: 2 },
    sectionLabel: {
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 2,
        marginBottom: 10,
    },
    menuCard: {
        borderRadius: 20,
        borderWidth: 1,
        overflow: 'hidden',
        marginBottom: 20,
    },
    menuRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
        gap: 14,
    },
    menuIcon: {
        width: 38,
        height: 38,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuLabel: { flex: 1, fontSize: 15, fontWeight: '600' },
    toggle: {
        width: 44,
        height: 26,
        borderRadius: 13,
        padding: 2,
        justifyContent: 'center',
    },
    knob: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#fff' },
});
