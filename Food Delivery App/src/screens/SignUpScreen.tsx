import { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Pressable,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const appIcon = require('../../assets/icon.png');

export default function SignUpScreen({ navigation }: { navigation: any }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const { theme } = useTheme();

    function handleSignUp() {
        login(name || email.split('@')[0] || 'Guest User');
    }

    function handleGuest() {
        login('Guest');
    }

    const fields = [
        {
            label: 'FULL NAME',
            val: name,
            set: setName,
            placeholder: 'Rahul Sharma',
            secure: false,
            keyboard: 'default' as const,
            icon: 'person-outline',
        },
        {
            label: 'EMAIL',
            val: email,
            set: setEmail,
            placeholder: 'you@example.com',
            secure: false,
            keyboard: 'email-address' as const,
            icon: 'mail-outline',
        },
        {
            label: 'PASSWORD',
            val: password,
            set: setPassword,
            placeholder: '••••••••',
            secure: true,
            keyboard: 'default' as const,
            icon: 'lock-closed-outline',
        },
    ];

    return (
        <SafeAreaView
            style={[styles.container, { backgroundColor: theme.bg }]}
            edges={['top', 'bottom']}
        >
            <StatusBar
                barStyle={theme.isDark ? 'light-content' : 'dark-content'}
                backgroundColor={theme.bg}
            />
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    contentContainerStyle={styles.scroll}
                    keyboardShouldPersistTaps="handled"
                >
                    <Image
                        source={appIcon}
                        style={styles.logoImg}
                        resizeMode="contain"
                    />
                    <Pressable
                        style={styles.backBtn}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons
                            name="arrow-back"
                            size={20}
                            color={theme.text}
                        />
                    </Pressable>

                    <Text style={[styles.title, { color: theme.text }]}>
                        Create Account
                    </Text>
                    <Text style={[styles.subtitle, { color: theme.textSub }]}>
                        Join thousands of food lovers on Fooodu.
                    </Text>

                    <View
                        style={[
                            styles.card,
                            {
                                backgroundColor: theme.card,
                                borderColor: theme.border,
                            },
                        ]}
                    >
                        {fields.map((f, idx) => (
                            <View key={f.label}>
                                <Text
                                    style={[
                                        styles.label,
                                        { color: theme.textMuted },
                                    ]}
                                >
                                    {f.label}
                                </Text>
                                <View
                                    style={[
                                        styles.inputWrap,
                                        {
                                            backgroundColor: theme.inputBg,
                                            borderColor: theme.inputBorder,
                                        },
                                        idx === fields.length - 1 && {
                                            marginBottom: 0,
                                        },
                                    ]}
                                >
                                    <Ionicons
                                        name={f.icon as any}
                                        size={18}
                                        color={theme.textMuted}
                                        style={{ marginRight: 10 }}
                                    />
                                    <TextInput
                                        placeholder={f.placeholder}
                                        placeholderTextColor={theme.textMuted}
                                        secureTextEntry={f.secure}
                                        keyboardType={f.keyboard}
                                        autoCapitalize="none"
                                        value={f.val}
                                        onChangeText={f.set}
                                        style={[
                                            styles.input,
                                            { color: theme.text },
                                        ]}
                                    />
                                </View>
                            </View>
                        ))}
                    </View>

                    <Pressable
                        style={({ pressed }) => [
                            styles.btn,
                            { opacity: pressed ? 0.85 : 1 },
                        ]}
                        onPress={handleSignUp}
                    >
                        <Text style={styles.btnText}>Create Account</Text>
                        <Ionicons name="arrow-forward" size={18} color="#fff" />
                    </Pressable>

                    <View style={[styles.dividerRow, { marginVertical: 24 }]}>
                        <View
                            style={[
                                styles.divLine,
                                { backgroundColor: theme.border },
                            ]}
                        />
                        <Text
                            style={[styles.divText, { color: theme.textMuted }]}
                        >
                            OR SIGN UP WITH
                        </Text>
                        <View
                            style={[
                                styles.divLine,
                                { backgroundColor: theme.border },
                            ]}
                        />
                    </View>

                    <View style={styles.socialRow}>
                        <Pressable
                            style={[
                                styles.socialBtn,
                                {
                                    backgroundColor: theme.card,
                                    borderColor: theme.border,
                                },
                            ]}
                        >
                            <Ionicons
                                name="logo-google"
                                size={18}
                                color={theme.text}
                            />
                            <Text
                                style={[
                                    styles.socialLabel,
                                    { color: theme.text },
                                ]}
                            >
                                GOOGLE
                            </Text>
                        </Pressable>
                        <Pressable
                            style={[
                                styles.socialBtn,
                                {
                                    backgroundColor: theme.card,
                                    borderColor: theme.border,
                                },
                            ]}
                        >
                            <Ionicons
                                name="logo-apple"
                                size={18}
                                color={theme.text}
                            />
                            <Text
                                style={[
                                    styles.socialLabel,
                                    { color: theme.text },
                                ]}
                            >
                                APPLE
                            </Text>
                        </Pressable>
                    </View>

                    <View style={styles.footer}>
                        <Text
                            style={[
                                styles.footerText,
                                { color: theme.textSub },
                            ]}
                        >
                            Already have an account?{' '}
                        </Text>
                        <Pressable
                            onPress={() => navigation.navigate('Signin')}
                        >
                            <Text style={styles.loginLink}>Log In</Text>
                        </Pressable>
                    </View>

                    <Pressable
                        style={({ pressed }) => [
                            styles.guestBtn,
                            { opacity: pressed ? 0.7 : 1 },
                        ]}
                        onPress={handleGuest}
                    >
                        <Ionicons
                            name="person-outline"
                            size={16}
                            color={theme.textMuted}
                        />
                        <Text
                            style={[
                                styles.guestText,
                                { color: theme.textMuted },
                            ]}
                        >
                            Continue as Guest
                        </Text>
                    </Pressable>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scroll: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 40 },
    logoImg: { width: 56, height: 56, borderRadius: 12, marginBottom: 16 },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 30,
        fontWeight: '800',
        marginBottom: 6,
        letterSpacing: -0.5,
    },
    subtitle: { fontSize: 14, lineHeight: 21, marginBottom: 28 },
    card: {
        borderRadius: 20,
        borderWidth: 1,
        padding: 20,
        marginBottom: 16,
        gap: 16,
    },
    label: {
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 1.2,
        marginBottom: 8,
    },
    inputWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 14,
    },
    input: { flex: 1, paddingVertical: 14, fontSize: 15 },
    btn: {
        backgroundColor: '#B91C1C',
        borderRadius: 16,
        paddingVertical: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    btnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
    dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    divLine: { flex: 1, height: 1 },
    divText: { fontSize: 11, fontWeight: '600', letterSpacing: 0.5 },
    socialRow: { flexDirection: 'row', gap: 12, marginBottom: 32 },
    socialBtn: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 14,
        paddingVertical: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    socialLabel: { fontSize: 12, fontWeight: '700', letterSpacing: 0.5 },
    footer: { flexDirection: 'row', justifyContent: 'center' },
    footerText: { fontSize: 14 },
    loginLink: { fontSize: 14, color: '#B91C1C', fontWeight: '700' },
    guestBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        marginTop: 20,
        paddingVertical: 8,
    },
    guestText: { fontSize: 14 },
});
