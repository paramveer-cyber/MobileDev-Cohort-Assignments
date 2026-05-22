import { View, Text, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { FAQS } from '../sample/data';
import { useTheme } from '../context/ThemeContext';

export default function HelpScreen() {
    const { theme } = useTheme();

    return (
        <View style={[styles.root, { backgroundColor: theme.bg }]}>
            <StatusBar
                barStyle={theme.isDark ? 'light-content' : 'dark-content'}
                backgroundColor={theme.bg}
            />
            <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
                {FAQS.map((faq, i) => (
                    <View
                        key={i}
                        style={[
                            styles.card,
                            {
                                backgroundColor: theme.card,
                                borderColor: theme.border,
                            },
                        ]}
                    >
                        <View
                            style={[
                                styles.qIcon,
                                { backgroundColor: '#B91C1C18' },
                            ]}
                        >
                            <Ionicons
                                name="help-circle-outline"
                                size={22}
                                color="#B91C1C"
                            />
                        </View>
                        <View style={styles.content}>
                            <Text style={[styles.q, { color: theme.text }]}>
                                {faq.q}
                            </Text>
                            <Text style={[styles.a, { color: theme.textSub }]}>
                                {faq.a}
                            </Text>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1 },
    card: {
        flexDirection: 'row',
        marginHorizontal: 20,
        marginTop: 12,
        borderRadius: 18,
        padding: 16,
        borderWidth: 1,
        gap: 14,
    },
    qIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        flexShrink: 0,
    },
    content: { flex: 1 },
    q: {
        fontSize: 15,
        fontWeight: '700',
        marginBottom: 6,
        letterSpacing: -0.2,
    },
    a: { fontSize: 13, lineHeight: 20 },
});
