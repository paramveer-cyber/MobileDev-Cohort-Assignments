import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';

const Stack = createStackNavigator();

export function AuthStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                cardStyleInterpolator: ({ current, layouts }) => ({
                    cardStyle: {
                        opacity: current.progress,
                        transform: [
                            {
                                scale: current.progress.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0.96, 1],
                                }),
                            },
                        ],
                    },
                }),
            }}
        >
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Signin" component={SignInScreen} />
            <Stack.Screen name="Signup" component={SignUpScreen} />
        </Stack.Navigator>
    );
}
