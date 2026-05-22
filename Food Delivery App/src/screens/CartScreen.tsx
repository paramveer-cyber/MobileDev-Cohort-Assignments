import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { StatusBar } from 'react-native';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

export default function CartScreen({ navigation }: { navigation: any }) {
    const { items, addItem, removeItem, clearCart, total } = useCart();
    const { theme } = useTheme();

    const delivery = 39;
    const serviceFee = Math.round(total * 0.05);
    const gst = Math.round(total * 0.05);
    const grandTotal = total + delivery + serviceFee + gst;

    if (items.length === 0) {
        return (
            <View style={[styles.empty, { backgroundColor: theme.bg }]}>
                <StatusBar
                    barStyle={theme.isDark ? 'light-content' : 'dark-content'}
                    backgroundColor={theme.bg}
                />
                <Ionicons
                    name="cart-outline"
                    size={64}
                    color={theme.textMuted}
                />
                <Text style={[styles.emptyTitle, { color: theme.text }]}>
                    Cart is empty
                </Text>
                <Text style={[styles.emptySub, { color: theme.textSub }]}>
                    Add items from a restaurant to begin.
                </Text>
                <Pressable
                    style={styles.browseBtn}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.browseBtnText}>Browse Restaurants</Text>
                    <Ionicons name="arrow-forward" size={16} color="#fff" />
                </Pressable>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.bg }]}>
            <StatusBar
                barStyle={theme.isDark ? 'light-content' : 'dark-content'}
                backgroundColor={theme.bg}
            />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 140 }}
            >
                <View
                    style={[
                        styles.orderCard,
                        {
                            backgroundColor: theme.card,
                            borderColor: theme.border,
                        },
                    ]}
                >
                    <View style={styles.orderHeader}>
                        <Text
                            style={[styles.orderTitle, { color: theme.text }]}
                        >
                            Order Summary
                        </Text>
                        <Text
                            style={[
                                styles.orderCount,
                                { color: theme.textMuted },
                            ]}
                        >
                            {items.length} ITEMS
                        </Text>
                    </View>

                    {items.map((item) => (
                        <View
                            key={item.id}
                            style={[
                                styles.itemRow,
                                { borderTopColor: theme.border },
                            ]}
                        >
                            <View
                                style={[
                                    styles.itemImg,
                                    { backgroundColor: theme.border },
                                ]}
                            >
                                <Ionicons
                                    name="restaurant-outline"
                                    size={24}
                                    color={theme.textMuted}
                                />
                            </View>
                            <View style={styles.itemBody}>
                                <Text
                                    style={[
                                        styles.itemName,
                                        { color: theme.text },
                                    ]}
                                >
                                    {item.name}
                                </Text>
                                <Text
                                    style={[
                                        styles.itemUnit,
                                        { color: theme.textMuted },
                                    ]}
                                >
                                    ₹{item.price} per item
                                </Text>
                            </View>
                            <View style={styles.itemRight}>
                                <Text
                                    style={[
                                        styles.itemPrice,
                                        { color: '#B91C1C' },
                                    ]}
                                >
                                    ₹{item.price * item.qty}
                                </Text>
                                <View style={styles.qtyRow}>
                                    <Pressable
                                        style={[
                                            styles.qtyBtn,
                                            { borderColor: theme.border },
                                        ]}
                                        onPress={() => removeItem(item.id)}
                                    >
                                        <Text
                                            style={[
                                                styles.qtyBtnText,
                                                { color: theme.text },
                                            ]}
                                        >
                                            −
                                        </Text>
                                    </Pressable>
                                    <Text
                                        style={[
                                            styles.qty,
                                            { color: theme.text },
                                        ]}
                                    >
                                        {item.qty}
                                    </Text>
                                    <Pressable
                                        style={[
                                            styles.qtyBtn,
                                            {
                                                backgroundColor: '#B91C1C',
                                                borderColor: '#B91C1C',
                                            },
                                        ]}
                                        onPress={() =>
                                            addItem({
                                                id: item.id,
                                                name: item.name,
                                                price: item.price,
                                            })
                                        }
                                    >
                                        <Text
                                            style={[
                                                styles.qtyBtnText,
                                                { color: '#fff' },
                                            ]}
                                        >
                                            +
                                        </Text>
                                    </Pressable>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>

                <View
                    style={[
                        styles.sectionCard,
                        {
                            backgroundColor: theme.card,
                            borderColor: theme.border,
                        },
                    ]}
                >
                    <View style={styles.cardTopRow}>
                        <Text style={[styles.cardTitle, { color: theme.text }]}>
                            Delivery Address
                        </Text>
                        <Text style={styles.editBtn}>EDIT</Text>
                    </View>
                    <View style={styles.addressRow}>
                        <Ionicons
                            name="location-outline"
                            size={22}
                            color="#B91C1C"
                        />
                        <View>
                            <Text
                                style={[
                                    styles.addressName,
                                    { color: theme.text },
                                ]}
                            >
                                Home
                            </Text>
                            <Text
                                style={[
                                    styles.addressDetail,
                                    { color: theme.textSub },
                                ]}
                            >
                                Sector 18, Noida{'\n'}Uttar Pradesh - 201301
                            </Text>
                        </View>
                    </View>
                    <View style={[styles.noteBox, { borderColor: '#B91C1C' }]}>
                        <Text
                            style={[
                                styles.noteLabel,
                                { color: theme.textMuted },
                            ]}
                        >
                            NOTE FOR DELIVERY
                        </Text>
                        <Text
                            style={[styles.noteText, { color: theme.textSub }]}
                        >
                            "Gate code is 4455. Please call on arrival."
                        </Text>
                    </View>
                </View>

                <View
                    style={[
                        styles.sectionCard,
                        {
                            backgroundColor: theme.card,
                            borderColor: theme.border,
                        },
                    ]}
                >
                    <View style={styles.cardTopRow}>
                        <Text style={[styles.cardTitle, { color: theme.text }]}>
                            Payment Method
                        </Text>
                        <Text style={styles.editBtn}>EDIT</Text>
                    </View>
                    <View
                        style={[styles.payRow, { borderColor: theme.border }]}
                    >
                        <Ionicons
                            name="card-outline"
                            size={26}
                            color={theme.text}
                        />
                        <View style={{ flex: 1 }}>
                            <Text
                                style={[styles.payName, { color: theme.text }]}
                            >
                                UPI / Google Pay
                            </Text>
                            <Text
                                style={[
                                    styles.paySub,
                                    { color: theme.textSub },
                                ]}
                            >
                                Connected to +91 98765 43210
                            </Text>
                        </View>
                        <Ionicons
                            name="checkmark-circle"
                            size={22}
                            color="#B91C1C"
                        />
                    </View>
                    <Pressable
                        style={[styles.promoBtn, { borderColor: theme.border }]}
                    >
                        <Text
                            style={[styles.promoBtnText, { color: theme.text }]}
                        >
                            + ADD PROMO CODE
                        </Text>
                    </Pressable>
                </View>

                <View
                    style={[
                        styles.sectionCard,
                        {
                            backgroundColor: theme.card,
                            borderColor: theme.border,
                        },
                    ]}
                >
                    <Text
                        style={[
                            styles.cardTitle,
                            { color: theme.text, marginBottom: 16 },
                        ]}
                    >
                        Bill Details
                    </Text>
                    <View style={styles.billRow}>
                        <Text
                            style={[styles.billLabel, { color: theme.textSub }]}
                        >
                            Subtotal
                        </Text>
                        <Text style={[styles.billVal, { color: theme.text }]}>
                            ₹{total}
                        </Text>
                    </View>
                    <View style={styles.billRow}>
                        <Text
                            style={[styles.billLabel, { color: theme.textSub }]}
                        >
                            Delivery Fee
                        </Text>
                        <Text style={[styles.billVal, { color: theme.text }]}>
                            ₹{delivery}
                        </Text>
                    </View>
                    <View style={styles.billRow}>
                        <Text
                            style={[styles.billLabel, { color: theme.textSub }]}
                        >
                            Platform Fee (5%)
                        </Text>
                        <Text style={[styles.billVal, { color: theme.text }]}>
                            ₹{serviceFee}
                        </Text>
                    </View>
                    <View style={[styles.billRow, { marginBottom: 8 }]}>
                        <Text
                            style={[styles.billLabel, { color: theme.textSub }]}
                        >
                            GST (5%)
                        </Text>
                        <Text style={[styles.billVal, { color: theme.text }]}>
                            ₹{gst}
                        </Text>
                    </View>
                    <View
                        style={[
                            styles.totalDivider,
                            { borderColor: theme.border },
                        ]}
                    />
                    <View style={styles.billRow}>
                        <Text
                            style={[styles.totalLabel, { color: theme.text }]}
                        >
                            Total
                        </Text>
                        <Text style={styles.totalVal}>₹{grandTotal}</Text>
                    </View>
                </View>

                <View
                    style={[
                        styles.fastDelivery,
                        { borderColor: '#F59E0B', backgroundColor: '#FFFBEB' },
                    ]}
                >
                    <Ionicons name="flash-outline" size={22} color="#92400E" />
                    <View>
                        <Text style={styles.fastTitle}>
                            FASTEST DELIVERY AVAILABLE
                        </Text>
                        <Text style={styles.fastSub}>
                            Expected arrival:{' '}
                            {items.length > 0 ? '25 - 35 mins' : '--'}
                        </Text>
                    </View>
                </View>
            </ScrollView>

            <View
                style={[
                    styles.footer,
                    { backgroundColor: theme.bg, borderTopColor: theme.border },
                ]}
            >
                <View>
                    <Text
                        style={[styles.footerLabel, { color: theme.textMuted }]}
                    >
                        TOTAL AMOUNT
                    </Text>
                    <Text style={styles.footerTotal}>₹{grandTotal}</Text>
                </View>
                <Pressable
                    style={styles.footerBtn}
                    onPress={() => {
                        const oid =
                            'FD-' + Math.floor(100000 + Math.random() * 900000);
                        clearCart();
                        navigation.navigate('OrderPlaced', {
                            grandTotal,
                            orderId: oid,
                            eta: '25–35 min',
                        });
                    }}
                >
                    <Text style={styles.footerBtnText}>PLACE ORDER</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    empty: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
        gap: 12,
    },
    emptyTitle: { fontSize: 22, fontWeight: '800' },
    emptySub: { fontSize: 14, textAlign: 'center' },
    browseBtn: {
        backgroundColor: '#B91C1C',
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 8,
    },
    browseBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
    orderCard: {
        margin: 14,
        borderRadius: 16,
        borderWidth: 1,
        overflow: 'hidden',
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    orderTitle: { fontSize: 17, fontWeight: '800' },
    orderCount: { fontSize: 12, fontWeight: '600' },
    itemRow: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderTopWidth: 1,
        alignItems: 'center',
        gap: 12,
    },
    itemImg: {
        width: 60,
        height: 60,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemBody: { flex: 1 },
    itemName: { fontSize: 15, fontWeight: '700', marginBottom: 4 },
    itemUnit: { fontSize: 12 },
    itemRight: { alignItems: 'flex-end', gap: 8 },
    itemPrice: { fontSize: 15, fontWeight: '800' },
    qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    qtyBtn: {
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    qtyBtnText: { fontSize: 16, fontWeight: '700', lineHeight: 18 },
    qty: { fontSize: 15, fontWeight: '700', minWidth: 18, textAlign: 'center' },
    sectionCard: {
        marginHorizontal: 14,
        marginBottom: 10,
        borderRadius: 16,
        borderWidth: 1,
        padding: 16,
    },
    cardTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 14,
    },
    cardTitle: { fontSize: 16, fontWeight: '800' },
    editBtn: { color: '#B91C1C', fontSize: 12, fontWeight: '700' },
    addressRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
    addressName: { fontSize: 15, fontWeight: '700', marginBottom: 2 },
    addressDetail: { fontSize: 13, lineHeight: 20 },
    noteBox: { borderLeftWidth: 3, paddingLeft: 12 },
    noteLabel: {
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 1,
        marginBottom: 4,
    },
    noteText: { fontSize: 13, fontStyle: 'italic', lineHeight: 19 },
    payRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 10,
        padding: 12,
        gap: 12,
        marginBottom: 12,
    },
    payName: { fontSize: 14, fontWeight: '700', marginBottom: 2 },
    paySub: { fontSize: 12 },
    promoBtn: {
        borderWidth: 1,
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
    },
    promoBtnText: { fontSize: 12, fontWeight: '700', letterSpacing: 1 },
    billRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    billLabel: { fontSize: 14 },
    billVal: { fontSize: 14, fontWeight: '600' },
    totalDivider: {
        borderTopWidth: 1,
        borderStyle: 'dashed',
        marginVertical: 12,
    },
    totalLabel: { fontSize: 16, fontWeight: '800' },
    totalVal: { fontSize: 22, fontWeight: '900', color: '#B91C1C' },
    fastDelivery: {
        marginHorizontal: 14,
        marginBottom: 14,
        borderWidth: 1,
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: 14,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    fastTitle: {
        fontSize: 12,
        fontWeight: '800',
        color: '#92400E',
        letterSpacing: 0.5,
        marginBottom: 2,
    },
    fastSub: { fontSize: 12, color: '#92400E' },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderTopWidth: 1,
    },
    footerLabel: { fontSize: 11, fontWeight: '600', marginBottom: 2 },
    footerTotal: { fontSize: 18, fontWeight: '900', color: '#B91C1C' },
    footerBtn: {
        backgroundColor: '#B91C1C',
        paddingHorizontal: 28,
        paddingVertical: 14,
        borderRadius: 10,
    },
    footerBtnText: {
        color: '#fff',
        fontWeight: '800',
        fontSize: 14,
        letterSpacing: 0.5,
    },
});
