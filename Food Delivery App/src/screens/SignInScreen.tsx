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

export default function SignInScreen({ navigation }: { navigation: any }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const { login } = useAuth();
    const { theme } = useTheme();

    function handleLogin() {
        const name = email.split('@')[0] || 'Guest User';
        login(name);
    }

    function handleGuest() {
        login('Guest');
    }

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
                    <View style={styles.logoRow}>
                        <Image
                            source={appIcon}
                            style={styles.logoImg}
                            resizeMode="contain"
                        />
                    </View>

                    <Text style={[styles.title, { color: theme.text }]}>
                        Welcome Back
                    </Text>
                    <Text style={[styles.subtitle, { color: theme.textSub }]}>
                        Please enter your details to continue.
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
                        <Text
                            style={[styles.label, { color: theme.textMuted }]}
                        >
                            EMAIL ADDRESS
                        </Text>
                        <TextInput
                            style={[
                                styles.input,
                                {
                                    backgroundColor: theme.inputBg,
                                    color: theme.text,
                                    borderColor: theme.inputBorder,
                                },
                            ]}
                            placeholder="name@example.com"
                            placeholderTextColor={theme.textMuted}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={email}
                            onChangeText={setEmail}
                        />

                        <View style={styles.passRow}>
                            <Text
                                style={[
                                    styles.label,
                                    { color: theme.textMuted },
                                ]}
                            >
                                PASSWORD
                            </Text>
                            <Text style={styles.forgot}>Forgot?</Text>
                        </View>
                        <View
                            style={[
                                styles.passWrap,
                                {
                                    backgroundColor: theme.inputBg,
                                    borderColor: theme.inputBorder,
                                },
                            ]}
                        >
                            <TextInput
                                style={[
                                    styles.passInput,
                                    { color: theme.text },
                                ]}
                                placeholder="••••••••"
                                placeholderTextColor={theme.textMuted}
                                secureTextEntry={!showPass}
                                value={password}
                                onChangeText={setPassword}
                            />
                            <Pressable
                                onPress={() => setShowPass((p) => !p)}
                                style={styles.eyeBtn}
                            >
                                <Ionicons
                                    name={
                                        showPass
                                            ? 'eye-off-outline'
                                            : 'eye-outline'
                                    }
                                    size={20}
                                    color={theme.textMuted}
                                />
                            </Pressable>
                        </View>

                        <Pressable
                            style={({ pressed }) => [
                                styles.signInBtn,
                                { opacity: pressed ? 0.85 : 1 },
                            ]}
                            onPress={handleLogin}
                        >
                            <Text style={styles.signInText}>Sign In</Text>
                            <Ionicons
                                name="arrow-forward"
                                size={18}
                                color="#fff"
                            />
                        </Pressable>
                    </View>

                    <View style={[styles.orRow, { marginVertical: 20 }]}>
                        <View
                            style={[
                                styles.orLine,
                                { backgroundColor: theme.border },
                            ]}
                        />
                        <Text
                            style={[styles.orText, { color: theme.textMuted }]}
                        >
                            OR CONTINUE WITH
                        </Text>
                        <View
                            style={[
                                styles.orLine,
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
                            Don't have an account?{' '}
                        </Text>
                        <Pressable
                            onPress={() => navigation.navigate('Signup')}
                        >
                            <Text style={styles.createLink}>
                                Create Account
                            </Text>
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
    scroll: { paddingHorizontal: 24, paddingTop: 32, paddingBottom: 40 },
    logoRow: {
        marginBottom: 112,
        marginTop: -12,
    },
    logoImg: {
        width: 128,
        height: 128,
        borderRadius: 12,
        position: 'absolute',
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        marginBottom: 6,
        letterSpacing: -0.5,
    },
    subtitle: { fontSize: 14, lineHeight: 21, marginBottom: 28 },
    card: { borderRadius: 20, borderWidth: 1, padding: 20, marginBottom: 4 },
    label: {
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 1.2,
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 14,
        fontSize: 15,
        marginBottom: 18,
    },
    passRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    forgot: {
        color: '#B91C1C',
        fontSize: 12,
        fontWeight: '700',
        marginBottom: 8,
    },
    passWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 14,
        marginBottom: 22,
    },
    passInput: { flex: 1, paddingVertical: 14, fontSize: 15 },
    eyeBtn: { paddingLeft: 8, paddingVertical: 14 },
    signInBtn: {
        backgroundColor: '#B91C1C',
        borderRadius: 14,
        paddingVertical: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    signInText: { color: '#fff', fontSize: 15, fontWeight: '700' },
    orRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    orLine: { flex: 1, height: 1 },
    orText: { fontSize: 11, fontWeight: '600', letterSpacing: 0.5 },
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
    createLink: { fontSize: 14, color: '#B91C1C', fontWeight: '700' },
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
