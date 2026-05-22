import {
    View,
    Text,
    StyleSheet,
    Pressable,
    Image,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');
const CELL = (width - 48 - 12) / 2;

type Item = { id: string; name: string; price: number; image: string };
type Props = { item: Item; onAdd: () => void };

export function PopularItemCard({ item, onAdd }: Props) {
    const { theme } = useTheme();
    return (
        <View
            style={[
                styles.card,
                {
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                    width: CELL,
                },
            ]}
        >
            <View style={styles.imgWrap}>
                <Image
                    source={{ uri: item.image }}
                    style={styles.img}
                    resizeMode="cover"
                />
                <Pressable style={styles.addBtn} onPress={onAdd}>
                    <Ionicons name="add" size={18} color="#fff" />
                </Pressable>
            </View>
            <Text
                style={[styles.name, { color: theme.text }]}
                numberOfLines={2}
            >
                {item.name}
            </Text>
            <Text style={styles.price}>₹{item.price}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: { borderRadius: 12, borderWidth: 1, overflow: 'hidden' },
    imgWrap: { position: 'relative' },
    img: { width: '100%', height: 110 },
    addBtn: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        backgroundColor: '#B91C1C',
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    name: {
        fontSize: 13,
        fontWeight: '600',
        paddingHorizontal: 10,
        paddingTop: 8,
        lineHeight: 18,
    },
    price: {
        color: '#B91C1C',
        fontSize: 14,
        fontWeight: '800',
        paddingHorizontal: 10,
        paddingBottom: 10,
        paddingTop: 4,
    },
});
