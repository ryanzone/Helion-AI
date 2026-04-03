import React, { useCallback, useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    ActivityIndicator,
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, GRADIENTS, SPACING, BORDER_RADIUS } from '../constants/Theme';
import { ThemedText } from '../components/core/ThemedText';
import { SurfaceCard } from '../components/core/SurfaceCard';
import { AIInsightChip } from '../components/core/AIInsightChip';
import { api } from '../services/api';

export default function PlanDetailScreen({ route, navigation }: any) {
    const { planId = '1' } = route.params || {};
    const [plan, setPlan] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const loadPlan = useCallback(async () => {
        try {
            const data = await api.getPlan(planId);
            setPlan(data);
        } catch (e) {
            console.log('Plan load error:', e);
        } finally {
            setLoading(false);
        }
    }, [planId]);

    useEffect(() => {
        loadPlan();
    }, [loadPlan]);

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </SafeAreaView>
        );
    }

    if (!plan) {
        return (
            <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ThemedText variant="body" color={COLORS.onSurfaceVariant}>Plan not found</ThemedText>
            </SafeAreaView>
        );
    }

    const features = typeof plan.features === 'string' ? JSON.parse(plan.features) : (plan.features || []);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Top bar */}
            <View style={styles.topBar}>
                <View style={styles.topBarLeft}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <MaterialIcons name="arrow-back" size={24} color={COLORS.onSurface} />
                    </TouchableOpacity>
                    <ThemedText variant="h3" color={COLORS.primary} style={{ fontWeight: '900', letterSpacing: -1 }}>
                        GigShield
                    </ThemedText>
                </View>
                <View style={styles.topBarRight}>
                    <MaterialIcons name="notifications" size={24} color={COLORS.primary} />
                    <View style={styles.avatar}>
                        <MaterialIcons name="person" size={18} color={COLORS.onSurface} />
                    </View>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Hero header */}
                <HeroHeader name={plan.name} price={plan.price} />

                {/* Coverage Breakdown */}
                <ThemedText variant="overline" color={COLORS.onSurfaceVariant} style={{ fontWeight: '700', marginBottom: SPACING.lg }}>
                    Coverage Breakdown
                </ThemedText>

                {/* Main Coverage Card */}
                <LiabilityCoverageCard />

                {/* Dynamic Features List from Plan */}
                {features.length > 0 && (
                    <SurfaceCard variant="default" style={styles.injuryCard} borderAccent={COLORS.secondary} borderSide="left">
                        <ThemedText variant="h3" style={{ fontSize: 18 }}>Included Features</ThemedText>
                        <View style={{ marginTop: 12 }}>
                            {features.map((feature: string, idx: number) => (
                                <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                                    <MaterialIcons name="check-circle" size={18} color={COLORS.secondary} />
                                    <ThemedText variant="body" color={COLORS.onSurfaceVariant} style={{ marginLeft: 8 }}>
                                        {feature}
                                    </ThemedText>
                                </View>
                            ))}
                        </View>
                    </SurfaceCard>
                )}

                {/* AI Insight */}
                <AIInsightChip
                    title="GigShield Insight"
                    description="Your current activity suggests you're eligible for the Safe Driver discount. This could reduce your next premium by 12%."
                    style={{ marginBottom: SPACING.lg }}
                />

                {/* Policy terms */}
                <PolicyTerms />

                {/* Upgrade CTA */}
                <UpgradeCTA navigation={navigation} planId={plan.id} />

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

// ─── Sub Components ────────────────────────────────────

function HeroHeader({ name, price }: { name: string; price: string }) {
    return (
        <View style={styles.heroHeader}>
            <View style={{ flex: 1 }}>
                <ThemedText variant="overline" color={COLORS.secondary}>Plan Details</ThemedText>
                <ThemedText variant="h1" style={{ fontSize: 40, lineHeight: 46, marginTop: 4 }}>
                    {name}
                </ThemedText>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
                <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                    <ThemedText variant="h2" color={COLORS.primary} style={{ fontSize: 28 }}>₹{price}</ThemedText>
                    <ThemedText variant="caption" color={COLORS.onSurfaceVariant}>/mo</ThemedText>
                </View>
            </View>
        </View>
    );
}

