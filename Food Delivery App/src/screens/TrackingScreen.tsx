import {
    View,
    Text,
    StyleSheet,
    Pressable,
    ScrollView,
    StatusBar,
    Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { useTheme } from '../context/ThemeContext';
import { useRef, useEffect } from 'react';
import { MOCK_ACTIVE_ORDER } from '../sample/data';

const STEPS = [
    {
        icon: 'checkmark-circle',
        label: 'Order Placed',
        sub: 'Confirmed at 7:42 PM',
        done: true,
    },
    {
        icon: 'restaurant',
        label: 'Preparing',
        sub: 'Chef is cooking your order',
        done: true,
    },
    {
        icon: 'bicycle',
        label: 'Out for Delivery',
        sub: 'Rider picked up your order',
        done: true,
    },
    { icon: 'home', label: 'Delivered', sub: 'ETA 8:15 PM', done: false },
];

const RIDER = {
    name: 'Arjun Kumar',
    rating: 4.9,
    vehicle: 'Hero Splendor • MH 01 AB 1234',
    phone: '+91 98765 43210',
    eta: '12 min away',
};

export default function TrackingScreen({ navigation }: { navigation: any }) {
    const { theme } = useTheme();
    const pulse = useRef(new Animated.Value(1)).current;
    const riderX = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulse, {
                    toValue: 1.15,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(pulse, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        Animated.loop(
            Animated.sequence([
                Animated.timing(riderX, {
                    toValue: 8,
                    duration: 1200,
                    useNativeDriver: true,
                }),
                Animated.timing(riderX, {
                    toValue: -8,
                    duration: 1200,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    const progress = MOCK_ACTIVE_ORDER.progress;

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
                    <Pressable
                        onPress={() => navigation.goBack()}
                        style={styles.backBtn}
                    >
                        <Ionicons
                            name="arrow-back"
                            size={22}
                            color={theme.text}
                        />
                    </Pressable>
                    <Text style={[styles.pageTitle, { color: theme.text }]}>
                        LIVE TRACKING
                    </Text>
                    <View style={{ width: 36 }} />
                </View>
            </SafeAreaView>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40 }}
            >
                <View
                    style={[
                        styles.mapBox,
                        {
                            backgroundColor: theme.card,
                            borderColor: theme.border,
                        },
                    ]}
                >
                    <View
                        style={[
                            styles.mapBg,
                            {
                                backgroundColor: theme.isDark
                                    ? '#1a2a1a'
                                    : '#e8f5e8',
                            },
                        ]}
                    >
                        <View
                            style={[
                                styles.mapGrid,
                                {
                                    borderColor: theme.isDark
                                        ? '#2a3a2a'
                                        : '#d0e8d0',
                                },
                            ]}
                        />
                        <View
                            style={[
                                styles.mapGridH,
                                {
                                    borderColor: theme.isDark
                                        ? '#2a3a2a'
                                        : '#d0e8d0',
                                },
                            ]}
                        />

                        <View
                            style={[
                                styles.routeLine,
                                {
                                    backgroundColor: theme.isDark
                                        ? '#4a5a4a'
                                        : '#b0c8b0',
                                },
                            ]}
                        />
                        <View
                            style={[
                                styles.routeLineDone,
                                { width: `${progress * 100}%` as any },
                            ]}
                        />

                        <View style={[styles.destPin, { left: '80%' }]}>
                            <View
                                style={[
                                    styles.destDot,
                                    { backgroundColor: '#B91C1C' },
                                ]}
                            >
                                <Ionicons name="home" size={12} color="#fff" />
                            </View>
                            <View style={styles.destPole} />
                        </View>

                        <Animated.View
                            style={[
                                styles.riderMarker,
                                {
                                    left: `${20 + progress * 55}%` as any,
                                    transform: [{ translateX: riderX }],
                                },
                            ]}
                        >
                            <Animated.View
                                style={[
                                    styles.riderPulse,
                                    {
                                        transform: [{ scale: pulse }],
                                        backgroundColor: '#B91C1C20',
                                    },
                                ]}
                            />
                            <View
                                style={[
                                    styles.riderDot,
                                    { backgroundColor: '#B91C1C' },
                                ]}
                            >
                                <Ionicons
                                    name="bicycle"
                                    size={14}
                                    color="#fff"
                                />
                            </View>
                        </Animated.View>

                        <View
                            style={[
                                styles.etaBubble,
                                { backgroundColor: '#B91C1C' },
                            ]}
                        >
                            <Ionicons
                                name="time-outline"
                                size={12}
                                color="#fff"
                            />
                            <Text style={styles.etaBubbleText}>
                                {RIDER.eta}
                            </Text>
                        </View>
                    </View>
                </View>

                <View
                    style={[
                        styles.riderCard,
                        {
                            backgroundColor: theme.card,
                            borderColor: theme.border,
                        },
                    ]}
                >
                    <View
                        style={[
                            styles.riderAvatar,
                            { backgroundColor: '#B91C1C' },
                        ]}
                    >
                        <Text style={styles.riderAvatarText}>
                            {RIDER.name[0]}
                        </Text>
                    </View>
                    <View style={styles.riderInfo}>
                        <Text style={[styles.riderName, { color: theme.text }]}>
                            {RIDER.name}
                        </Text>
                        <View style={styles.riderRatingRow}>
                            <Ionicons name="star" size={12} color="#B91C1C" />
                            <Text
                                style={[
                                    styles.riderRating,
                                    { color: theme.textSub },
                                ]}
                            >
                                {RIDER.rating} · {RIDER.vehicle}
                            </Text>
                        </View>
                    </View>
                    <Pressable
                        style={[
                            styles.callBtn,
                            {
                                backgroundColor: '#B91C1C12',
                                borderColor: '#B91C1C30',
                            },
                        ]}
                    >
                        <Ionicons
                            name="call-outline"
                            size={20}
                            color="#B91C1C"
                        />
                    </Pressable>
                    <Pressable
                        style={[
                            styles.callBtn,
                            {
                                backgroundColor: theme.card,
                                borderColor: theme.border,
                            },
                        ]}
                    >
                        <Ionicons
                            name="chatbubble-outline"
                            size={20}
                            color={theme.text}
                        />
                    </Pressable>
                </View>

                <View
                    style={[
                        styles.progressSection,
                        {
                            backgroundColor: theme.card,
                            borderColor: theme.border,
                        },
                    ]}
                >
                    <View style={styles.progressLabelRow}>
                        <Text
                            style={[
                                styles.progressLabel,
                                { color: theme.text },
                            ]}
                        >
                            Delivery Progress
                        </Text>
                        <Text
                            style={[styles.progressPct, { color: '#B91C1C' }]}
                        >
                            {Math.round(progress * 100)}%
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
                                { width: `${progress * 100}%` as any },
                            ]}
                        />
                    </View>
                </View>

                <View
                    style={[
                        styles.stepsCard,
                        {
                            backgroundColor: theme.card,
                            borderColor: theme.border,
                        },
                    ]}
                >
                    <Text style={[styles.stepsTitle, { color: theme.text }]}>
                        Order Status
                    </Text>
                    {STEPS.map((step, i) => (
                        <View key={step.label} style={styles.stepRow}>
                            <View style={styles.stepLeft}>
                                <View
                                    style={[
                                        styles.stepIconWrap,
                                        {
                                            backgroundColor: step.done
                                                ? '#B91C1C'
                                                : theme.border,
                                        },
                                    ]}
                                >
                                    <Ionicons
                                        name={step.icon as any}
                                        size={16}
                                        color={
                                            step.done ? '#fff' : theme.textMuted
                                        }
                                    />
                                </View>
                                {i < STEPS.length - 1 && (
                                    <View
                                        style={[
                                            styles.stepConnector,
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
                                            fontWeight: step.done
                                                ? '700'
                                                : '500',
                                        },
                                    ]}
                                >
                                    {step.label}
                                </Text>
                                <Text
                                    style={[
                                        styles.stepSub,
                                        { color: theme.textMuted },
                                    ]}
                                >
                                    {step.sub}
                                </Text>
                            </View>
                            {step.done &&
                                i ===
                                    STEPS.filter((s) => s.done).length - 1 && (
                                    <View
                                        style={[
                                            styles.activeBadge,
                                            { backgroundColor: '#B91C1C12' },
                                        ]}
                                    >
                                        <View style={styles.activeDot} />
                                        <Text style={styles.activeText}>
                                            ACTIVE
                                        </Text>
                                    </View>
                                )}
                        </View>
                    ))}
                </View>

                <View
                    style={[
                        styles.orderSummary,
                        {
                            backgroundColor: theme.card,
                            borderColor: theme.border,
                        },
                    ]}
                >
                    <Text style={[styles.stepsTitle, { color: theme.text }]}>
                        Order Summary
                    </Text>
                    <View style={styles.summaryRow}>
                        <Text
                            style={[
                                styles.summaryLabel,
                                { color: theme.textMuted },
                            ]}
                        >
                            Restaurant
                        </Text>
                        <Text
                            style={[styles.summaryVal, { color: theme.text }]}
                        >
                            {MOCK_ACTIVE_ORDER.restaurant}
                        </Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text
                            style={[
                                styles.summaryLabel,
                                { color: theme.textMuted },
                            ]}
                        >
                            Items
                        </Text>
                        <Text
                            style={[styles.summaryVal, { color: theme.text }]}
                        >
                            {MOCK_ACTIVE_ORDER.items}
                        </Text>
                    </View>
                    <View style={[styles.summaryRow, { borderBottomWidth: 0 }]}>
                        <Text
                            style={[
                                styles.summaryLabel,
                                { color: theme.textMuted },
                            ]}
                        >
                            Order ID
                        </Text>
                        <Text
                            style={[
                                styles.summaryVal,
                                { color: '#B91C1C', fontWeight: '700' },
                            ]}
                        >
                            FD-482910
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1 },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
    },
    backBtn: { width: 36, height: 36, justifyContent: 'center' },
    pageTitle: { fontSize: 13, fontWeight: '900', letterSpacing: 2 },
    mapBox: {
        margin: 14,
        borderRadius: 16,
        borderWidth: 1,
        overflow: 'hidden',
    },
    mapBg: { height: 220, position: 'relative', overflow: 'hidden' },
    mapGrid: {
        position: 'absolute',
        top: 0,
        left: '33%',
        bottom: 0,
        width: 1,
        borderLeftWidth: 1,
    },
    mapGridH: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: '50%',
        height: 1,
        borderTopWidth: 1,
    },
    routeLine: {
        position: 'absolute',
        top: '60%',
        left: '15%',
        right: '15%',
        height: 3,
        borderRadius: 2,
    },
    routeLineDone: {
        position: 'absolute',
        top: '60%',
        left: '15%',
        height: 3,
        borderRadius: 2,
        backgroundColor: '#B91C1C',
    },
    destPin: { position: 'absolute', top: '38%', alignItems: 'center' },
    destDot: {
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    destPole: { width: 2, height: 12, backgroundColor: '#B91C1C' },
    riderMarker: {
        position: 'absolute',
        top: '46%',
        alignItems: 'center',
        marginLeft: -20,
    },
    riderPulse: {
        position: 'absolute',
        width: 44,
        height: 44,
        borderRadius: 22,
    },
    riderDot: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    etaBubble: {
        position: 'absolute',
        top: 12,
        right: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
    },
    etaBubbleText: { color: '#fff', fontSize: 12, fontWeight: '700' },
    riderCard: {
        marginHorizontal: 14,
        borderRadius: 14,
        borderWidth: 1,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 12,
    },
    riderAvatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    riderAvatarText: { color: '#fff', fontSize: 18, fontWeight: '900' },
    riderInfo: { flex: 1 },
    riderName: { fontSize: 15, fontWeight: '700', marginBottom: 3 },
    riderRatingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    riderRating: { fontSize: 12 },
    callBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
    },
    progressSection: {
        marginHorizontal: 14,
        borderRadius: 14,
        borderWidth: 1,
        padding: 16,
        marginBottom: 12,
    },
    progressLabelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    progressLabel: { fontSize: 14, fontWeight: '600' },
    progressPct: { fontSize: 14, fontWeight: '800' },
    progressBg: { height: 6, borderRadius: 3 },
    progressFill: { height: 6, backgroundColor: '#B91C1C', borderRadius: 3 },
    stepsCard: {
        marginHorizontal: 14,
        borderRadius: 14,
        borderWidth: 1,
        padding: 16,
        marginBottom: 12,
    },
    stepsTitle: { fontSize: 15, fontWeight: '800', marginBottom: 16 },
    stepRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 0,
    },
    stepLeft: { alignItems: 'center', marginRight: 14, width: 32 },
    stepIconWrap: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    stepConnector: { width: 2, height: 28, borderRadius: 1, marginTop: 2 },
    stepBody: { flex: 1, paddingBottom: 20, paddingTop: 6 },
    stepLabel: { fontSize: 14, marginBottom: 2 },
    stepSub: { fontSize: 12 },
    activeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 20,
        marginTop: 6,
    },
    activeDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#B91C1C',
    },
    activeText: {
        fontSize: 10,
        color: '#B91C1C',
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    orderSummary: {
        marginHorizontal: 14,
        borderRadius: 14,
        borderWidth: 1,
        padding: 16,
        marginBottom: 12,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
    },
    summaryLabel: { fontSize: 13 },
    summaryVal: { fontSize: 13, flex: 1, textAlign: 'right', marginLeft: 12 },
});
