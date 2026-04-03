import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Alert,
    Platform,
    TouchableOpacity,
} from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useStore } from '../store/store';
import { COLORS, GRADIENTS, SPACING, BORDER_RADIUS } from '../constants/Theme';
import { ThemedText } from '../components/core/ThemedText';
import { CustomInput } from '../components/core/CustomInput';
import { GradientButton } from '../components/core/GradientButton';
import { api } from '../services/api';

interface Props {
    navigation: NavigationProp<any>;
}

export default function LoginScreen({ navigation }: Props) {
    const [email, setEmail] = useState(' ');
    const [password, setPassword] = useState(' ');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const setUser = useStore((state) => state.setUser);
    const setLoggedIn = useStore((state) => state.setLoggedIn);
    const setToken = useStore((state) => state.setToken);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }
        setLoading(true);
        try {
            const data = await api.login(email, password);
            setToken(data.token);
            setUser(data.user);
            setLoggedIn(true);
        } catch (error: any) {
            let msg = error.message || 'Login failed. Try again.';
            if (msg.toLowerCase().includes('invalid') || msg.toLowerCase().includes('not found')) {
                msg = 'Account not found. Please register first, or check your credentials.';
            }
            Alert.alert('Login Error', msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.bgDecor}>
                        <View style={[styles.bgCircle, styles.bgCircle1]} />
                        <View style={[styles.bgCircle, styles.bgCircle2]} />
                    </View>

                    <View style={styles.topBrand}>
                        <MaterialIcons name="security" size={28} color={COLORS.primary} />
                        <ThemedText variant="h3" color={COLORS.primary} style={{ fontWeight: '900', letterSpacing: -1 }}>
                            Helion
                        </ThemedText>
                    </View>

                    <View style={styles.hero}>
                        <View style={styles.iconRow}>
                            <View style={styles.securityIcon}>
                                <MaterialIcons name="lock" size={32} color={COLORS.primary} />
                            </View>
                        </View>
                        <ThemedText variant="h1" style={styles.title}>
                            Welcome{'\n'}back.
                        </ThemedText>
                        <ThemedText variant="body" color={COLORS.onSurfaceVariant} style={styles.subtitle}>
                            Your digital ledger is encrypted end-to-end. Authenticate to continue.
                        </ThemedText>
                    </View>

                    <View style={styles.form}>
                        <ThemedText variant="overline" color={COLORS.outline} style={styles.fieldLabel}>
                            Email Address
                        </ThemedText>
                        <CustomInput
                            icon="mail"
                            placeholder="your@email.com"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />

                        <ThemedText variant="overline" color={COLORS.outline} style={styles.fieldLabel}>
                            Password
                        </ThemedText>
                        <View style={styles.passwordRow}>
                            <CustomInput
                                icon="lock"
                                placeholder="••••••••"
                                secureTextEntry={!showPassword}
                                value={password}
                                onChangeText={setPassword}
                                containerStyle={{ flex: 1, marginBottom: 0 }}
                            />
                            <TouchableOpacity
                                onPress={() => setShowPassword(!showPassword)}
                                style={styles.eyeBtn}
                            >
                                <MaterialIcons
                                    name={showPassword ? 'visibility-off' : 'visibility'}
                                    size={20}
                                    color={COLORS.onSurfaceVariant}
                                />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={styles.forgotBtn}>
                            <ThemedText variant="caption" color={COLORS.primary} style={{ fontWeight: '600' }}>
                                Forgot Password?
                            </ThemedText>
                        </TouchableOpacity>

                        <GradientButton
                            title="Sign In to Helion"
                            onPress={handleLogin}
                            loading={loading}
                            icon="arrow-forward"
                            style={{ marginTop: SPACING.md }}
                        />
                    </View>

                    <View style={styles.footer}>
                        <ThemedText variant="body" color={COLORS.onSurfaceVariant}>
                            Don't have an account?{' '}
                        </ThemedText>
                        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                            <ThemedText variant="body" color={COLORS.primary} style={{ fontWeight: '700' }}>
                                Sign Up
                            </ThemedText>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.aiChip}>
                        <View style={styles.aiDot} />
                        <ThemedText variant="overline" color={COLORS.onSecondaryContainer} style={{ fontWeight: '700' }}>
                            AI Protected Session
                        </ThemedText>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContent: {
        flexGrow: 1,
        padding: SPACING.lg,
        justifyContent: 'center',
    },
    bgDecor: {
        ...StyleSheet.absoluteFillObject,
        overflow: 'hidden',
    },
    bgCircle: {
        position: 'absolute',
        borderRadius: 999,
    },
    bgCircle1: {
        width: 300,
        height: 300,
        top: -80,
        right: -80,
        backgroundColor: 'rgba(206, 189, 255, 0.04)',
    },
    bgCircle2: {
        width: 200,
        height: 200,
        bottom: 100,
        left: -60,
        backgroundColor: 'rgba(128, 217, 164, 0.03)',
    },
    topBrand: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: SPACING.xxl,
    },
    hero: {
        marginBottom: SPACING.xxl,
    },
    iconRow: {
        marginBottom: SPACING.lg,
    },
    securityIcon: {
        width: 56,
        height: 56,
        borderRadius: 16,
        backgroundColor: 'rgba(206, 189, 255, 0.12)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 44,
        lineHeight: 48,
        letterSpacing: -2,
    },
    subtitle: {
        fontSize: 16,
        lineHeight: 24,
        marginTop: 12,
        maxWidth: 300,
    },
    form: {},
    fieldLabel: {
        fontWeight: '700',
        marginBottom: 4,
        marginLeft: 2,
    },
    passwordRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.lg,
    },
    eyeBtn: {
        position: 'absolute',
        right: 0,
        height: '100%',
        justifyContent: 'center',
        paddingHorizontal: 8,
    },
    forgotBtn: {
        alignSelf: 'flex-end',
        marginBottom: SPACING.lg,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: SPACING.xl,
        marginBottom: SPACING.xl,
    },
    aiChip: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: `${COLORS.secondaryContainer}99`,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: BORDER_RADIUS.round,
        alignSelf: 'center',
    },
    aiDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.secondary,
    },
});