function LiabilityCoverageCard() {
    return (
        <SurfaceCard variant="default" style={styles.liabilityCard}>
            <MaterialIcons name="security" size={36} color={COLORS.primary} />
            <ThemedText variant="h3" style={{ marginTop: 12 }}>Liability Protection</ThemedText>
            <ThemedText variant="body" color={COLORS.onSurfaceVariant} style={{ marginTop: 8, lineHeight: 22, maxWidth: 320 }}>
                Comprehensive coverage for third-party bodily injury and property damage while active on any gig platform.
            </ThemedText>
            <View style={styles.limitsRow}>
                <View style={styles.limitBox}>
                    <ThemedText variant="overline" color={COLORS.outline}>Limit Per Incident</ThemedText>
                    <ThemedText variant="h3" style={{ marginTop: 4 }}>₹10,00,000</ThemedText>
                </View>
                <View style={styles.limitBox}>
                    <ThemedText variant="overline" color={COLORS.outline}>Deductible</ThemedText>
                    <ThemedText variant="h3" style={{ marginTop: 4 }}>₹5,000</ThemedText>
                </View>
            </View>
        </SurfaceCard>
    );
}

function PolicyTerms() {
    const terms = [
        { label: 'Policy Number', value: 'GS-9928-ACTIVE-00' },
        { label: 'Effective Date', value: new Date().toLocaleDateString() },
        { label: 'Billing Cycle', value: 'Monthly' },
        { label: 'Covered Platforms', value: 'All Partner Apps' },
    ];

    return (
        <View style={styles.policySection}>
            <View style={styles.policySectionHeader}>
                <ThemedText variant="overline" color={COLORS.onSurfaceVariant} style={{ fontWeight: '700' }}>
                    Policy Details & Terms
                </ThemedText>
            </View>
            {terms.map((t) => (
                <View key={t.label} style={styles.termRow}>
                    <ThemedText variant="body" color={COLORS.onSurfaceVariant}>{t.label}</ThemedText>
                    <ThemedText variant="body" style={{ fontWeight: '500' }}>{t.value}</ThemedText>
                </View>
            ))}
        </View>
    );
}

function UpgradeCTA({ navigation, planId }: { navigation: any, planId: string }) {
    return (
        <TouchableOpacity activeOpacity={0.9} style={{ marginTop: SPACING.xl }} onPress={() => navigation.navigate('PayoutSuccess', { amount: 50, type: 'Cashback' })}>
            <LinearGradient
                colors={GRADIENTS.primary as any}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.upgradeCTA}
            >
                <View style={{ flex: 1 }}>
                    <ThemedText variant="h2" color={COLORS.onPrimary} style={{ fontSize: 24, fontWeight: '900' }}>
                        Ready for Elite protection?
                    </ThemedText>
                    <ThemedText variant="body" color={`${COLORS.onPrimary}CC`} style={{ marginTop: 8, maxWidth: 280 }}>
                        Tap to simulate a payout success scenario or trigger view.
                    </ThemedText>
                </View>
                <TouchableOpacity style={styles.upgradeBtn} onPress={() => navigation.navigate('TriggerView', { condition: 'Rain Intensity', value: 'High' })}>
                    <ThemedText variant="overline" color={COLORS.primaryContainer} style={{ fontWeight: '900', letterSpacing: 1.5 }}>
                        SIMULATE TRIGGER
                    </ThemedText>
                </TouchableOpacity>
            </LinearGradient>
        </TouchableOpacity>
    );
}

// ─── Styles ────────────────────────────────────────────

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    topBar: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: SPACING.lg, paddingVertical: 12,
    },
    topBarLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    topBarRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    avatar: {
        width: 32, height: 32, borderRadius: 16,
        backgroundColor: COLORS.surfaceContainerHighest,
        justifyContent: 'center', alignItems: 'center',
    },
    scrollContent: { paddingHorizontal: SPACING.lg },
    heroHeader: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end',
        borderBottomWidth: 1, borderBottomColor: 'rgba(73, 69, 82, 0.15)',
        paddingBottom: SPACING.xl, marginBottom: SPACING.xl,
    },
    liabilityCard: { marginBottom: SPACING.lg, padding: SPACING.xl },
    limitsRow: { flexDirection: 'row', gap: 12, marginTop: SPACING.lg },
    limitBox: {
        flex: 1, backgroundColor: COLORS.surfaceContainerLow, padding: 16, borderRadius: 12,
    },
    injuryCard: { marginBottom: SPACING.lg },
    smallCardsRow: { gap: 12, marginBottom: SPACING.xl },
    smallCard: { padding: SPACING.lg },
    policySection: { marginBottom: SPACING.xl },
    policySectionHeader: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: SPACING.lg,
    },
    termRow: {
        flexDirection: 'row', justifyContent: 'space-between',
        paddingVertical: SPACING.lg, borderBottomWidth: 1, borderBottomColor: 'rgba(73, 69, 82, 0.1)',
    },
    upgradeCTA: {
        borderRadius: BORDER_RADIUS.lg, padding: SPACING.xl,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    },
    upgradeBtn: {
        backgroundColor: COLORS.onPrimary, paddingHorizontal: 20, paddingVertical: 16,
        borderRadius: BORDER_RADIUS.lg,
    },
});
