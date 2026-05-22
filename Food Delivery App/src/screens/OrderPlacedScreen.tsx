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
import { useTheme } from '../context/ThemeContext';

const STEPS = [
    { icon: 'checkmark-circle', label: 'Order Placed', done: true },
    { icon: 'restaurant', label: 'Preparing', done: true },
    { icon: 'bicycle', label: 'Out for Delivery', done: false },
    { icon: 'home', label: 'Delivered', done: false },
];

export default function OrderPlacedScreen({
    navigation,
    route,
}: {
    navigation: any;
    route: any;
}) {
    const { theme } = useTheme();
    const orderId =
        route.params?.orderId ??
        'FD-' + Math.floor(100000 + Math.random() * 900000);
    const grandTotal = route.params?.grandTotal ?? 0;
    const eta = route.params?.eta ?? '25–35 min';

    return (
        <View style={[styles.root, { backgroundColor: theme.bg }]}>
            <StatusBar
                barStyle={theme.isDark ? 'light-content' : 'dark-content'}
                backgroundColor={theme.bg}
            />
            <SafeAreaView
                edges={['top']}
                style={{ backgroundColor: theme.bg }}
            />

            <ScrollView
                contentContainerStyle={{
                    paddingHorizontal: 20,
                    paddingBottom: 120,
                }}
            >
                <View style={[styles.heroCard, { backgroundColor: '#B91C1C' }]}>
                    <View style={styles.checkCircle}>
                        <Ionicons name="checkmark" size={40} color="#B91C1C" />
                    </View>
                    <Text style={styles.heroTitle}>Order Placed!</Text>
                    <Text style={styles.heroSub}>
                        Your order is confirmed and being prepared.
                    </Text>
                    <View style={styles.orderIdRow}>
                        <Text style={styles.orderIdLabel}>ORDER ID</Text>
                        <Text style={styles.orderId}>{orderId}</Text>
                    </View>
                </View>

                <View
                    style={[
                        styles.etaCard,
                        {
                            backgroundColor: theme.card,
                            borderColor: theme.border,
                        },
                    ]}
                >
                    <View style={styles.etaLeft}>
                        <Text
                            style={[
                                styles.etaLabel,
                                { color: theme.textMuted },
                            ]}
                        >
                            ESTIMATED DELIVERY
                        </Text>
                        <Text style={[styles.etaTime, { color: theme.text }]}>
                            {eta}
                        </Text>
                    </View>
                    <View
                        style={[
                            styles.etaDivider,
                            { backgroundColor: theme.border },
                        ]}
                    />
                    <View style={styles.etaRight}>
                        <Text
                            style={[
                                styles.etaLabel,
                                { color: theme.textMuted },
                            ]}
                        >
                            TOTAL PAID
                        </Text>
                        <Text style={[styles.etaTotal, { color: '#B91C1C' }]}>
                            ₹{grandTotal}
                        </Text>
                    </View>
                </View>

                <View
                    style={[
                        styles.trackCard,
                        {
                            backgroundColor: theme.card,
                            borderColor: theme.border,
                        },
                    ]}
                >
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>
                        Track Order
                    </Text>
                    <View style={styles.stepsWrap}>
                        {STEPS.map((step, idx) => (
                            <View key={step.label} style={styles.stepRow}>
                                <View style={styles.stepLeft}>
                                    <View
                                        style={[
                                            styles.stepDot,
                                            step.done
                                                ? styles.stepDotDone
                                                : {
                                                      backgroundColor:
                                                          theme.border,
                                                  },
                                        ]}
                                    >
                                        <Ionicons
                                            name={step.icon as any}
                                            size={16}
                                            color={
                                                step.done
                                                    ? '#fff'
                                                    : theme.textMuted
                                            }
                                        />
                                    </View>
                                    {idx < STEPS.length - 1 && (
                                        <View
                                            style={[
                                                styles.stepLine,
                                                {
                                                    backgroundColor: step.done
                                                        ? '#B91C1C'
                                                        : theme.border,
                                                },
                                            ]}
                                        />
                                    )}
                                </View>
                                <View style={styles.stepBody}>
                                    <Text
                                        style={[
                                            styles.stepLabel,
                                            {
                                                color: step.done
                                                    ? theme.text
                                                    : theme.textMuted,
                                            },
                                            step.done && styles.stepLabelDone,
                                        ]}
                                    >
                                        {step.label}
                                    </Text>
                                    {step.done && idx === 1 && (
                                        <Text
                                            style={[
                                                styles.stepSub,
                                                { color: theme.textMuted },
                                            ]}
                                        >
                                            Chef is preparing your meal
                                        </Text>
                                    )}
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                <View
                    style={[
                        styles.infoCard,
                        {
                            backgroundColor: theme.card,
                            borderColor: theme.border,
                        },
                    ]}
                >
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>
                        Delivery Info
                    </Text>
                    <View style={styles.infoRow}>
                        <View
                            style={[
                                styles.infoIconWrap,
                                { backgroundColor: '#B91C1C15' },
                            ]}
                        >
                            <Ionicons
                                name="location-outline"
                                size={20}
                                color="#B91C1C"
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text
                                style={[
                                    styles.infoLabel,
                                    { color: theme.text },
                                ]}
                            >
                                Home
                            </Text>
                            <Text
                                style={[
                                    styles.infoSub,
                                    { color: theme.textSub },
                                ]}
                            >
                                Sector 18, Noida, UP - 201301
                            </Text>
                        </View>
                    </View>
                    <View
                        style={[
                            styles.divider,
                            { backgroundColor: theme.border },
                        ]}
                    />
                    <View style={styles.infoRow}>
                        <View
                            style={[
                                styles.infoIconWrap,
                                { backgroundColor: '#B91C1C15' },
                            ]}
                        >
                            <Ionicons
                                name="card-outline"
                                size={20}
                                color="#B91C1C"
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text
                                style={[
                                    styles.infoLabel,
                                    { color: theme.text },
                                ]}
                            >
                                UPI / Google Pay
                            </Text>
                            <Text
                                style={[
                                    styles.infoSub,
                                    { color: theme.textSub },
                                ]}
                            >
                                Payment confirmed
                            </Text>
                        </View>
                        <Ionicons
                            name="checkmark-circle"
                            size={20}
                            color="#16A34A"
                        />
                    </View>
                </View>

                <View
                    style={[
                        styles.tipCard,
                        {
                            backgroundColor: theme.card,
                            borderColor: '#F59E0B',
                            borderLeftWidth: 3,
                        },
                    ]}
                >
                    <Ionicons name="flash" size={18} color="#F59E0B" />
                    <Text style={[styles.tipText, { color: theme.textSub }]}>
                        Your rider will call when nearby. Keep your phone handy!
                    </Text>
                </View>
            </ScrollView>

            <View
                style={[
                    styles.footer,
                    { backgroundColor: theme.bg, borderTopColor: theme.border },
                ]}
            >
                <Pressable
                    style={[styles.trackBtn, { borderColor: theme.border }]}
                    onPress={() => navigation.navigate('Orders')}
                >
                    <Ionicons
                        name="location-outline"
                        size={18}
                        color={theme.text}
                    />
                    <Text
                        style={[styles.trackBtnText, { color: theme.text }]}
                        onPress={() =>
                            navigation.navigate('OrdersTab', {
                                screen: 'Tracking',
                            })
                        }
                    >
                        TRACK ORDER
                    </Text>
                </Pressable>
                <Pressable
                    style={styles.homeBtn}
                    onPress={() =>
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'MainTabs' }],
                        })
                    }
                >
                    <Text style={styles.homeBtnText}>BACK TO HOME</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1 },
    heroCard: {
        borderRadius: 24,
        padding: 28,
        alignItems: 'center',
        marginBottom: 14,
        marginTop: 16,
    },
    checkCircle: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    heroTitle: {
        color: '#fff',
        fontSize: 26,
        fontWeight: '900',
        letterSpacing: -0.5,
        marginBottom: 8,
    },
    heroSub: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 20,
    },
    orderIdRow: {
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingVertical: 10,
        alignItems: 'center',
    },
    orderIdLabel: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 2,
        marginBottom: 4,
    },
    orderId: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '900',
        letterSpacing: 1,
    },
    etaCard: {
        borderRadius: 20,
        borderWidth: 1,
        flexDirection: 'row',
        padding: 20,
        marginBottom: 14,
    },
    etaLeft: { flex: 1, alignItems: 'center' },
    etaRight: { flex: 1, alignItems: 'center' },
    etaDivider: { width: 1, marginHorizontal: 8 },
    etaLabel: {
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 1.5,
        marginBottom: 6,
    },
    etaTime: { fontSize: 22, fontWeight: '900', letterSpacing: -0.5 },
    etaTotal: { fontSize: 22, fontWeight: '900', letterSpacing: -0.5 },
    trackCard: {
        borderRadius: 20,
        borderWidth: 1,
        padding: 20,
        marginBottom: 14,
    },
    sectionTitle: { fontSize: 16, fontWeight: '800', marginBottom: 20 },
    stepsWrap: { paddingLeft: 4 },
    stepRow: { flexDirection: 'row', gap: 16, minHeight: 52 },
    stepLeft: { alignItems: 'center', width: 36 },
    stepDot: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    stepDotDone: { backgroundColor: '#B91C1C' },
    stepLine: { width: 2, flex: 1, marginVertical: 4 },
    stepBody: { flex: 1, paddingTop: 8 },
    stepLabel: { fontSize: 14, fontWeight: '600' },
    stepLabelDone: { fontWeight: '800' },
    stepSub: { fontSize: 12, marginTop: 2 },
    infoCard: {
        borderRadius: 20,
        borderWidth: 1,
        padding: 20,
        marginBottom: 14,
    },
    infoRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
    infoIconWrap: {
        width: 42,
        height: 42,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoLabel: { fontSize: 14, fontWeight: '700', marginBottom: 2 },
    infoSub: { fontSize: 12 },
    divider: { height: 1, marginVertical: 14 },
    tipCard: {
        borderRadius: 14,
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        gap: 12,
        marginBottom: 20,
    },
    tipText: { flex: 1, fontSize: 13, lineHeight: 19 },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        gap: 12,
        padding: 16,
        borderTopWidth: 1,
    },
    trackBtn: {
        flex: 1,
        borderWidth: 1.5,
        borderRadius: 14,
        paddingVertical: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    trackBtnText: { fontSize: 13, fontWeight: '800', letterSpacing: 0.5 },
    homeBtn: {
        flex: 1,
        backgroundColor: '#B91C1C',
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    homeBtnText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
});
