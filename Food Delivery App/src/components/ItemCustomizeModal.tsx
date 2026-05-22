import {
    View,
    Text,
    StyleSheet,
    Pressable,
    Image,
    Modal,
    ScrollView,
} from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { ITEM_CUSTOMIZE_OPTIONS } from '../sample/data';

type Item = {
    id: string;
    name: string;
    desc: string;
    price: number;
    image: string;
};
type Props = { item: Item; onClose: () => void; onAdd: (qty: number) => void };

export function ItemCustomizeModal({ item, onClose, onAdd }: Props) {
    const [qty, setQty] = useState(1);
    const [selectedSize, setSelectedSize] = useState('Regular');
    const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

    function toggleAddon(a: string) {
        setSelectedAddons((prev) =>
            prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
        );
    }

    const total = item.price * qty;

    return (
        <Modal
            visible
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <Pressable style={styles.backdrop} onPress={onClose} />
                <View style={styles.sheet}>
                    <View style={styles.sheetHeader}>
                        <Text style={styles.sheetTitle}>Customize Order</Text>
                        <Pressable onPress={onClose} style={styles.closeBtn}>
                            <Ionicons name="close" size={22} color="#777" />
                        </Pressable>
                    </View>
                    <View style={styles.redLine} />
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Image
                            source={{ uri: item.image }}
                            style={styles.itemImage}
                            resizeMode="cover"
                        />
                        <View style={styles.itemInfo}>
                            <Text style={styles.itemName}>{item.name}</Text>
                            <Text style={styles.itemDesc}>{item.desc}</Text>
                            <Text style={styles.itemPrice}>₹{item.price}</Text>
                        </View>

                        <Text style={styles.sectionLabel}>Select Size</Text>
                        <View style={styles.sizeRow}>
                            {ITEM_CUSTOMIZE_OPTIONS.sizes.map((s) => (
                                <Pressable
                                    key={s}
                                    style={[
                                        styles.sizeBtn,
                                        selectedSize === s &&
                                            styles.sizeBtnActive,
                                    ]}
                                    onPress={() => setSelectedSize(s)}
                                >
                                    <Text
                                        style={[
                                            styles.sizeBtnText,
                                            selectedSize === s &&
                                                styles.sizeBtnTextActive,
                                        ]}
                                    >
                                        {s}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>

                        <Text style={styles.sectionLabel}>Add-ons</Text>
                        <View style={styles.addonList}>
                            {ITEM_CUSTOMIZE_OPTIONS.addons.map((a) => (
                                <Pressable
                                    key={a}
                                    style={styles.addonRow}
                                    onPress={() => toggleAddon(a)}
                                >
                                    <View
                                        style={[
                                            styles.checkbox,
                                            selectedAddons.includes(a) &&
                                                styles.checkboxActive,
                                        ]}
                                    >
                                        {selectedAddons.includes(a) && (
                                            <Ionicons
                                                name="checkmark"
                                                size={13}
                                                color="#fff"
                                            />
                                        )}
                                    </View>
                                    <Text style={styles.addonText}>{a}</Text>
                                </Pressable>
                            ))}
                        </View>
                        <View style={{ height: 20 }} />
                    </ScrollView>

                    <View style={styles.footer}>
                        <View style={styles.qtyControl}>
                            <Pressable
                                style={styles.qtyBtn}
                                onPress={() =>
                                    setQty((q) => Math.max(1, q - 1))
                                }
                            >
                                <Text style={styles.qtyBtnText}>−</Text>
                            </Pressable>
                            <Text style={styles.qtyNum}>{qty}</Text>
                            <Pressable
                                style={styles.qtyBtn}
                                onPress={() => setQty((q) => q + 1)}
                            >
                                <Text style={styles.qtyBtnText}>+</Text>
                            </Pressable>
                        </View>
                        <Pressable
                            style={styles.addBtn}
                            onPress={() => onAdd(qty)}
                        >
                            <Text style={styles.addBtnText}>
                                Add to Order • ₹{total}
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: { flex: 1, justifyContent: 'flex-end' },
    backdrop: {
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    sheet: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '90%',
    },
    sheetHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 18,
    },
    sheetTitle: { fontSize: 20, fontWeight: '700', color: '#1A1A1A' },
    closeBtn: { padding: 4 },
    redLine: { height: 1, backgroundColor: '#FFE0E0' },
    itemImage: { width: '100%', height: 260 },
    itemInfo: { padding: 20 },
    itemName: {
        fontSize: 28,
        fontWeight: '800',
        color: '#1A1A1A',
        marginBottom: 8,
    },
    itemDesc: { fontSize: 15, color: '#777', lineHeight: 22, marginBottom: 12 },
    itemPrice: { fontSize: 20, fontWeight: '800', color: '#B91C1C' },
    sectionLabel: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1A1A1A',
        paddingHorizontal: 20,
        marginBottom: 12,
        marginTop: 4,
    },
    sizeRow: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        gap: 10,
        marginBottom: 20,
    },
    sizeBtn: {
        flex: 1,
        borderWidth: 1.5,
        borderColor: '#DDD',
        borderRadius: 8,
        paddingVertical: 10,
        alignItems: 'center',
    },
    sizeBtnActive: { borderColor: '#B91C1C', backgroundColor: '#FFF5F5' },
    sizeBtnText: { fontSize: 13, fontWeight: '600', color: '#555' },
    sizeBtnTextActive: { color: '#B91C1C', fontWeight: '700' },
    addonList: { paddingHorizontal: 20, gap: 12 },
    addonRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    checkbox: {
        width: 22,
        height: 22,
        borderWidth: 1.5,
        borderColor: '#DDD',
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxActive: { backgroundColor: '#B91C1C', borderColor: '#B91C1C' },
    addonText: { fontSize: 14, color: '#333', fontWeight: '500' },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    qtyControl: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#E0E0E0',
        borderRadius: 50,
        overflow: 'hidden',
    },
    qtyBtn: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    qtyBtnText: { fontSize: 22, fontWeight: '400', color: '#333' },
    qtyNum: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1A1A1A',
        minWidth: 28,
        textAlign: 'center',
    },
    addBtn: {
        flex: 1,
        backgroundColor: '#B91C1C',
        borderRadius: 10,
        paddingVertical: 14,
        alignItems: 'center',
    },
    addBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
