import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import {
    View,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    StatusBar,
    ActivityIndicator,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, GRADIENTS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/Theme';
import { ThemedText } from '../components/core/ThemedText';
import { GlassCard } from '../components/core/GlassCard';
import { GradientButton } from '../components/core/GradientButton';
import { api } from '../services/api';

export default function PlanSelectionScreen({ navigation }: any) {
    const [plans, setPlans] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [subscribing, setSubscribing] = useState<string | null>(null); // ✅ FIXED

    useEffect(() => {
        loadPlans();
    }, []);

    const loadPlans = async () => {
        try {
            const data = await api.getPlans();
            setPlans(data && data.length > 0 ? data : getFallbackPlans());
        } catch (e) {
            console.log('Plans load error:', e);
            setPlans(getFallbackPlans());
        } finally {
            setLoading(false);
        }
    };

    const getFallbackPlans = () => [
        {
            id: '1',
            name: 'Essential Cover',
            price: 299,
            features: JSON.stringify([
                'Income Protection ₹500/day',
                'Basic Liability',
                '24/7 Support',
            ]),
        },
        {
            id: '2',
            name: 'Pro Shield',
            price: 499,
            features: JSON.stringify([
                'Income Protection ₹1000/day',
                'Full Liability & Medical',
                'Priority Support',
            ]),
        },
    ];

    const parseFeatures = (features: any) => {
        try {
            return typeof features === 'string'
                ? JSON.parse(features)
                : (features || []);
        } catch {
            return [];
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </SafeAreaView>
        );
    }

    const planIcons = ['flash-outline', 'shield-checkmark', 'star'];
    const planGradients = [GRADIENTS.dark, GRADIENTS.primary, GRADIENTS.secondary];
    const planColors = [COLORS.textMuted, COLORS.primary, COLORS.secondary];

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            <LinearGradient
                colors={[COLORS.background, '#0A1428'] as any}
                style={StyleSheet.absoluteFill}
            />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <ThemedText variant="h1">Protect Your Income</ThemedText>
                    <ThemedText variant="body" color={COLORS.textMuted}>
                        Choose a plan that fits your work life
                    </ThemedText>
                </View>

                {plans.map((plan: any, index: number) => {
                    const features = parseFeatures(plan.features);
                    const isPopular = index === 1;
                    const color = planColors[index] || COLORS.textMuted;
                    const icon = planIcons[index] || 'flash-outline';

                    return (
                        <GlassCard
                            key={plan.id}
                            style={[styles.planCard, isPopular && styles.popularCard] as any}
                            gradient={isPopular}
                        >
                            {isPopular && (
                                <View style={styles.popularBadge}>
                                    <ThemedText variant="caption" style={styles.popularBadgeText}>
                                        MOST POPULAR
                                    </ThemedText>
                                </View>
                            )}

                            <View style={styles.planHeader}>
                                <LinearGradient
                                    colors={(isPopular
                                        ? GRADIENTS.glass
                                        : [COLORS.surfaceContainerHigh, COLORS.surface]) as any}
                                    style={styles.iconBox}
                                >
                                    <Ionicons
                                        name={icon as any}
                                        size={28}
                                        color={color === COLORS.textMuted ? COLORS.primary : color}
                                    />
                                </LinearGradient>

                                <View style={{ flex: 1 }}>
                                    <ThemedText variant="h2" style={{ fontSize: 20 }}>
                                        {plan.name}
                                    </ThemedText>
                                    <ThemedText variant="caption" color={COLORS.secondary} style={{ fontWeight: 'bold' }}>
                                        PREMIUM PLAN
                                    </ThemedText>
                                </View>
                            </View>

                            <View style={styles.priceContainer}>
                                <ThemedText variant="h1" style={styles.priceText}>₹{plan.price}</ThemedText>
                                <ThemedText variant="h3" style={styles.periodText}>/mo</ThemedText>
                            </View>

                            <View style={styles.divider} />

                            {features.map((feature: string, idx: number) => (
                                <View key={idx} style={styles.featureItem}>
                                    <Ionicons name="checkmark-circle" size={18} color={COLORS.success} />
                                    <ThemedText variant="body" style={styles.featureText}>
                                        {feature}
                                    </ThemedText>
                                </View>
                            ))}

                            <GradientButton
                                title={subscribing === plan.id ? 'Subscribing...' : 'Select This Plan'}
                                disabled={!!subscribing}
                                onPress={async () => {
                                    if (subscribing) return;

                                    setSubscribing(plan.id);
                                    try {
                                        await api.subscribePlan(plan.id, plan.city_pool || 'mumbai_rain');
                                        navigation.navigate('PlanDetail', { planId: plan.id });
                                    } catch (e) {
                                        console.log('Subscribe error:', e);
                                        Alert.alert('Error', 'Subscription failed (demo mode)');
                                        navigation.navigate('PlanDetail', { planId: plan.id });
                                    } finally {
                                        setSubscribing(null);
                                    }
                                }}
                                variant={isPopular ? 'primary' : 'outline'}
                                style={styles.selectBtn}
                            />
                        </GlassCard>
                    );
                })}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    scrollContent: { padding: SPACING.lg, paddingBottom: 100 },
    header: { marginBottom: SPACING.xl },
    planCard: { marginBottom: SPACING.xl, padding: SPACING.lg },
    popularCard: { borderColor: COLORS.primary, borderWidth: 1.5 },
    popularBadge: {
        position: 'absolute',
        top: -12,
        right: 20,
        backgroundColor: COLORS.primary,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        ...SHADOWS.light,
    },
    popularBadgeText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    planHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.lg },
    iconBox: {
        width: 56,
        height: 56,
        borderRadius: BORDER_RADIUS.md,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    priceContainer: { flexDirection: 'row', alignItems: 'baseline', marginBottom: SPACING.lg },
    priceText: { fontSize: 40, color: COLORS.text },
    periodText: { color: COLORS.textMuted, marginLeft: 4 },
    divider: { height: 1, backgroundColor: COLORS.border, marginBottom: SPACING.lg },
    featureItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    featureText: { marginLeft: 10, color: COLORS.textMuted },
    selectBtn: { marginTop: SPACING.lg },
});