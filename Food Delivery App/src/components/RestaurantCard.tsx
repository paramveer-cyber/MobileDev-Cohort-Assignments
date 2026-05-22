import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { useTheme } from '../context/ThemeContext';

type Restaurant = {
    id: string;
    name: string;
    cuisine: string;
    rating: number;
    price: number;
    time: string;
    image: string;
    tag: string;
    tagColor: string;
    description: string;
};

type Props = {
    item: Restaurant;
    onPress: () => void;
    index: number;
};

export function RestaurantCard({ item, onPress, index }: Props) {
    const { theme } = useTheme();
    const isFeature = index === 0;

    if (isFeature) {
        return (
            <Pressable
                style={({ pressed }) => [
                    styles.featCard,
                    { borderColor: theme.border, opacity: pressed ? 0.94 : 1 },
                ]}
                onPress={onPress}
            >
                <Image
                    source={{ uri: item.image }}
                    style={styles.featImage}
                    resizeMode="cover"
                />
                <View style={[styles.featOverlay]}>
                    <View
                        style={[styles.tag, { backgroundColor: item.tagColor }]}
                    >
                        <Text style={styles.tagText}>{item.tag}</Text>
                    </View>
                </View>
                <View
                    style={[
                        styles.featBody,
                        {
                            backgroundColor: theme.card,
                            borderColor: theme.border,
                        },
                    ]}
                >
                    <View style={styles.featTop}>
                        <View style={{ flex: 1 }}>
                            <Text
                                style={[styles.featName, { color: theme.text }]}
                            >
                                {item.name}
                            </Text>
                            <Text
                                style={[
                                    styles.featCuisine,
                                    { color: theme.textSub },
                                ]}
                            >
                                {item.cuisine}
                            </Text>
                        </View>
                        <View
                            style={[
                                styles.ratingBox,
                                { backgroundColor: '#B91C1C' },
                            ]}
                        >
                            <Text style={styles.ratingNum}>
                                ★ {item.rating}
                            </Text>
                        </View>
                    </View>
                    <Text
                        style={[styles.featDesc, { color: theme.textMuted }]}
                        numberOfLines={2}
                    >
                        {item.description}
                    </Text>
                    <View style={styles.featMeta}>
                        <Text
                            style={[
                                styles.metaPill,
                                {
                                    color: theme.text,
                                    borderColor: theme.border,
                                },
                            ]}
                        >
                            ⊙ {item.time}
                        </Text>
                        <Text
                            style={[
                                styles.metaPill,
                                {
                                    color: theme.text,
                                    borderColor: theme.border,
                                },
                            ]}
                        >
                            From ${item.price}
                        </Text>
                    </View>
                </View>
            </Pressable>
        );
    }

    return (
        <Pressable
            style={({ pressed }) => [
                styles.card,
                {
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                    opacity: pressed ? 0.92 : 1,
                },
            ]}
            onPress={onPress}
        >
            <Image
                source={{ uri: item.image }}
                style={styles.cardImage}
                resizeMode="cover"
            />
            <View style={styles.cardBody}>
                <View style={styles.cardTopRow}>
                    <Text style={[styles.cardName, { color: theme.text }]}>
                        {item.name}
                    </Text>
                    <View
                        style={[
                            styles.smallTag,
                            { backgroundColor: item.tagColor + '20' },
                        ]}
                    >
                        <Text
                            style={[
                                styles.smallTagText,
                                { color: item.tagColor },
                            ]}
                        >
                            {item.tag}
                        </Text>
                    </View>
                </View>
                <Text style={[styles.cardCuisine, { color: theme.textSub }]}>
                    {item.cuisine}
                </Text>
                <View style={styles.cardBottom}>
                    <Text style={[styles.cardMeta, { color: theme.textMuted }]}>
                        {item.time}
                    </Text>
                    <View
                        style={[
                            styles.ratingSmall,
                            { backgroundColor: '#B91C1C' },
                        ]}
                    >
                        <Text style={styles.ratingSmallText}>
                            ★ {item.rating}
                        </Text>
                    </View>
                </View>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    featCard: {
        marginHorizontal: 20,
        marginBottom: 20,
        borderRadius: 0,
        borderWidth: 1,
        overflow: 'hidden',
    },
    featImage: { width: '100%', height: 200 },
    featOverlay: { position: 'absolute', top: 14, left: 14 },
    tag: { paddingHorizontal: 10, paddingVertical: 4 },
    tagText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 1.5,
    },
    featBody: { padding: 16, borderTopWidth: 1 },
    featTop: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    featName: {
        fontSize: 22,
        fontWeight: '900',
        letterSpacing: -0.8,
        lineHeight: 26,
    },
    featCuisine: {
        fontSize: 12,
        fontWeight: '600',
        letterSpacing: 1.2,
        textTransform: 'uppercase',
        marginTop: 2,
    },
    ratingBox: { paddingHorizontal: 10, paddingVertical: 6, marginLeft: 12 },
    ratingNum: { color: '#fff', fontSize: 13, fontWeight: '900' },
    featDesc: { fontSize: 13, lineHeight: 19, marginBottom: 14 },
    featMeta: { flexDirection: 'row', gap: 10 },
    metaPill: {
        fontSize: 12,
        fontWeight: '700',
        borderWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    card: {
        flexDirection: 'row',
        marginHorizontal: 20,
        marginBottom: 2,
        borderWidth: 1,
        borderRadius: 0,
        overflow: 'hidden',
    },
    cardImage: { width: 90, height: 90 },
    cardBody: { flex: 1, padding: 12, justifyContent: 'space-between' },
    cardTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    cardName: { fontSize: 15, fontWeight: '900', letterSpacing: -0.3, flex: 1 },
    smallTag: { paddingHorizontal: 6, paddingVertical: 2 },
    smallTagText: { fontSize: 9, fontWeight: '900', letterSpacing: 1 },
    cardCuisine: {
        fontSize: 11,
        fontWeight: '600',
        letterSpacing: 1,
        textTransform: 'uppercase',
        marginTop: 2,
    },
    cardBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardMeta: { fontSize: 12 },
    ratingSmall: { paddingHorizontal: 6, paddingVertical: 2 },
    ratingSmallText: { color: '#fff', fontSize: 11, fontWeight: '900' },
});
