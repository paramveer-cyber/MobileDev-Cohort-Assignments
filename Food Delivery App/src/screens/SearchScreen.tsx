import {
    View,
    Text,
    StyleSheet,
    TextInput,
    FlatList,
    Pressable,
    Image,
    Modal,
    ScrollView,
    StatusBar,
} from 'react-native';
import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { useTheme } from '../context/ThemeContext';
import { RESTAURANTS } from '../sample/data';

const SORT_OPTIONS = [
    'Price: Low to High',
    'Price: High to Low',
    'Delivery Time',
    'Top Rated',
];
const PRICE_RANGES = [
    { label: 'VALUE', sub: 'Under ₹150', max: 150, min: 0 },
    { label: 'MID-RANGE', sub: '₹150 - ₹300', max: 300, min: 150 },
    { label: 'PREMIUM', sub: '₹300 - ₹500', max: 500, min: 300 },
    { label: 'LUXURY', sub: '₹500+', max: Infinity, min: 500 },
];
const DIETARY = ['Veg', 'Non-Veg', 'Jain', 'Gluten-Free', 'Keto', 'Vegan'];

export default function SearchScreen({
    navigation,
    route,
}: {
    navigation: any;
    route: any;
}) {
    const [query, setQuery] = useState(route?.params?.initialQuery ?? '');
    const [showFilters, setShowFilters] = useState(false);
    const [selectedSort, setSelectedSort] = useState<string | null>(null);
    const [selectedRange, setSelectedRange] = useState<string | null>(null);
    const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
    const [under20, setUnder20] = useState(false);
    const [under40, setUnder40] = useState(false);
    const [selectedRating, setSelectedRating] = useState<string | null>(null);
    const { theme } = useTheme();

    useEffect(() => {
        if (route?.params?.initialQuery) {
            setQuery(route.params.initialQuery);
        }
    }, [route?.params?.initialQuery]);

    const activeFilterCount =
        [selectedSort, selectedRange, selectedRating].filter(Boolean).length +
        selectedDietary.length +
        (under20 ? 1 : 0) +
        (under40 ? 1 : 0);

    function applyFilters(list: typeof RESTAURANTS) {
        let out = [...list];

        if (selectedRange) {
            const r = PRICE_RANGES.find((p) => p.label === selectedRange);
            if (r)
                out = out.filter(
                    (x) =>
                        parseInt(x.price.slice(4, 8)) >= r.min &&
                        parseInt(x.price.slice(4, 8)) <= r.max
                );
        }

        if (selectedDietary.length > 0) {
            out = out.filter((x) =>
                selectedDietary.some((d) => x.dietary.toLowerCase() === d)
            );
        }

        if (under20)
            out = out.filter((x) => {
                return (
                    (parseInt(x.time.slice(0, 2)) +
                        parseInt(x.time.slice(3, 5))) /
                        2 <=
                    20
                );
            });
        else if (under40)
            out = out.filter(
                (x) =>
                    (parseInt(x.time.slice(0, 2)) +
                        parseInt(x.time.slice(3, 5))) /
                        2 <=
                    40
            );

        if (selectedRating) {
            const minR = parseFloat(selectedRating);
            out = out.filter((x) => x.rating >= minR);
        }

        if (selectedSort === 'Price: Low to High')
            out.sort(
                (a, b) =>
                    parseInt(a.price.slice(4, 8)) -
                    parseInt(b.price.slice(4, 8))
            );
        else if (selectedSort === 'Price: High to Low')
            out.sort(
                (a, b) =>
                    parseInt(b.price.slice(4, 8)) -
                    parseInt(a.price.slice(4, 8))
            );
        else if (selectedSort === 'Delivery Time')
            out.sort(
                (a, b) =>
                    (parseInt(a.time.slice(0, 2)) +
                        parseInt(a.time.slice(3, 5))) /
                        2 -
                    (parseInt(b.time.slice(0, 2)) +
                        parseInt(b.time.slice(3, 5))) /
                        2
            );
        else if (selectedSort === 'Top Rated')
            out.sort((a, b) => b.rating - a.rating);

        return out;
    }

    const base =
        query.length > 0
            ? RESTAURANTS.filter(
                  (r) =>
                      r.name.toLowerCase().includes(query.toLowerCase()) ||
                      r.cuisine.toLowerCase().includes(query.toLowerCase())
              )
            : RESTAURANTS;

    const results = applyFilters(base);

    function toggleDiet(d: string) {
        setSelectedDietary((prev) =>
            prev.includes(d.toLowerCase())
                ? prev.filter((x) => x.toLowerCase() !== d.toLowerCase())
                : [...prev, d.toLowerCase()]
        );
    }

    function clearAll() {
        setSelectedSort(null);
        setSelectedRange(null);
        setSelectedDietary([]);
        setUnder20(false);
        setUnder40(false);
        setSelectedRating(null);
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
                    <View
                        style={[
                            styles.searchWrap,
                            {
                                backgroundColor: theme.card,
                                borderColor: theme.border,
                            },
                        ]}
                    >
                        <Ionicons
                            name="search-outline"
                            size={18}
                            color={theme.textMuted}
                        />
                        <TextInput
                            style={[styles.input, { color: theme.text }]}
                            placeholder="What are you craving?"
                            placeholderTextColor={theme.textMuted}
                            value={query}
                            onChangeText={setQuery}
                            autoFocus
                        />
                        {query.length > 0 && (
                            <Pressable onPress={() => setQuery('')}>
                                <Ionicons
                                    name="close-circle"
                                    size={18}
                                    color={theme.textMuted}
                                />
                            </Pressable>
                        )}
                    </View>
                    <Pressable
                        style={[
                            styles.filterBtn,
                            {
                                borderColor:
                                    activeFilterCount > 0
                                        ? '#B91C1C'
                                        : theme.border,
                                backgroundColor:
                                    activeFilterCount > 0
                                        ? '#FFF5F5'
                                        : 'transparent',
                            },
                        ]}
                        onPress={() => setShowFilters(true)}
                    >
                        <Ionicons
                            name="options-outline"
                            size={18}
                            color={
                                activeFilterCount > 0 ? '#B91C1C' : theme.text
                            }
                        />
                        <Text
                            style={[
                                styles.filterText,
                                {
                                    color:
                                        activeFilterCount > 0
                                            ? '#B91C1C'
                                            : theme.text,
                                },
                            ]}
                        >
                            {activeFilterCount > 0
                                ? `Filters (${activeFilterCount})`
                                : 'Filters'}
                        </Text>
                    </Pressable>
                </View>
            </SafeAreaView>

            {results.length === 0 ? (
                <View style={styles.emptyState}>
                    <Ionicons
                        name="search-outline"
                        size={48}
                        color={theme.border}
                    />
                    <Text style={[styles.emptyTitle, { color: theme.text }]}>
                        No results
                    </Text>
                    <Text style={[styles.emptySub, { color: theme.textMuted }]}>
                        Try adjusting your search or filters
                    </Text>
                    {activeFilterCount > 0 && (
                        <Pressable
                            style={[
                                styles.clearFiltersBtn,
                                { borderColor: '#B91C1C' },
                            ]}
                            onPress={clearAll}
                        >
                            <Text style={styles.clearFiltersBtnText}>
                                Clear Filters
                            </Text>
                        </Pressable>
                    )}
                </View>
            ) : (
                <FlatList
                    data={results}
                    keyExtractor={(r) => r.id}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <Pressable
                            style={[
                                styles.card,
                                { borderBottomColor: theme.border },
                            ]}
                            onPress={() =>
                                navigation.navigate('HomeTab', {
                                    screen: 'RestaurantDetail',
                                    params: { restaurant: item },
                                })
                            }
                        >
                            <Image
                                source={{ uri: item.image }}
                                style={styles.cardImg}
                                resizeMode="cover"
                            />
                            <View style={styles.cardBody}>
                                <View style={styles.cardTopRow}>
                                    <Text
                                        style={[
                                            styles.cardName,
                                            { color: theme.text },
                                        ]}
                                    >
                                        {item.name}
                                    </Text>
                                    <View style={styles.ratingBox}>
                                        <Ionicons
                                            name="star"
                                            size={11}
                                            color="#fff"
                                        />
                                        <Text style={styles.ratingText}>
                                            {item.rating}
                                        </Text>
                                    </View>
                                </View>
                                <Text
                                    style={[
                                        styles.cardCuisine,
                                        { color: theme.textSub },
                                    ]}
                                >
                                    {item.cuisine}
                                </Text>
                                <Text
                                    style={[
                                        styles.cardMeta,
                                        { color: theme.textMuted },
                                    ]}
                                >
                                    {item.time} · {item.price}
                                </Text>
                            </View>
                        </Pressable>
                    )}
                />
            )}

            <Modal visible={showFilters} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <Pressable
                        style={styles.modalBackdrop}
                        onPress={() => setShowFilters(false)}
                    />
                    <View
                        style={[
                            styles.filterSheet,
                            { backgroundColor: theme.bg },
                        ]}
                    >
                        <SafeAreaView edges={['top']}>
                            <View style={styles.filterHeader}>
                                <Pressable
                                    onPress={() => setShowFilters(false)}
                                >
                                    <Ionicons
                                        name="close"
                                        size={24}
                                        color={theme.text}
                                    />
                                </Pressable>
                                <Text
                                    style={[
                                        styles.filterTitle,
                                        { color: '#B91C1C' },
                                    ]}
                                >
                                    Filters
                                </Text>
                                <Pressable onPress={clearAll}>
                                    <Text
                                        style={[
                                            styles.clearAll,
                                            {
                                                color:
                                                    activeFilterCount > 0
                                                        ? '#B91C1C'
                                                        : theme.textMuted,
                                            },
                                        ]}
                                    >
                                        CLEAR ALL
                                    </Text>
                                </Pressable>
                            </View>
                        </SafeAreaView>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View
                                style={[
                                    styles.filterSection,
                                    {
                                        backgroundColor: theme.card,
                                        borderColor: theme.border,
                                    },
                                ]}
                            >
                                <View style={styles.filterSectionHeader}>
                                    <Ionicons
                                        name="swap-vertical-outline"
                                        size={20}
                                        color="#B91C1C"
                                    />
                                    <Text
                                        style={[
                                            styles.filterSectionTitle,
                                            { color: theme.text },
                                        ]}
                                    >
                                        Sort by
                                    </Text>
                                </View>
                                {SORT_OPTIONS.map((opt) => (
                                    <Pressable
                                        key={opt}
                                        style={[
                                            styles.sortRow,
                                            { borderColor: theme.border },
                                        ]}
                                        onPress={() =>
                                            setSelectedSort((prev) =>
                                                prev === opt ? null : opt
                                            )
                                        }
                                    >
                                        <Text
                                            style={[
                                                styles.sortLabel,
                                                { color: theme.text },
                                            ]}
                                        >
                                            {opt}
                                        </Text>
                                        <View
                                            style={[
                                                styles.radio,
                                                {
                                                    borderColor:
                                                        selectedSort === opt
                                                            ? '#B91C1C'
                                                            : theme.border,
                                                },
                                            ]}
                                        >
                                            {selectedSort === opt && (
                                                <View
                                                    style={styles.radioInner}
                                                />
                                            )}
                                        </View>
                                    </Pressable>
                                ))}
                            </View>

                            <View
                                style={[
                                    styles.filterSection,
                                    {
                                        backgroundColor: theme.card,
                                        borderColor: theme.border,
                                    },
                                ]}
                            >
                                <View style={styles.filterSectionHeader}>
                                    <Ionicons
                                        name="cash-outline"
                                        size={20}
                                        color="#B91C1C"
                                    />
                                    <Text
                                        style={[
                                            styles.filterSectionTitle,
                                            { color: theme.text },
                                        ]}
                                    >
                                        Price Range
                                    </Text>
                                </View>
                                <View style={styles.priceGrid}>
                                    {PRICE_RANGES.map((r) => (
                                        <Pressable
                                            key={r.label}
                                            style={[
                                                styles.priceCell,
                                                {
                                                    borderColor:
                                                        selectedRange ===
                                                        r.label
                                                            ? '#B91C1C'
                                                            : theme.border,
                                                    backgroundColor:
                                                        selectedRange ===
                                                        r.label
                                                            ? '#FFF5F5'
                                                            : 'transparent',
                                                },
                                            ]}
                                            onPress={() =>
                                                setSelectedRange((prev) =>
                                                    prev === r.label
                                                        ? null
                                                        : r.label
                                                )
                                            }
                                        >
                                            <Text
                                                style={[
                                                    styles.priceCellLabel,
                                                    {
                                                        color:
                                                            selectedRange ===
                                                            r.label
                                                                ? '#B91C1C'
                                                                : theme.textMuted,
                                                    },
                                                ]}
                                            >
                                                {r.label}
                                            </Text>
                                            <Text
                                                style={[
                                                    styles.priceCellSub,
                                                    {
                                                        color:
                                                            selectedRange ===
                                                            r.label
                                                                ? '#B91C1C'
                                                                : theme.text,
                                                    },
                                                ]}
                                            >
                                                {r.sub}
                                            </Text>
                                        </Pressable>
                                    ))}
                                </View>
                            </View>

                            <View
                                style={[
                                    styles.filterSection,
                                    {
                                        backgroundColor: theme.card,
                                        borderColor: theme.border,
                                    },
                                ]}
                            >
                                <View style={styles.filterSectionHeader}>
                                    <Ionicons
                                        name="leaf-outline"
                                        size={20}
                                        color="#B91C1C"
                                    />
                                    <Text
                                        style={[
                                            styles.filterSectionTitle,
                                            { color: theme.text },
                                        ]}
                                    >
                                        Dietary Preferences
                                    </Text>
                                </View>
                                <View style={styles.dietWrap}>
                                    {DIETARY.map((d) => (
                                        <Pressable
                                            key={d}
                                            style={[
                                                styles.dietChip,
                                                {
                                                    backgroundColor:
                                                        selectedDietary.includes(
                                                            d.toLowerCase()
                                                        )
                                                            ? '#B91C1C'
                                                            : 'transparent',
                                                    borderColor:
                                                        selectedDietary.includes(
                                                            d.toLowerCase()
                                                        )
                                                            ? '#B91C1C'
                                                            : theme.border,
                                                },
                                            ]}
                                            onPress={() => toggleDiet(d)}
                                        >
                                            <Text
                                                style={[
                                                    styles.dietChipText,
                                                    {
                                                        color: selectedDietary.includes(
                                                            d.toLowerCase()
                                                        )
                                                            ? '#fff'
                                                            : theme.text,
                                                    },
                                                ]}
                                            >
                                                {d}
                                            </Text>
                                        </Pressable>
                                    ))}
                                </View>
                            </View>

                            <View
                                style={[
                                    styles.filterSection,
                                    {
                                        backgroundColor: theme.card,
                                        borderColor: theme.border,
                                    },
                                ]}
                            >
                                <View style={styles.filterSectionHeader}>
                                    <Ionicons
                                        name="time-outline"
                                        size={20}
                                        color="#B91C1C"
                                    />
                                    <Text
                                        style={[
                                            styles.filterSectionTitle,
                                            { color: theme.text },
                                        ]}
                                    >
                                        Delivery Time
                                    </Text>
                                </View>
                                <View style={styles.toggleRow}>
                                    <Text
                                        style={[
                                            styles.toggleLabel,
                                            { color: theme.text },
                                        ]}
                                    >
                                        Under 20 min
                                    </Text>
                                    <Pressable
                                        style={[
                                            styles.toggle,
                                            {
                                                backgroundColor: under20
                                                    ? '#B91C1C'
                                                    : theme.border,
                                            },
                                        ]}
                                        onPress={() => {
                                            setUnder20((p) => !p);
                                            if (!under20) setUnder40(false);
                                        }}
                                    >
                                        <View
                                            style={[
                                                styles.toggleKnob,
                                                {
                                                    marginLeft: under20
                                                        ? 18
                                                        : 2,
                                                },
                                            ]}
                                        />
                                    </Pressable>
                                </View>
                                <View style={styles.toggleRow}>
                                    <Text
                                        style={[
                                            styles.toggleLabel,
                                            { color: theme.text },
                                        ]}
                                    >
                                        Under 40 min
                                    </Text>
                                    <Pressable
                                        style={[
                                            styles.toggle,
                                            {
                                                backgroundColor: under40
                                                    ? '#B91C1C'
                                                    : theme.border,
                                            },
                                        ]}
                                        onPress={() => {
                                            setUnder40((p) => !p);
                                            if (!under40) setUnder20(false);
                                        }}
                                    >
                                        <View
                                            style={[
                                                styles.toggleKnob,
                                                {
                                                    marginLeft: under40
                                                        ? 18
                                                        : 2,
                                                },
                                            ]}
                                        />
                                    </Pressable>
                                </View>
                            </View>

                            <View
                                style={[
                                    styles.filterSection,
                                    {
                                        backgroundColor: theme.card,
                                        borderColor: theme.border,
                                    },
                                ]}
                            >
                                <View style={styles.filterSectionHeader}>
                                    <Ionicons
                                        name="star-outline"
                                        size={20}
                                        color="#B91C1C"
                                    />
                                    <Text
                                        style={[
                                            styles.filterSectionTitle,
                                            { color: theme.text },
                                        ]}
                                    >
                                        Minimum Rating
                                    </Text>
                                </View>
                                <View style={styles.ratingRow}>
                                    {['3.5', '4.0', '4.5'].map((r) => (
                                        <Pressable
                                            key={r}
                                            style={[
                                                styles.ratingChip,
                                                {
                                                    backgroundColor:
                                                        selectedRating === r
                                                            ? '#FFF5F5'
                                                            : 'transparent',
                                                    borderColor:
                                                        selectedRating === r
                                                            ? '#B91C1C'
                                                            : theme.border,
                                                },
                                            ]}
                                            onPress={() =>
                                                setSelectedRating((prev) =>
                                                    prev === r ? null : r
                                                )
                                            }
                                        >
                                            <Text
                                                style={[
                                                    styles.ratingChipText,
                                                    {
                                                        color:
                                                            selectedRating === r
                                                                ? '#B91C1C'
                                                                : theme.text,
                                                    },
                                                ]}
                                            >
                                                {r}+ ☆
                                            </Text>
                                        </Pressable>
                                    ))}
                                </View>
                            </View>
                            <View style={{ height: 20 }} />
                        </ScrollView>

                        <Pressable
                            style={styles.applyBtn}
                            onPress={() => setShowFilters(false)}
                        >
                            <Text style={styles.applyBtnText}>
                                {results.length} result
                                {results.length !== 1 ? 's' : ''} — Apply
                            </Text>
                            <Ionicons
                                name="arrow-forward"
                                size={18}
                                color="#fff"
                            />
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1 },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderBottomWidth: 1,
        gap: 10,
    },
    searchWrap: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        gap: 8,
    },
    input: { flex: 1, fontSize: 14 },
    filterBtn: {
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    filterText: { fontSize: 13, fontWeight: '600' },
    card: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
        gap: 12,
    },
    cardImg: { width: 74, height: 74, borderRadius: 8 },
    cardBody: { flex: 1, justifyContent: 'center' },
    cardTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    cardName: { fontSize: 15, fontWeight: '700', flex: 1 },
    ratingBox: {
        backgroundColor: '#B91C1C',
        paddingHorizontal: 7,
        paddingVertical: 3,
        borderRadius: 4,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
    },
    ratingText: { color: '#fff', fontSize: 11, fontWeight: '800' },
    cardCuisine: { fontSize: 12, marginBottom: 4 },
    cardMeta: { fontSize: 12 },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        paddingBottom: 80,
    },
    emptyTitle: { fontSize: 18, fontWeight: '700' },
    emptySub: { fontSize: 14 },
    clearFiltersBtn: {
        marginTop: 8,
        borderWidth: 1.5,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    clearFiltersBtnText: { color: '#B91C1C', fontWeight: '700', fontSize: 14 },
    modalOverlay: { flex: 1 },
    modalBackdrop: {
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    filterSheet: { position: 'absolute', inset: 0, paddingBottom: 20 },
    filterHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 14,
    },
    filterTitle: { fontSize: 22, fontWeight: '800' },
    clearAll: { fontSize: 12, fontWeight: '600' },
    filterSection: {
        marginHorizontal: 14,
        marginBottom: 12,
        borderRadius: 14,
        borderWidth: 1,
        padding: 16,
    },
    filterSectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 14,
    },
    filterSectionTitle: { fontSize: 16, fontWeight: '700' },
    sortRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderTopWidth: 1,
    },
    sortLabel: { fontSize: 14 },
    radio: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#B91C1C',
    },
    priceGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    priceCell: { width: '47%', borderWidth: 1.5, borderRadius: 8, padding: 12 },
    priceCellLabel: {
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 0.5,
        marginBottom: 2,
    },
    priceCellSub: { fontSize: 13, fontWeight: '700' },
    dietWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    dietChip: {
        borderWidth: 1.5,
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    dietChipText: { fontSize: 13, fontWeight: '600' },
    toggleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
    },
    toggleLabel: { fontSize: 14 },
    toggle: {
        width: 44,
        height: 26,
        borderRadius: 13,
        justifyContent: 'center',
        padding: 2,
    },
    toggleKnob: {
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: '#fff',
    },
    ratingRow: { flexDirection: 'row', gap: 10 },
    ratingChip: {
        flex: 1,
        borderWidth: 1.5,
        borderRadius: 8,
        paddingVertical: 10,
        alignItems: 'center',
    },
    ratingChipText: { fontSize: 14, fontWeight: '600' },
    applyBtn: {
        marginHorizontal: 14,
        backgroundColor: '#B91C1C',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 8,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
    },
    applyBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
