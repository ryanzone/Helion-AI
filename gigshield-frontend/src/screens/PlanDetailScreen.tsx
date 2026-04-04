import React, { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    ActivityIndicator,
    Alert,
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
    const [subscribing, setSubscribing] = useState(false);

    useEffect(() => {
        loadPlan();
    }, [planId]);

    const loadPlan = async () => {
        try {
            const data = await api.getPlan(planId);
            setPlan(data && data.name ? data : getFallbackPlan());
        } catch (e) {
            console.log('Plan load error:', e);
            setPlan(getFallbackPlan());
        } finally {
            setLoading(false);
        }
    };

    const handleSubscribe = async () => {
        try {
            setSubscribing(true);

            const res = await api.subscribePlan(planId, "Chennai");

            Alert.alert("Success", "Subscription successful");
            console.log(res);

            navigation.navigate('PayoutSuccess');

        } catch (err: any) {
            console.error(err);
            Alert.alert("Error", err.message || "Subscription failed");
        } finally {
            setSubscribing(false);
        }
    };

    const getFallbackPlan = () => ({
        id: planId,
        name: planId === '2' ? 'Pro Shield' : 'Essential Cover',
        price: planId === '2' ? 499 : 299,
        features: JSON.stringify([
            'Income Protection ₹500/day',
            'Basic Liability',
            '24/7 Support',
            'Trip Delay Reimbursement',
        ]),
    });

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

    if (!plan) {
        return (
            <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ThemedText variant="body" color={COLORS.onSurfaceVariant}>
                    Plan not found
                </ThemedText>
            </SafeAreaView>
        );
    }

    const features = parseFeatures(plan.features);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />

            <View style={styles.topBar}>
                <View style={styles.topBarLeft}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <MaterialIcons name="arrow-back" size={24} color={COLORS.onSurface} />
                    </TouchableOpacity>
                    <ThemedText variant="h3" color={COLORS.primary} style={{ fontWeight: '900' }}>
                        Helion
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
                <HeroHeader name={plan.name} price={plan.price} />

                <ThemedText
                    variant="overline"
                    color={COLORS.onSurfaceVariant}
                    style={{ fontWeight: '700', marginBottom: SPACING.lg }}
                >
                    Coverage Breakdown
                </ThemedText>

                <LiabilityCoverageCard />

                {features.length > 0 && (
                    <SurfaceCard
                        variant="default"
                        style={styles.injuryCard}
                        borderAccent={COLORS.secondary}
                        borderSide="left"
                    >
                        <ThemedText variant="h3" style={{ fontSize: 18 }}>
                            Included Features
                        </ThemedText>

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

                <AIInsightChip
                    title="Helion Insight"
                    description="Your current activity suggests you're eligible for the Safe Driver discount."
                    style={{ marginBottom: SPACING.lg }}
                />

                <PolicyTerms />

                {/* 🔥 REAL SUBSCRIBE BUTTON */}
                <TouchableOpacity onPress={handleSubscribe} disabled={subscribing}>
                    <LinearGradient colors={GRADIENTS.primary as any} style={styles.upgradeCTA}>
                        {subscribing ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <ThemedText color={COLORS.onPrimary}>Subscribe Now</ThemedText>
                        )}
                    </LinearGradient>
                </TouchableOpacity>

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

function HeroHeader({ name, price }: { name: string; price: number }) {
    return (
        <View style={styles.heroHeader}>
            <View style={{ flex: 1 }}>
                <ThemedText variant="overline" color={COLORS.secondary}>Plan Details</ThemedText>
                <ThemedText variant="h1" style={{ fontSize: 40 }}>{name}</ThemedText>
            </View>
            <ThemedText variant="h2" color={COLORS.primary}>₹{price}/mo</ThemedText>
        </View>
    );
}

function LiabilityCoverageCard() {
    return (
        <SurfaceCard variant="default" style={styles.liabilityCard}>
            <MaterialIcons name="security" size={36} color={COLORS.primary} />
            <ThemedText variant="h3">Liability Protection</ThemedText>
            <ThemedText variant="body">Covers third-party damages during gigs.</ThemedText>
        </SurfaceCard>
    );
}

function PolicyTerms() {
    return (
        <View style={styles.policySection}>
            <ThemedText>Policy: GS-9928</ThemedText>
            <ThemedText>Billing: Monthly</ThemedText>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    scrollContent: { padding: SPACING.lg },

    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: SPACING.lg,
    },
    topBarLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    topBarRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },

    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: COLORS.surfaceContainerHighest,
        justifyContent: 'center',
        alignItems: 'center',
    },

    heroHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SPACING.xl,
    },

    liabilityCard: {
        padding: SPACING.lg,
        marginBottom: SPACING.lg,
    },

    injuryCard: {
        marginBottom: SPACING.lg,
    },

    policySection: {
        marginBottom: SPACING.lg,
    },

    upgradeCTA: {
        padding: SPACING.lg,
        borderRadius: BORDER_RADIUS.lg,
        alignItems: 'center',
    },
});