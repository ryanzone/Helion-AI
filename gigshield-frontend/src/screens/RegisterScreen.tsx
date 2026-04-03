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
import { useStore } from '../store/store';
import { COLORS, SPACING } from '../constants/Theme';
import { ThemedText } from '../components/core/ThemedText';
import { CustomInput } from '../components/core/CustomInput';
import { GradientButton } from '../components/core/GradientButton';
import { api } from '../services/api';

interface Props {
    navigation: NavigationProp<any>;
}

export default function RegisterScreen({ navigation }: Props) {
    const [name, setName] = useState('Rahul Kumar');
    const [email, setEmail] = useState('rahul@delivery.com');
    const [phone, setPhone] = useState('9876543210');
    const [location, setLocation] = useState('Bangalore');
    const [password, setPassword] = useState('password123');
    const [confirmPassword, setConfirmPassword] = useState('password123');
    const [loading, setLoading] = useState(false);
    const setUser = useStore((state) => state.setUser);
    const setLoggedIn = useStore((state) => state.setLoggedIn);
    const setToken = useStore((state) => state.setToken);

    const handleRegister = async () => {
        if (!name || !email || !phone || !location || !password) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }
        setLoading(true);
        try {
            const data = await api.register({ name, email, phone, location, password });
            setToken(data.token);
            setUser(data.user);
            setLoggedIn(true);
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Registration failed. Try again.');
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
                    </View>

                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <MaterialIcons name="arrow-back" size={24} color={COLORS.primary} />
                    </TouchableOpacity>

                    <View style={styles.hero}>
                        <View style={styles.brandRow}>
                            <MaterialIcons name="security" size={28} color={COLORS.primary} />
                            <ThemedText variant="h3" color={COLORS.primary} style={{ fontWeight: '900', letterSpacing: -1 }}>
                                GigShield
                            </ThemedText>
                        </View>
                        <ThemedText variant="h1" style={styles.title}>
                            Create{'\n'}Account
                        </ThemedText>
                        <ThemedText variant="body" color={COLORS.onSurfaceVariant} style={styles.subtitle}>
                            Join the future of gig worker protection. Encrypted. Intelligent. Yours.
                        </ThemedText>
                    </View>

                    <View style={styles.form}>
                        <FormField label="Full Name" icon="person" placeholder="Rahul Kumar" value={name} onChangeText={setName} />
                        <FormField label="Email Address" icon="mail" placeholder="rahul@delivery.com" value={email} onChangeText={setEmail} keyboardType="email-address" />

                        <View style={styles.row}>
                            <View style={{ flex: 1, marginRight: SPACING.md }}>
                                <FormField label="Phone" icon="phone" placeholder="9876543210" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <FormField label="Location" icon="location-on" placeholder="City" value={location} onChangeText={setLocation} />
                            </View>
                        </View>

                        <FormField label="Password" icon="lock" placeholder="••••••••" value={password} onChangeText={setPassword} secure />
                        <FormField label="Confirm Password" icon="shield" placeholder="••••••••" value={confirmPassword} onChangeText={setConfirmPassword} secure />

                        <GradientButton
                            title="Create Account"
                            onPress={handleRegister}
                            loading={loading}
                            icon="arrow-forward"
                            style={{ marginTop: SPACING.sm }}
                        />
                    </View>

                    <View style={styles.footer}>
                        <ThemedText variant="body" color={COLORS.onSurfaceVariant}>
                            Already have an account?{' '}
                        </ThemedText>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <ThemedText variant="body" color={COLORS.primary} style={{ fontWeight: '700' }}>
                                Sign In
                            </ThemedText>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

function FormField({ label, icon, placeholder, value, onChangeText, secure, keyboardType }: {
    label: string; icon: keyof typeof MaterialIcons.glyphMap;
    placeholder: string; value: string; onChangeText: (t: string) => void;
    secure?: boolean; keyboardType?: any;
}) {
    return (
        <>
            <ThemedText variant="overline" color={COLORS.outline} style={{ fontWeight: '700', marginBottom: 4, marginLeft: 2 }}>
                {label}
            </ThemedText>
            <CustomInput
                icon={icon}
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secure}
                keyboardType={keyboardType}
                autoCapitalize={keyboardType === 'email-address' ? 'none' : 'sentences'}
            />
        </>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    scrollContent: { flexGrow: 1, padding: SPACING.lg },
    bgDecor: { ...StyleSheet.absoluteFillObject, overflow: 'hidden' },
    bgCircle: { position: 'absolute', borderRadius: 999 },
    bgCircle1: {
        width: 300, height: 300, top: -80, right: -80,
        backgroundColor: 'rgba(206, 189, 255, 0.04)',
    },
    backBtn: {
        marginTop: 8, marginBottom: SPACING.lg,
        width: 40, height: 40, borderRadius: 12,
        backgroundColor: 'rgba(206, 189, 255, 0.08)',
        justifyContent: 'center', alignItems: 'center',
    },
    hero: { marginBottom: SPACING.xl },
    brandRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: SPACING.md },
    title: { fontSize: 44, lineHeight: 48, letterSpacing: -2 },
    subtitle: { fontSize: 16, lineHeight: 24, marginTop: 12, maxWidth: 300 },
    form: {},
    row: { flexDirection: 'row' },
    footer: {
        flexDirection: 'row', justifyContent: 'center',
        marginTop: SPACING.xl, marginBottom: SPACING.xl, paddingBottom: 20,
    },
});