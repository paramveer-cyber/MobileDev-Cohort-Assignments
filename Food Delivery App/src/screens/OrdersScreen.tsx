import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    Image,
    StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { useTheme } from '../context/ThemeContext';
import { MOCK_ORDERS_HISTORY, MOCK_ACTIVE_ORDER } from '../sample/data';

export default function OrdersScreen({ navigation }: { navigation: any }) {
    const { theme } = useTheme();

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
                        Order Activity
                    </Text>
                    <Text style={[styles.pageSub, { color: theme.textSub }]}>
                        Track your current cravings or revisit past favorites.
                    </Text>
                </View>
            </SafeAreaView>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                <View style={styles.sectionRow}>
                    <View style={styles.activeDot} />
                    <Text
                        style={[
                            styles.sectionLabel,
                            { color: theme.textMuted },
                        ]}
                    >
                        ACTIVE NOW
                    </Text>
                </View>

                <View
                    style={[
                        styles.activeCard,
                        {
                            backgroundColor: theme.card,
                            borderColor: theme.border,
                        },
                    ]}
                >
                    <Image
                        source={{ uri: MOCK_ACTIVE_ORDER.image }}
                        style={styles.activeImg}
                        resizeMode="cover"
                    />
                    <View style={styles.activeBody}>
                        <View style={styles.activeNameRow}>
                            <Text
                                style={[
                                    styles.activeName,
                                    { color: theme.text },
                                ]}
                            >
                                {MOCK_ACTIVE_ORDER.restaurant}
                            </Text>
                            <View style={styles.prepBadge}>
                                <Text style={styles.prepBadgeText}>
                                    {MOCK_ACTIVE_ORDER.status}
                                </Text>
                            </View>
                        </View>
                        <Text
                            style={[
                                styles.activeItems,
                                { color: theme.textSub },
                            ]}
                        >
                            {MOCK_ACTIVE_ORDER.items}
                        </Text>
                        <View style={styles.progressRow}>
                            <Text
                                style={[
                                    styles.etaText,
                                    { color: theme.textMuted },
                                ]}
                            >
                                OUT FOR DELIVERY IN {MOCK_ACTIVE_ORDER.eta}
                            </Text>
                            <Text
                                style={[styles.pctText, { color: theme.text }]}
                            >
                                {Math.round(MOCK_ACTIVE_ORDER.progress * 100)}%
                            </Text>
                        </View>
                        <View
                            style={[
                                styles.progressBg,
                                { backgroundColor: theme.border },
                            ]}
                        >
                            <View
                                style={[
                                    styles.progressFill,
                                    {
                                        width: `${MOCK_ACTIVE_ORDER.progress * 100}%` as any,
                                    },
                                ]}
                            />
                        </View>
                        <Pressable
                            style={[
                                styles.trackBtn,
                                { borderColor: theme.border },
                            ]}
                            onPress={() =>
                                navigation.navigate('HomeTab', {
                                    screen: 'Tracking',
                                })
                            }
                        >
                            <Ionicons
                                name="location-outline"
                                size={16}
                                color={theme.text}
                                style={{ marginRight: 6 }}
                            />
                            <Text
                                style={[
                                    styles.trackBtnText,
                                    { color: theme.text },
                                ]}
                            >
                                TRACK RIDER
                            </Text>
                        </Pressable>
                    </View>
                </View>

                <View
                    style={[
                        styles.comingSoonCard,
                        {
                            backgroundColor: theme.card,
                            borderColor: theme.border,
                        },
                    ]}
                >
                    <Ionicons
                        name="restaurant-outline"
                        size={28}
                        color="#B91C1C"
                    />
                    <Text
                        style={[styles.comingSoonTitle, { color: theme.text }]}
                    >
                        Coming Soon
                    </Text>
                    <Text
                        style={[styles.comingSoonSub, { color: theme.textSub }]}
                    >
                        Your meal is being handcrafted by the chef.
                    </Text>
                </View>

                <Text
                    style={[
                        styles.sectionLabel,
                        {
                            color: theme.textMuted,
                            paddingHorizontal: 16,
                            marginBottom: 8,
                        },
                    ]}
                >
                    HISTORY
                </Text>

                {MOCK_ORDERS_HISTORY.map((order) => (
                    <View
                        key={order.id}
                        style={[
                            styles.histCard,
                            { borderBottomColor: theme.border },
                        ]}
                    >
                        <View style={styles.histTop}>
                            <Image
                                source={{ uri: order.image }}
                                style={styles.histImg}
                                resizeMode="cover"
                            />
                            <View style={styles.histBody}>
                                <Text
                                    style={[
                                        styles.histDate,
                                        { color: theme.textMuted },
                                    ]}
                                >
                                    {order.date}
                                </Text>
                                <Text
                                    style={[
                                        styles.histName,
                                        { color: theme.text },
                                    ]}
                                >
                                    {order.restaurant}
                                </Text>
                                <Text
                                    style={[
                                        styles.histItems,
                                        { color: theme.textSub },
                                    ]}
                                >
                                    {order.items}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.histBottom}>
                            <Text style={styles.histTotal}>₹{order.total}</Text>
                            <Pressable
                                style={[
                                    styles.reorderBtn,
                                    { borderColor: theme.border },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.reorderText,
                                        { color: theme.text },
                                    ]}
                                >
                                    REORDER
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1 },
    topBar: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 14,
        borderBottomWidth: 1,
    },
    pageTitle: { fontSize: 22, fontWeight: '800', marginBottom: 4 },
    pageSub: { fontSize: 13 },
    sectionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    activeDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#B91C1C',
    },
    sectionLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 1.5 },
    activeCard: {
        marginHorizontal: 14,
        borderRadius: 16,
        borderWidth: 1,
        overflow: 'hidden',
        marginBottom: 12,
    },
    activeImg: { width: '100%', height: 180 },
    activeBody: { padding: 16 },
    activeNameRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    activeName: { fontSize: 17, fontWeight: '800' },
    prepBadge: {
        backgroundColor: '#B91C1C',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 4,
    },
    prepBadgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1,
    },
    activeItems: { fontSize: 13, marginBottom: 12 },
    progressRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    etaText: { fontSize: 11, fontWeight: '600', letterSpacing: 0.3 },
    pctText: { fontSize: 12, fontWeight: '700' },
    progressBg: { height: 4, borderRadius: 2, marginBottom: 14 },
    progressFill: { height: 4, backgroundColor: '#B91C1C', borderRadius: 2 },
    trackBtn: {
        borderWidth: 1.5,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    trackBtnText: { fontSize: 12, fontWeight: '800', letterSpacing: 1 },
    comingSoonCard: {
        marginHorizontal: 14,
        borderRadius: 16,
        borderWidth: 1,
        padding: 28,
        alignItems: 'center',
        marginBottom: 20,
        gap: 8,
    },
    comingSoonTitle: { fontSize: 16, fontWeight: '700' },
    comingSoonSub: { fontSize: 13, textAlign: 'center' },
    histCard: {
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
    },
    histTop: { flexDirection: 'row', gap: 12, marginBottom: 12 },
    histImg: { width: 60, height: 60, borderRadius: 8 },
    histBody: { flex: 1 },
    histDate: { fontSize: 12, marginBottom: 4 },
    histName: { fontSize: 15, fontWeight: '700', marginBottom: 4 },
    histItems: { fontSize: 13, lineHeight: 18 },
    histBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    histTotal: { fontSize: 17, fontWeight: '800', color: '#B91C1C' },
    reorderBtn: {
        borderWidth: 1.5,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 6,
    },
    reorderText: { fontSize: 12, fontWeight: '700', letterSpacing: 0.5 },
});
