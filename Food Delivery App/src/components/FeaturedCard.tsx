import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { useTheme } from '../context/ThemeContext';

type Restaurant = {
    id: string;
    name: string;
    cuisine: string;
    rating: number;
    ratingCount: string;
    price: string;
    time: string;
    tag: string;
    tagColor: string;
    image: string;
    description: string;
    featured: boolean;
    freeDelivery: boolean;
    freeDeliveryMin: number;
    openUntil: string;
    distance: string;
};

type Props = { item: Restaurant; onPress: () => void; index: number };

export function FeaturedCard({ item, onPress, index }: Props) {
    const { theme } = useTheme();
    const isLarge = index === 0;

    if (isLarge) {
        return (
            <Pressable
                style={[
                    styles.largeCard,
                    { marginHorizontal: 16, borderColor: theme.border },
                ]}
                onPress={onPress}
            >
                <View style={styles.largeImageWrap}>
                    <Image
                        source={{ uri: item.image }}
                        style={styles.largeImage}
                        resizeMode="cover"
                    />
                    <View style={styles.largeOverlay} />
                    <View style={styles.largeBadgeWrap}>
                        <View
                            style={[
                                styles.badge,
                                { backgroundColor: item.tagColor },
                            ]}
                        >
                            <Text style={styles.badgeText}>{item.tag}</Text>
                        </View>
                    </View>
                    <View style={styles.largeInfoOverlay}>
                        <Text style={styles.largeName}>{item.name}</Text>
                        <Text style={styles.largeMeta}>
                            {item.cuisine} • {item.time} • {item.rating} ★
                        </Text>
                    </View>
                </View>
            </Pressable>
        );
    }

    return (
        <Pressable
            style={[styles.medCard, { borderBottomColor: theme.border }]}
            onPress={onPress}
        >
            <Image
                source={{ uri: item.image }}
                style={styles.medImage}
                resizeMode="cover"
            />
            <View style={[styles.medOverlay]} />
            <View style={styles.medInfo}>
                <Text style={styles.medName}>{item.name}</Text>
                <View style={styles.medMeta}>
                    <Text style={styles.medSub}>
                        {item.cuisine} • {item.time}
                    </Text>
                    <View style={styles.medRating}>
                        <Ionicons name="star" size={11} color="#fff" />
                        <Text style={styles.medRatingText}>
                            {item.rating} ({item.ratingCount})
                        </Text>
                    </View>
                </View>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    largeCard: {
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 2,
        borderWidth: 1,
    },
    largeImageWrap: { height: 220, position: 'relative' },
    largeImage: { width: '100%', height: 220 },
    largeOverlay: {
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.45)',
    },
    largeBadgeWrap: { position: 'absolute', top: 14, left: 14 },
    badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
    badgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 1,
    },
    largeInfoOverlay: { position: 'absolute', bottom: 16, left: 16, right: 16 },
    largeName: {
        color: '#fff',
        fontSize: 24,
        fontWeight: '800',
        marginBottom: 4,
    },
    largeMeta: { color: 'rgba(255,255,255,0.8)', fontSize: 13 },
    medCard: {
        height: 160,
        marginHorizontal: 16,
        marginBottom: 2,
        borderRadius: 12,
        overflow: 'hidden',
        borderBottomWidth: 0,
        position: 'relative',
        marginTop: 8,
    },
    medImage: { width: '100%', height: 160 },
    medOverlay: {
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    medInfo: { position: 'absolute', bottom: 14, left: 14, right: 14 },
    medName: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '800',
        marginBottom: 4,
    },
    medMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    medSub: { color: 'rgba(255,255,255,0.85)', fontSize: 12 },
    medRating: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#B91C1C',
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 4,
    },
    medRatingText: { color: '#fff', fontSize: 11, fontWeight: '700' },
});
