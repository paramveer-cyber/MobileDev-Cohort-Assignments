import { createStackNavigator } from '@react-navigation/stack';
import SearchScreen from '../screens/SearchScreen';
import { useTheme } from '../context/ThemeContext';

const searchStack = createStackNavigator();

export function SearchStack() {
    const { theme } = useTheme();

    return (
        <searchStack.Navigator
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
            <searchStack.Screen
                name="Search"
                component={SearchScreen}
                options={{ headerShown: false }}
            />
        </searchStack.Navigator>
    );
}
