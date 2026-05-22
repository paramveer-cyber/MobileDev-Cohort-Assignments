import { View, Text, StyleSheet, Switch, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function SettingsScreen() {
    const [notifications, setNotifications] = useState(true);
    const [location, setLocation] = useState(false);
    const [promos, setPromos] = useState(true);
    const { theme, toggleTheme } = useTheme();

    const rows = [
        {
            label: 'Push Notifications',
            val: notifications,
            set: setNotifications,
        },
        { label: 'Dark Mode', val: theme.isDark, set: toggleTheme },
        { label: 'Share Location', val: location, set: setLocation },
        { label: 'Promotional Emails', val: promos, set: setPromos },
    ];

    return (
        <View style={[styles.root, { backgroundColor: theme.bg }]}>
            <StatusBar
                barStyle={theme.isDark ? 'light-content' : 'dark-content'}
                backgroundColor={theme.bg}
            />
            <View style={[styles.container, { backgroundColor: theme.bg }]}>
                <View
                    style={[
                        styles.section,
                        {
                            backgroundColor: theme.card,
                            borderColor: theme.border,
                        },
                    ]}
                >
                    {rows.map((r, i) => (
                        <View
                            key={r.label}
                            style={[
                                styles.row,
                                { borderBottomColor: theme.border },
                                i < rows.length - 1 && styles.rowBorder,
                            ]}
                        >
                            <Text style={[styles.label, { color: theme.text }]}>
                                {r.label}
                            </Text>
                            <Switch
                                value={r.val}
                                onValueChange={r.set}
                                trackColor={{
                                    false: theme.inputBg,
                                    true: theme.accent,
                                }}
                                thumbColor="#fff"
                            />
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1 },
    container: { flex: 1, padding: 20 },
    section: { borderRadius: 20, borderWidth: 1, overflow: 'hidden' },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 18,
        paddingVertical: 16,
    },
    rowBorder: { borderBottomWidth: 1 },
    label: { fontSize: 16, fontWeight: '500' },
});
