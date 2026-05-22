import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { useTheme } from '../context/ThemeContext';

type Order = {
    id: string;
    restaurant: string;
    items: string;
    total: number;
    date: string;
    image: string;
};
type Props = { order: Order; onReorder?: () => void };

export function OrderHistoryCard({ order, onReorder }: Props) {
    const { theme } = useTheme();
    return (
        <View style={[styles.card, { borderBottomColor: theme.border }]}>
            <View style={styles.top}>
                <Image
                    source={{ uri: order.image }}
                    style={styles.img}
                    resizeMode="cover"
                />
                <View style={styles.body}>
                    <Text style={[styles.date, { color: theme.textMuted }]}>
                        {order.date}
                    </Text>
                    <Text style={[styles.name, { color: theme.text }]}>
                        {order.restaurant}
                    </Text>
                    <Text style={[styles.items, { color: theme.textSub }]}>
                        {order.items}
                    </Text>
                </View>
            </View>
            <View style={styles.bottom}>
                <Text style={styles.total}>₹{order.total}</Text>
                {onReorder && (
                    <Pressable
                        style={[
                            styles.reorderBtn,
                            { borderColor: theme.border },
                        ]}
                        onPress={onReorder}
                    >
                        <Text
                            style={[styles.reorderText, { color: theme.text }]}
                        >
                            REORDER
                        </Text>
                    </Pressable>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: { paddingHorizontal: 16, paddingVertical: 16, borderBottomWidth: 1 },
    top: { flexDirection: 'row', gap: 12, marginBottom: 10 },
    img: { width: 56, height: 56, borderRadius: 8 },
    body: { flex: 1 },
    date: { fontSize: 12, marginBottom: 4 },
    name: { fontSize: 15, fontWeight: '700', marginBottom: 4 },
    items: { fontSize: 13, lineHeight: 18 },
    bottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    total: { fontSize: 16, fontWeight: '800', color: '#B91C1C' },
    reorderBtn: {
        borderWidth: 1.5,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 6,
    },
    reorderText: { fontSize: 12, fontWeight: '700' },
});
