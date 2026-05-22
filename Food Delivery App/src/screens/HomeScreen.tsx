import {
    View,
    Text,
    StyleSheet,
    Pressable,
    ScrollView,
    StatusBar,
    Image,
    Dimensions,
} from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { RESTAURANTS, CATEGORIES, POPULAR_ITEMS } from '../sample/data';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { FeaturedCard } from '../components/FeaturedCard';
import { PopularItemCard } from '../components/PopularItemCard';
import { useState } from 'react';

const { width } = Dimensions.get('window');
const CELL = (width - 48 - 24) / 3;
const appIcon = require('../../assets/icon.png');

export default function HomeScreen({ navigation }: { navigation: any }) {
    const { theme } = useTheme();
    const { items, addItem } = useCart();
    const [categoriesShown, setcategoriesShown] = useState<number>(6);
    const [restaurantsShown, setrestaurantsShown] = useState<number>(3);
    const [popularItemsShown, setpopularItemsShown] = useState<number>(4);
    const rootNav = useNavigation<any>();
    const cartCount = items.reduce((s, i) => s + i.qty, 0);
    const cartTotal = items.reduce((s, i) => s + i.price * i.qty, 0);
    const featured = RESTAURANTS.filter((r) => r.featured);
    const rest = RESTAURANTS.filter((r) => !r.featured);

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
                        onPress={() =>
                            rootNav.dispatch(DrawerActions.openDrawer())
                        }
                        style={styles.iconBtn}
                    >
                        <View style={styles.hamburger}>
                            <View
                                style={[
                                    styles.hLine,
                                    { backgroundColor: theme.text },
                                ]}
                            />
                            <View
                                style={[
                                    styles.hLine,
                                    { backgroundColor: theme.text, width: 14 },
                                ]}
                            />
                        </View>
                    </Pressable>
                    <Image
                        source={appIcon}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                    <Pressable
                        style={styles.iconBtn}
                        onPress={() => navigation.navigate('Cart')}
                    >
                        <Ionicons
                            name="bag-outline"
                            size={24}
                            color={theme.text}
                        />
                        {cartCount > 0 && (
                            <View style={styles.cartBadge}>
                                <Text style={styles.cartBadgeText}>
                                    {cartCount}
                                </Text>
                            </View>
                        )}
                    </Pressable>
                </View>
            </SafeAreaView>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: cartCount > 0 ? 140 : 100,
                }}
            >
                <Pressable
                    style={[
                        styles.searchBar,
                        {
                            backgroundColor: theme.card,
                            borderColor: theme.border,
                        },
                    ]}
                    onPress={() =>
                        rootNav.navigate('SearchTab', {
                            screen: 'Search',
                        })
                    }
                >
                    <Ionicons
                        name="search-outline"
                        size={18}
                        color={theme.textMuted}
                    />
                    <Text
                        style={[
                            styles.searchPlaceholder,
                            { color: theme.textMuted },
                        ]}
                    >
                        What are you craving?
                    </Text>
                </Pressable>

                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>
                        Categories
                    </Text>
                    <Pressable
                        onPress={() => {
                            if (categoriesShown === 6) {
                                setcategoriesShown(CATEGORIES.length);
                            } else {
                                setcategoriesShown(6);
                            }
                        }}
                        hitSlop={10}
                    >
                        {categoriesShown === 6 ? (
                            <Text style={styles.viewAll}>VIEW ALL</Text>
                        ) : (
                            <Text style={styles.viewAll}>HIDE</Text>
                        )}
                    </Pressable>
                </View>

                <View style={styles.categoryGrid}>
                    {CATEGORIES.slice(0, categoriesShown).map((cat) => (
                        <Pressable
                            key={cat.label}
                            style={[
                                styles.catCell,
                                {
                                    backgroundColor: theme.card,
                                    borderColor: theme.border,
                                },
                            ]}
                            onPress={() =>
                                rootNav.navigate('SearchTab', {
                                    screen: 'Search',
                                    params: { initialQuery: cat.label },
                                })
                            }
                        >
                            <Image
                                source={{ uri: cat.image }}
                                style={styles.catImage}
                                resizeMode="cover"
                            />
                            <Text
                                style={[styles.catLabel, { color: theme.text }]}
                            >
                                {cat.label.toUpperCase()}
                            </Text>
                        </Pressable>
                    ))}
                </View>

                <Text
                    style={[
                        styles.sectionTitle,
                        {
                            color: theme.text,
                            paddingHorizontal: 16,
                            marginTop: 24,
                            marginBottom: 12,
                        },
                    ]}
                >
                    Featured
                </Text>

                {featured.map((r, i) => (
                    <FeaturedCard
                        key={r.id}
                        item={r}
                        index={i}
                        onPress={() =>
                            navigation.navigate('RestaurantDetail', {
                                restaurant: r,
                            })
                        }
                    />
                ))}

                <View
                    style={[
                        styles.sectionHeader,
                        { marginTop: 24, marginBottom: 4 },
                    ]}
                >
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>
                        Near You
                    </Text>
                    <Pressable
                        onPress={() => {
                            if (restaurantsShown === 3) {
                                setrestaurantsShown(RESTAURANTS.length);
                            } else {
                                setrestaurantsShown(3);
                            }
                        }}
                        hitSlop={10}
                    >
                        {restaurantsShown === 3 ? (
                            <Text style={styles.viewAll}>VIEW ALL</Text>
                        ) : (
                            <Text style={styles.viewAll}>HIDE</Text>
                        )}
                    </Pressable>
                </View>

                {rest.slice(0, restaurantsShown).map((r) => (
                    <Pressable
                        key={r.id}
                        style={[
                            styles.smallCard,
                            { borderColor: theme.border },
                        ]}
                        onPress={() =>
                            navigation.navigate('RestaurantDetail', {
                                restaurant: r,
                            })
                        }
                    >
                        <Image
                            source={{ uri: r.image }}
                            style={styles.smallCardImg}
                            resizeMode="cover"
                        />
                        <View style={styles.smallCardBody}>
                            <Text
                                style={[
                                    styles.smallCardName,
                                    { color: theme.text },
                                ]}
                            >
                                {r.name}
                            </Text>
                            <Text
                                style={[
                                    styles.smallCardSub,
                                    { color: theme.textSub },
                                ]}
                            >
                                {r.cuisine} • {r.time}
                            </Text>
                            <View style={styles.ratingRow}>
                                <Ionicons
                                    name="star"
                                    size={12}
                                    color="#B91C1C"
                                />
                                <Text
                                    style={[
                                        styles.ratingNum,
                                        { color: theme.text },
                                    ]}
                                >
                                    {r.rating} ({r.ratingCount})
                                </Text>
                            </View>
                        </View>
                    </Pressable>
                ))}

                <View
                    style={[
                        styles.sectionHeader,
                        { marginTop: 24, marginBottom: 12 },
                    ]}
                >
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>
                        Popular Right Now
                    </Text>
                    <Pressable
                        onPress={() => {
                            if (popularItemsShown === 4) {
                                setpopularItemsShown(POPULAR_ITEMS.length);
                            } else {
                                setpopularItemsShown(4);
                            }
                        }}
                        hitSlop={10}
                    >
                        {popularItemsShown === 4 ? (
                            <Text style={styles.viewAll}>VIEW ALL</Text>
                        ) : (
                            <Text style={styles.viewAll}>HIDE</Text>
                        )}
                    </Pressable>
                </View>

                <View style={styles.popularGrid}>
                    {POPULAR_ITEMS.slice(0, popularItemsShown).map((item) => (
                        <PopularItemCard
                            key={item.id}
                            item={item}
                            onAdd={() =>
                                addItem({
                                    id: item.id,
                                    name: item.name,
                                    price: item.price,
                                })
                            }
                        />
                    ))}
                </View>

                <View
                    style={[styles.promoBanner, { backgroundColor: '#B91C1C' }]}
                >
                    <Text style={styles.promoTitle}>
                        First order? Get 20% off.
                    </Text>
                    <Text style={styles.promoSub}>
                        Experience the finest culinary delights delivered with
                        architectural precision.
                    </Text>
                    <Text style={styles.promoCode}>Use code: FOOODU20</Text>
                    <Pressable style={styles.promoBtn}>
                        <Text style={styles.promoBtnText}>Claim Offer</Text>
                    </Pressable>
                </View>
            </ScrollView>

            <Pressable
                style={[styles.surpriseBtn, { backgroundColor: '#7C3AED' }]}
                onPress={() => {
                    const randomRestaurant =
                        RESTAURANTS[
                            Math.floor(Math.random() * RESTAURANTS.length)
                        ];
                    navigation.navigate('RestaurantDetail', {
                        restaurant: randomRestaurant,
                    });
                }}
            >
                <Ionicons
                    name="shuffle-outline"
                    size={18}
                    color="#fff"
                    style={{ marginRight: 8 }}
                />
                <Text style={styles.surpriseBtnText}>SURPRISE ME</Text>
            </Pressable>

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
                        style={styles.cartBarBtn}
                        onPress={() => navigation.navigate('Cart')}
                    >
                        <Ionicons
                            name="cart-outline"
                            size={20}
                            color="#fff"
                            style={{ marginRight: 12 }}
                        />
                        <Text style={styles.cartBarText}>
                            VIEW CART ({cartCount})
                        </Text>
                        <Text style={styles.cartBarTotal}>
                            ₹{cartTotal.toFixed(0)}
                        </Text>
                    </Pressable>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1 },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    hamburger: { gap: 4, padding: 4 },
    hLine: { height: 2, width: 20 },
    logo: {
        width: 96,
        height: 96,
        borderRadius: 8,
        position: 'absolute',
        left: '50%',
        transform: 'translate(-50%, 0)',
    },
    iconBtn: { padding: 4, position: 'relative' },
    cartBadge: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: '#B91C1C',
        width: 16,
        height: 16,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cartBadgeText: { color: '#fff', fontSize: 9, fontWeight: '900' },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        marginVertical: 14,
        borderWidth: 1,
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderRadius: 8,
        gap: 8,
    },
    searchPlaceholder: { fontSize: 14 },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    sectionTitle: { fontSize: 18, fontWeight: '700' },
    viewAll: {
        fontSize: 12,
        fontWeight: '700',
        color: '#B91C1C',
        letterSpacing: 0.5,
    },
    categoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        paddingHorizontal: 16,
    },
    catCell: {
        width: CELL,
        borderRadius: 12,
        borderWidth: 1,
        overflow: 'hidden',
        alignItems: 'center',
        paddingBottom: 8,
    },
    catImage: { width: '100%', height: 64 },
    catLabel: {
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 0.8,
        marginTop: 6,
    },
    smallCard: {
        flexDirection: 'row',
        marginHorizontal: 16,
        marginBottom: 8,
        paddingHorizontal: 12,
        paddingVertical: 12,
        borderWidth: 1,
        borderRadius: 14,
        gap: 12,
    },
    smallCardImg: { width: 80, height: 72, borderRadius: 10 },
    smallCardBody: { flex: 1, justifyContent: 'center' },
    smallCardName: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
    smallCardSub: { fontSize: 13, marginBottom: 4 },
    ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    ratingNum: { fontSize: 13, fontWeight: '600' },
    popularGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 16,
        gap: 12,
        marginBottom: 8,
    },
    promoBanner: { margin: 16, borderRadius: 16, padding: 24 },
    promoTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '800',
        marginBottom: 8,
    },
    promoSub: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 13,
        lineHeight: 19,
        marginBottom: 8,
    },
    promoCode: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 12,
        marginBottom: 16,
    },
    promoBtn: {
        backgroundColor: '#fff',
        alignSelf: 'flex-start',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    promoBtnText: { color: '#B91C1C', fontWeight: '700', fontSize: 14 },
    cartBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 12,
        borderTopWidth: 1,
    },
    cartBarBtn: {
        backgroundColor: '#B91C1C',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 12,
    },
    cartBarText: { color: '#fff', fontWeight: '800', fontSize: 14, flex: 1 },
    cartBarTotal: { color: '#fff', fontWeight: '900', fontSize: 16 },
    surpriseBtn: {
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 30,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    surpriseBtnText: {
        color: '#fff',
        fontWeight: '900',
        fontSize: 13,
        letterSpacing: 1.5,
    },
});
