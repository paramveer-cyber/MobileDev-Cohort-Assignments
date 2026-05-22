import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    Image,
    StatusBar,
    Modal,
} from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { MENU_ITEMS } from '../sample/data';
import { MenuItemCard } from '../components/MenuItemCard';
import { ItemCustomizeModal } from '../components/ItemCustomizeModal';

export default function RestaurantScreen({
    navigation,
    route,
}: {
    navigation: any;
    route: any;
}) {
    const { restaurant } = route.params;
    const { addItem, items } = useCart();
    const { theme } = useTheme();
    const [activeTab, setActiveTab] = useState('ALL ITEMS');
    const [selectedItem, setSelectedItem] = useState<any>(null);

    const cartCount = items.reduce((s, i) => s + i.qty, 0);
    const cartTotal = items.reduce((s, i) => s + i.price * i.qty, 0);
    const menu = MENU_ITEMS[restaurant.id] ?? MENU_ITEMS['1'];
    const rawCategories = Array.from(
        new Set(menu.map((m) => m.category ?? 'Other'))
    );
    const tabs = ['ALL ITEMS', ...rawCategories];
    const filteredMenu =
        activeTab === 'ALL ITEMS'
            ? menu
            : menu.filter((m) => (m.category ?? 'Other') === activeTab);
    const itemQty = (id: string) => items.find((i) => i.id === id)?.qty ?? 0;

    return (
        <View style={[styles.container, { backgroundColor: theme.bg }]}>
            <StatusBar
                barStyle="light-content"
                backgroundColor="transparent"
                translucent
            />
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.heroWrap}>
                    <Image
                        source={{ uri: restaurant.image }}
                        style={styles.heroImage}
                        resizeMode="cover"
                    />
                    <View style={styles.heroOverlay} />
                    <SafeAreaView edges={['top']} style={styles.heroSafeArea} />
                    <View style={styles.heroBadge}>
                        <Text style={styles.heroBadgeText}>
                            {restaurant.tag}
                        </Text>
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
                    <Text style={[styles.restName, { color: theme.text }]}>
                        {restaurant.name}
                    </Text>
                    <Text style={[styles.restDesc, { color: theme.textSub }]}>
                        {restaurant.description}
                    </Text>
                    <View
                        style={[
                            styles.divider,
                            { backgroundColor: theme.border },
                        ]}
                    />
                    <View style={styles.metaRow}>
                        <View style={styles.metaItem}>
                            <Text
                                style={[
                                    styles.metaLabel,
                                    { color: theme.textMuted },
                                ]}
                            >
                                RATING
                            </Text>
                            <Text
                                style={[styles.metaVal, { color: theme.text }]}
                            >
                                ★ {restaurant.rating}
                            </Text>
                        </View>
                        <View style={styles.metaItem}>
                            <Text
                                style={[
                                    styles.metaLabel,
                                    { color: theme.textMuted },
                                ]}
                            >
                                DELIVERY
                            </Text>
                            <Text
                                style={[styles.metaVal, { color: theme.text }]}
                            >
                                {restaurant.time}
                            </Text>
                        </View>
                        <View style={styles.metaItem}>
                            <Text
                                style={[
                                    styles.metaLabel,
                                    { color: theme.textMuted },
                                ]}
                            >
                                PRICE
                            </Text>
                            <Text
                                style={[styles.metaVal, { color: theme.text }]}
                            >
                                {restaurant.price}
                            </Text>
                        </View>
                    </View>
                </View>

                {restaurant.freeDelivery && (
                    <View style={styles.freeDeliveryBanner}>
                        <Ionicons
                            name="pricetag-outline"
                            size={22}
                            color="#fff"
                        />
                        <View>
                            <Text style={styles.freeDeliveryTitle}>
                                Free Delivery
                            </Text>
                            <Text style={styles.freeDeliverySub}>
                                On orders over ₹{restaurant.freeDeliveryMin} for
                                loyal members.
                            </Text>
                        </View>
                    </View>
                )}

                <View
                    style={[
                        styles.infoRow,
                        {
                            backgroundColor: theme.card,
                            borderColor: theme.border,
                        },
                    ]}
                >
                    <Ionicons
                        name="information-circle-outline"
                        size={22}
                        color="#B91C1C"
                    />
                    <View>
                        <Text style={[styles.infoTitle, { color: theme.text }]}>
                            Restaurant Info
                        </Text>
                        <Text
                            style={[styles.infoSub, { color: theme.textSub }]}
                        >
                            Open until {restaurant.openUntil} •{' '}
                            {restaurant.distance} away
                        </Text>
                    </View>
                </View>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.tabsRow}
                >
                    {tabs.map((tab) => (
                        <Pressable
                            key={tab}
                            style={[
                                styles.tab,
                                activeTab === tab && styles.tabActive,
                            ]}
                            onPress={() => setActiveTab(tab)}
                        >
                            <Text
                                style={[
                                    styles.tabText,
                                    activeTab === tab && styles.tabTextActive,
                                ]}
                            >
                                {tab}
                            </Text>
                        </Pressable>
                    ))}
                </ScrollView>

                {filteredMenu.map((item) => (
                    <MenuItemCard
                        key={item.id}
                        item={item}
                        qty={itemQty(item.id)}
                        onAdd={() => setSelectedItem(item)}
                    />
                ))}
                <View style={{ height: 120 }} />
            </ScrollView>

            {cartCount > 0 && (
                <View
                    style={[
                        styles.cartBar,
                        {
                            backgroundColor: theme.bg,
                            borderTopColor: theme.border,
                        },
                    ]}
                >
                    <Pressable
                        style={styles.cartBtn}
                        onPress={() => navigation.navigate('Cart')}
                    >
                        <View style={styles.cartCountWrap}>
                            <Text style={styles.cartCountText}>
                                {cartCount}
                            </Text>
                        </View>
                        <Text style={styles.cartBtnText}>VIEW ORDER</Text>
                        <Text style={styles.cartBtnTotal}>
                            ₹{cartTotal.toFixed(0)}
                        </Text>
                    </Pressable>
                </View>
            )}

            {selectedItem && (
                <ItemCustomizeModal
                    item={selectedItem}
                    onClose={() => setSelectedItem(null)}
                    onAdd={(qty) => {
                        for (let i = 0; i < qty; i++)
                            addItem({
                                id: selectedItem.id,
                                name: selectedItem.name,
                                price: selectedItem.price,
                            });
                        setSelectedItem(null);
                    }}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    heroWrap: { height: 260, position: 'relative' },
    heroImage: { width: '100%', height: 260 },
    heroOverlay: {
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.35)',
    },
    heroSafeArea: { position: 'absolute', top: 0, left: 0, right: 0 },
    backBtn: {
        margin: 16,
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    heroBadge: {
        position: 'absolute',
        bottom: 14,
        left: 14,
        backgroundColor: '#B91C1C',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 4,
    },
    heroBadgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 1,
    },
    infoCard: { margin: 14, borderRadius: 14, borderWidth: 1, padding: 16 },
    restName: { fontSize: 22, fontWeight: '800', marginBottom: 6 },
    restDesc: { fontSize: 13, lineHeight: 20, marginBottom: 14 },
    divider: { height: 1, marginBottom: 14 },
    metaRow: { flexDirection: 'row' },
    metaItem: { flex: 1, alignItems: 'center' },
    metaLabel: {
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 1,
        marginBottom: 4,
    },
    metaVal: { fontSize: 14, fontWeight: '800' },
    freeDeliveryBanner: {
        marginHorizontal: 14,
        marginBottom: 8,
        backgroundColor: '#0D9488',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    freeDeliveryTitle: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '800',
        marginBottom: 2,
    },
    freeDeliverySub: { color: 'rgba(255,255,255,0.85)', fontSize: 12 },
    infoRow: {
        marginHorizontal: 14,
        marginBottom: 14,
        borderRadius: 12,
        borderWidth: 1,
        padding: 14,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    infoTitle: { fontSize: 14, fontWeight: '700', marginBottom: 2 },
    infoSub: { fontSize: 12 },
    tabsRow: { paddingHorizontal: 14, gap: 8, paddingVertical: 10 },
    tab: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#DDD',
    },
    tabActive: { backgroundColor: '#B91C1C', borderColor: '#B91C1C' },
    tabText: { fontSize: 12, fontWeight: '700', color: '#777' },
    tabTextActive: { color: '#fff' },
    cartBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 12,
        borderTopWidth: 1,
    },
    cartBtn: {
        backgroundColor: '#B91C1C',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 12,
    },
    cartCountWrap: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        width: 26,
        height: 26,
        borderRadius: 13,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    cartCountText: { color: '#fff', fontSize: 13, fontWeight: '900' },
    cartBtnText: { color: '#fff', fontSize: 14, fontWeight: '800', flex: 1 },
    cartBtnTotal: { color: '#fff', fontSize: 16, fontWeight: '900' },
});
