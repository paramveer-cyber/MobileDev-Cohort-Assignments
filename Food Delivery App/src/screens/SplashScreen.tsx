import { useEffect, useRef } from 'react';
import {
    View,
    StyleSheet,
    Animated,
    Dimensions,
    StatusBar,
    Text,
    Image,
} from 'react-native';

const { width, height } = Dimensions.get('window');
const appIcon = require('../../assets/icon.png');

export default function SplashScreen({ navigation }: { navigation: any }) {
    const logoScale = useRef(new Animated.Value(0.4)).current;
    const logoOpacity = useRef(new Animated.Value(0)).current;
    const ringScale = useRef(new Animated.Value(0.6)).current;
    const ringOpacity = useRef(new Animated.Value(0)).current;
    const textOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.sequence([
            Animated.parallel([
                Animated.spring(logoScale, {
                    toValue: 1,
                    useNativeDriver: true,
                    damping: 12,
                    stiffness: 180,
                }),
                Animated.timing(logoOpacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]),
            Animated.parallel([
                Animated.timing(ringScale, {
                    toValue: 1.8,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.timing(ringOpacity, {
                    toValue: 0.15,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]),
            Animated.timing(textOpacity, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start();

        const timer = setTimeout(() => navigation.replace('Onboarding'), 900);
        return () => clearTimeout(timer);
    }, []);

    return (
        <View style={styles.wrap}>
            <StatusBar barStyle="light-content" backgroundColor="#0D0D0D" />
            <Animated.View
                style={[
                    styles.ring,
                    { transform: [{ scale: ringScale }], opacity: ringOpacity },
                ]}
            />
            <Animated.View
                style={[
                    styles.logoBox,
                    { transform: [{ scale: logoScale }], opacity: logoOpacity },
                ]}
            >
                <Image
                    source={appIcon}
                    style={styles.iconImg}
                    resizeMode="contain"
                />
            </Animated.View>
            <Animated.Text style={[styles.wordmark, { opacity: textOpacity }]}>
                biterun
            </Animated.Text>
        </View>
    );
}

const styles = StyleSheet.create({
    wrap: {
        flex: 1,
        backgroundColor: '#0D0D0D',
        alignItems: 'center',
        justifyContent: 'center',
    },
    ring: {
        position: 'absolute',
        width: 130,
        height: 130,
        borderRadius: 65,
        borderWidth: 2,
        borderColor: '#B91C1C',
    },
    logoBox: {
        width: 156,
        height: 156,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    iconImg: { width: 156, height: 156 },
    wordmark: {
        marginTop: 20,
        color: '#F5F5F0',
        fontSize: 28,
        fontWeight: '800',
        letterSpacing: 3,
    },
});
