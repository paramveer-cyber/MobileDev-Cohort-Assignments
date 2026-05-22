import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { useTheme } from '../context/ThemeContext';

type MenuItem = {
    id: string;
    name: string;
    desc: string;
    price: number;
    image: string;
    tag?: string;
};
type Props = { item: MenuItem; qty: number; onAdd: () => void };

export function MenuItemCard({ item, qty, onAdd }: Props) {
    const { theme } = useTheme();
    return (
        <View style={[styles.row, { borderBottomColor: theme.border }]}>
            <View style={styles.info}>
                <View style={styles.nameRow}>
                    <Text style={[styles.name, { color: theme.text }]}>
                        {item.name}
                    </Text>
                    <Text style={[styles.price, { color: '#B91C1C' }]}>
                        ₹{item.price}
                    </Text>
                </View>
                {item.tag && (
                    <View style={styles.tag}>
                        <Text style={styles.tagText}>{item.tag}</Text>
                    </View>
                )}
                <Text
                    style={[styles.desc, { color: theme.textSub }]}
                    numberOfLines={2}
                >
                    {item.desc}
                </Text>
                <View style={styles.actions}>
                    <Pressable style={styles.addBtn} onPress={onAdd}>
                        <Ionicons name="add" size={14} color="#fff" />
                        <Text style={styles.addBtnText}>ADD TO ORDER</Text>
                    </Pressable>
                    {qty > 0 && (
                        <View
                            style={[
                                styles.qtyBadge,
                                { borderColor: theme.border },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.qtyBadgeText,
                                    { color: theme.text },
                                ]}
                            >
                                − {qty}
                            </Text>
                        </View>
                    )}
                </View>
            </View>
            <Image
                source={{ uri: item.image }}
                style={[styles.image, { borderColor: theme.border }]}
                resizeMode="cover"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
        gap: 12,
    },
    info: { flex: 1 },
    nameRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 4,
    },
    name: { fontSize: 16, fontWeight: '700', flex: 1, paddingRight: 8 },
    price: { fontSize: 15, fontWeight: '800' },
    tag: {
        backgroundColor: '#FFF5F5',
        borderWidth: 1,
        borderColor: '#B91C1C',
        alignSelf: 'flex-start',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        marginBottom: 6,
    },
    tagText: {
        color: '#B91C1C',
        fontSize: 9,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    desc: { fontSize: 12, lineHeight: 18, marginBottom: 10 },
    actions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    addBtn: {
        backgroundColor: '#B91C1C',
        paddingHorizontal: 10,
        paddingVertical: 7,
        borderRadius: 6,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    addBtnText: { color: '#fff', fontSize: 11, fontWeight: '700' },
    qtyBadge: {
        borderWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 6,
    },
    qtyBadgeText: { fontSize: 11, fontWeight: '700' },
    image: { width: 90, height: 90, borderRadius: 10, borderWidth: 1 },
});
