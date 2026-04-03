import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, ActivityIndicator } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useStore } from './store/store';
import { COLORS } from './constants/Theme';

// Auth Screens
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';

// Tab Screens
import DashboardScreen from './screens/DashboardScreen';
import ClaimHistoryScreen from './screens/ClaimHistoryScreen';
import EarningsScreen from './screens/EarningsScreen';
import HealthScreen from './screens/HealthScreen';
import ProfileScreen from './screens/ProfileScreen';

// Stack Screens
import FileClaimScreen from './screens/FileClaimScreen';
import PlanDetailScreen from './screens/PlanDetailScreen';
import TriggerViewScreen from './screens/TriggerViewScreen';
import PayoutSuccessScreen from './screens/PayoutSuccessScreen';
import PlanSelectionScreen from './screens/PlanSelectionScreen';
import PayoutHistoryScreen from './screens/PayoutHistoryScreen';
import WorkerActivityScreen from './screens/WorkerActivityScreen';
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Tab icon mapping
function TabIcon({ route, focused, color, size }: { route: string; focused: boolean; color: string; size: number }) {
    let iconName: keyof typeof MaterialIcons.glyphMap = 'home';
    switch (route) {
        case 'Home': iconName = focused ? 'home' : 'home'; break;
        case 'Claims': iconName = focused ? 'assignment-turned-in' : 'assignment-turned-in'; break;
        case 'Earnings': iconName = focused ? 'payments' : 'payments'; break;
        case 'Health': iconName = focused ? 'medical-services' : 'medical-services'; break;
        case 'Account': iconName = focused ? 'person' : 'person'; break;
    }
    return <MaterialIcons name={iconName} size={size} color={color} />;
}

// Auth Stack
function AuthStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
            }}
        >
            <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ animation: 'none' }}
            />
            <Stack.Screen
                name="Register"
                component={RegisterScreen}
                options={{ animation: 'slide_from_bottom' }}
            />
        </Stack.Navigator>
    );
}

// Main Tab Navigator
function MainTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused, color, size }) => (
                    <TabIcon route={route.name} focused={focused} color={color} size={size} />
                ),
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: `${COLORS.onSurface}66`,
                tabBarStyle: {
                    backgroundColor: `${COLORS.background}F2`,
                    borderTopWidth: 0,
                    paddingBottom: 8,
                    paddingTop: 8,
                    height: 68,
                    position: 'absolute' as const,
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    elevation: 0,
                    shadowOpacity: 0,
                },
                tabBarLabelStyle: {
                    fontSize: 10,
                    fontWeight: '600' as const,
                    textTransform: 'uppercase' as const,
                    letterSpacing: 1,
                    marginTop: 2,
                },
                tabBarItemStyle: {
                    borderRadius: 16,
                    marginHorizontal: 4,
                    paddingVertical: 4,
                },
            })}
        >
            <Tab.Screen name="Home" component={DashboardScreen} />
            <Tab.Screen name="Claims" component={ClaimHistoryScreen} />
            <Tab.Screen name="Earnings" component={EarningsScreen} />
            <Tab.Screen name="Health" component={HealthScreen} />
            <Tab.Screen name="Account" component={ProfileScreen} />
        </Tab.Navigator>
    );
}

// App Stack (After login — tabs + stack screens)
function AppStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
                contentStyle: { backgroundColor: COLORS.background },
            }}
        >
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="FileClaim" component={FileClaimScreen} />
            <Stack.Screen name="PlanDetail" component={PlanDetailScreen} />
            <Stack.Screen name="PlanSelection" component={PlanSelectionScreen} />
            <Stack.Screen name="WorkerActivity" component={WorkerActivityScreen} />
            <Stack.Screen name="PayoutHistory" component={PayoutHistoryScreen} />
            <Stack.Screen name="TriggerView" component={TriggerViewScreen} />
            <Stack.Screen
                name="PayoutSuccess"
                component={PayoutSuccessScreen}
                options={{ animation: 'slide_from_bottom' }}
            />
        </Stack.Navigator>
    );
}

// Root Navigator
export default function RootNavigator() {
    const isLoggedIn = useStore((state) => state.isLoggedIn);
    const [isLoading, setIsLoading] = React.useState(false);

    React.useEffect(() => {
        setIsLoading(false);
    }, []);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <NavigationContainer>
            {isLoggedIn ? <AppStack /> : <AuthStack />}
        </NavigationContainer>
    );
}