import { useRef, useEffect } from 'react';
import {
    View,
    StyleSheet,
    Pressable,
    Image,
    Dimensions,
    StatusBar,
    Text,
    Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { ONBOARDING_HERO_IMAGE } from '../sample/data';

const { width, height } = Dimensions.get('window');
const appIcon = require('../../assets/icon.png');

export default function OnboardingScreen({ navigation }: { navigation: any }) {
    const headingY = useRef(new Animated.Value(40)).current;
    const headingOpacity = useRef(new Animated.Value(0)).current;
    const subY = useRef(new Animated.Value(30)).current;
    const subOpacity = useRef(new Animated.Value(0)).current;
    const badgeOpacity = useRef(new Animated.Value(0)).current;
    const btnScale = useRef(new Animated.Value(0.8)).current;
    const btnOpacity = useRef(new Animated.Value(0)).current;
    const logoOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.stagger(80, [
            Animated.timing(logoOpacity, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
            }),
            Animated.parallel([
                Animated.timing(headingOpacity, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.spring(headingY, {
                    toValue: 0,
                    useNativeDriver: true,
                    damping: 18,
                }),
            ]),
            Animated.parallel([
                Animated.timing(subOpacity, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.spring(subY, {
                    toValue: 0,
                    useNativeDriver: true,
                    damping: 18,
                }),
            ]),
            Animated.timing(badgeOpacity, {
                toValue: 1,
                duration: 350,
                useNativeDriver: true,
            }),
            Animated.parallel([
                Animated.timing(btnOpacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.spring(btnScale, {
                    toValue: 1,
                    useNativeDriver: true,
                    damping: 14,
                }),
            ]),
        ]).start();
    }, []);

    return (
        <View style={styles.wrap}>
            <StatusBar
                barStyle="light-content"
                backgroundColor="transparent"
                translucent
            />
            <Image
                source={{ uri: ONBOARDING_HERO_IMAGE }}
                style={styles.bg}
                resizeMode="cover"
            />
            <View style={styles.gradientTop} />
            <View style={styles.gradientBottom} />

            <SafeAreaView style={styles.flex} edges={['top', 'bottom']}>
                <View style={styles.top}>
                    <Animated.View
                        style={[styles.logoRow, { opacity: logoOpacity }]}
                    >
                        <View style={styles.logoIconBox}>
                            <Image
                                source={appIcon}
                                style={styles.logoIconImg}
                                resizeMode="contain"
                            />
                        </View>
                    </Animated.View>
                </View>

                <View style={styles.bottom}>
                    <Animated.Text
                        style={[
                            styles.heading,
                            {
                                opacity: headingOpacity,
                                transform: [{ translateY: headingY }],
                            },
                        ]}
                    >
                        Food,{'\n'}delivered{'\n'}fast.
                    </Animated.Text>

                    <Animated.Text
                        style={[
                            styles.sub,
                            {
                                opacity: subOpacity,
                                transform: [{ translateY: subY }],
                            },
                        ]}
                    >
                        Sample data & placeholder images — this is a portfolio
                        project, not a real app.
                    </Animated.Text>

                    <Animated.View
                        style={[
                            styles.actions,
                            {
                                opacity: btnOpacity,
                                transform: [{ scale: btnScale }],
                            },
                        ]}
                    >
                        <Pressable
                            style={({ pressed }) => [
                                styles.primaryBtn,
                                { opacity: pressed ? 0.88 : 1 },
                            ]}
                            onPress={() => navigation.replace('Signin')}
                        >
                            <Text style={styles.primaryText}>Get Started</Text>
                            <Ionicons
                                name="arrow-forward"
                                size={18}
                                color="#fff"
                            />
                        </Pressable>
                        <Pressable
                            style={({ pressed }) => [
                                styles.ghostBtn,
                                { opacity: pressed ? 0.7 : 1 },
                            ]}
                            onPress={() => navigation.replace('Signin')}
                        >
                            <Text style={styles.ghostText}>
                                I have an account
                            </Text>
                        </Pressable>
                    </Animated.View>
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1 },
    wrap: { flex: 1, backgroundColor: '#0D0D0D' },
    bg: { position: 'absolute', width, height, opacity: 0.75 },
    gradientTop: {
        position: 'absolute',
        top: 0,
        width,
        height: 220,
        backgroundColor: 'rgba(13,13,13,0.72)',
    },
    gradientBottom: {
        position: 'absolute',
        bottom: 0,
        width,
        height: height * 0.55,
        backgroundColor: 'rgba(13,13,13,0.88)',
    },
    top: { paddingHorizontal: 24, paddingTop: 16, gap: 14 },
    logoRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    logoIconBox: {
        width: 224,
        height: 128,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    logoIconImg: { width: 212, height: 212 },
    brandName: {
        color: '#F5F5F0',
        fontSize: 22,
        fontWeight: '800',
        letterSpacing: 2,
    },
    bottom: {
        marginTop: 'auto' as any,
        paddingHorizontal: 28,
        paddingBottom: 32,
        gap: 14,
    },
    heading: {
        color: '#F5F5F0',
        fontSize: 52,
        fontWeight: '900',
        lineHeight: 56,
        letterSpacing: -1,
    },
    sub: {
        color: 'rgba(245,245,240,0.55)',
        fontSize: 13,
        lineHeight: 19,
        maxWidth: width * 0.72,
    },
    actions: { gap: 10, marginTop: 8 },
    primaryBtn: {
        backgroundColor: '#B91C1C',
        borderRadius: 16,
        paddingVertical: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    primaryText: { color: '#fff', fontSize: 17, fontWeight: '700' },
    ghostBtn: {
        borderWidth: 1.5,
        borderColor: 'rgba(245,245,240,0.22)',
        borderRadius: 16,
        paddingVertical: 18,
        alignItems: 'center',
    },
    ghostText: {
        color: 'rgba(245,245,240,0.7)',
        fontSize: 16,
        fontWeight: '600',
    },
});
