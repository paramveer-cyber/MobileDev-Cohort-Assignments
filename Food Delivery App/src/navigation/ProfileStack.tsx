import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '../screens/ProfileScreen';
import { useTheme } from '../context/ThemeContext';
import HelpScreen from '../screens/HelpScreen';
import SettingsScreen from '../screens/SettingsScreen';

const profileStack = createStackNavigator();

export function ProfileStack() {
    const { theme } = useTheme();

    return (
        <profileStack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: theme.headerBg,
                    borderBottomWidth: 1,
                    borderBottomColor: theme.border,
                    shadowOpacity: 0,
                    elevation: 0,
                },
                headerTintColor: theme.text,
                headerBackTitle: 'BACK',
                headerTitleStyle: {
                    fontWeight: '900',
                    letterSpacing: 2,
                    fontSize: 13,
                },
            }}
        >
            <profileStack.Screen
                name="Profile"
                component={ProfileScreen}
                options={{ headerShown: false }}
            />
            <profileStack.Screen name="Help" component={HelpScreen} />
            <profileStack.Screen name="Settings" component={SettingsScreen} />
        </profileStack.Navigator>
    );
}
