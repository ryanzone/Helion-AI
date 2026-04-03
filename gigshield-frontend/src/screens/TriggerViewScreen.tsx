import React, { useEffect, useState } from 'react';
import {
    View, StyleSheet, ScrollView, TouchableOpacity,
    SafeAreaView, StatusBar, ActivityIndicator,
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, GRADIENTS, SPACING, BORDER_RADIUS } from '../constants/Theme';
import { ThemedText } from '../components/core/ThemedText';
import { SurfaceCard } from '../components/core/SurfaceCard';
import { AIInsightChip } from '../components/core/AIInsightChip';
import { api } from '../services/api';

export default function TriggerViewScreen({ route, navigation }: any) {
    const [triggers, setTriggers] = useState<any[]>([]);
    const [premium, setPremium] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [simulating, setSimulating] = useState(false);

    useEffect(() => {
        load();
    }, []);

    const load = async () => {
        try {
            const [t, p] = await Promise.all([api.getTriggers(), api.getPremium().catch(() => null)]);
            setTriggers(t || []);
            setPremium(p);
        } catch (e) {
            console.log('Trigger load error:', e);
        } finally {
            setLoading(false);
        }
    };

    const simulate = async (peril_type: string, metric_value: number) => {
        if (!premium?.city_pool) return;
        setSimulating(true);
        try {
            await api.checkTrigger({ peril_type, metric_value, city_pool: premium.city_pool, data_source: 'mock' });
            await load();
        } catch (e) {
            console.log('Simulate error:', e);
        } finally {
            setSimulating(false);
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </SafeAreaView>
        );
    }

    const latestTrigger = triggers[0];
    const perilIcon: Record<string, keyof typeof MaterialIcons.glyphMap> = {
        rain: 'water', aqi: 'air', flood: 'waves',
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            <View style={styles.topBar}>
                <View style={styles.topBarLeft}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <MaterialIcons name="arrow-back" size={24} color={COLORS.onSurface} />
                    </TouchableOpacity>
                    <ThemedText variant="h3" color={COLORS.primary} style={{ letterSpacing: -1 }}>Helion</ThemedText>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Premium summary */}
                {premium && (
                    <View style={styles.indicatorsGrid}>
                        <SurfaceCard variant="low" style={styles.conditionCard}>
                            <ThemedText variant="overline" color={COLORS.onSurfaceVariant}>Weekly Premium</ThemedText>
                            <ThemedText variant="h2" style={{ fontSize: 28, marginTop: 8 }}>₹{premium.final_premium}</ThemedText>
                            <ThemedText variant="caption" color={COLORS.onSurfaceVariant}>{premium.city_pool}</ThemedText>
                        </SurfaceCard>
                        <SurfaceCard variant="low" style={styles.conditionCard}>
                            <ThemedText variant="overline" color={COLORS.onSurfaceVariant}>Trigger Probability</ThemedText>
                            <ThemedText variant="h2" color={COLORS.primary} style={{ fontSize: 28, marginTop: 8 }}>
                                {(premium.trigger_probability * 100).toFixed(0)}%
                            </ThemedText>
                            <ThemedText variant="caption" color={COLORS.onSurfaceVariant}>{premium.days_exposed} active days</ThemedText>
                        </SurfaceCard>
                    </View>
                )}

                {/* Latest trigger alert */}
                {latestTrigger ? (
                    <View style={styles.alertWrapper}>
                        <View style={styles.alertGlow} />
                        <View style={styles.alertCard}>
                            <View style={styles.alertTop}>
                                <View style={styles.alertIconBox}>
                                    <MaterialIcons
                                        name={perilIcon[latestTrigger.peril_type] || 'warning'}
                                        size={28} color={COLORS.primary}
                                    />
                                </View>
                                <View style={styles.shieldBadge}>
                                    <ThemedText variant="overline" color={COLORS.onSecondaryContainer} style={{ fontWeight: '700' }}>
                                        {latestTrigger.status === 'processed' ? 'Payout Issued' : 'Active Shield'}
                                    </ThemedText>
                                </View>
                            </View>
                            <ThemedText variant="h1" style={{ fontSize: 28, lineHeight: 34, marginTop: SPACING.lg }}>
                                {latestTrigger.peril_type.toUpperCase()} Trigger:{' '}
                                <ThemedText variant="h1" color={COLORS.primary} style={{ fontSize: 28 }}>
                                    {latestTrigger.metric_value} (threshold {latestTrigger.threshold_value})
                                </ThemedText>
                            </ThemedText>
                            <ThemedText variant="body" color={COLORS.onSurfaceVariant} style={{ marginTop: 8 }}>
                                {latestTrigger.city_pool} • {latestTrigger.data_source} • {new Date(latestTrigger.triggered_at).toLocaleDateString()}
                            </ThemedText>
                            <AIInsightChip
                                variant="compact"
                                description="Parametric trigger fired. Eligible workers receive automatic payouts — no claim needed."
                                style={{ marginTop: SPACING.lg }}
                            />
                        </View>
                    </View>
                ) : (
                    <SurfaceCard variant="lowest" style={{ padding: SPACING.xl, alignItems: 'center', marginBottom: SPACING.xl }}>
                        <MaterialIcons name="check-circle" size={40} color={COLORS.secondary} />
                        <ThemedText variant="body" color={COLORS.onSurfaceVariant} style={{ textAlign: 'center', marginTop: 12 }}>
                            No triggers fired yet
                        </ThemedText>
                        <ThemedText variant="caption" color={COLORS.outlineVariant} style={{ textAlign: 'center', marginTop: 4 }}>
                            Conditions are within safe thresholds
                        </ThemedText>
                    </SurfaceCard>
                )}

                {/* Simulate buttons */}
                <ThemedText variant="h3" style={{ marginBottom: SPACING.md }}>Simulate Trigger</ThemedText>
                <View style={{ gap: 12, marginBottom: SPACING.xl }}>
                    {[
                        { label: '🌧️ Rain (65mm)', peril: 'rain', value: 65 },
                        { label: '🌫️ AQI (320)', peril: 'aqi', value: 320 },
                        { label: '🌊 Flood Alert', peril: 'flood', value: 2 },
                    ].map(s => (
                        <TouchableOpacity
                            key={s.peril}
                            style={[styles.simBtn, simulating && { opacity: 0.5 }]}
                            onPress={() => simulate(s.peril, s.value)}
                            disabled={simulating}
                            activeOpacity={0.8}
                        >
                            <ThemedText variant="body" style={{ fontWeight: '700' }}>{s.label}</ThemedText>
                            <MaterialIcons name="play-circle" size={20} color={COLORS.primary} />
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Trigger history */}
                {triggers.length > 1 && (
                    <>
                        <ThemedText variant="h3" style={{ marginBottom: SPACING.md }}>History</ThemedText>
                        {triggers.slice(1).map((t: any) => (
                            <SurfaceCard key={t.id} variant="lowest" style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, padding: 16 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                                    <MaterialIcons name={perilIcon[t.peril_type] || 'warning'} size={20} color={COLORS.onSurfaceVariant} />
                                    <View>
                                        <ThemedText variant="body" style={{ fontWeight: '600' }}>{t.peril_type.toUpperCase()}</ThemedText>
                                        <ThemedText variant="caption">{new Date(t.triggered_at).toLocaleDateString()}</ThemedText>
                                    </View>
                                </View>
                                <ThemedText variant="caption" color={t.status === 'processed' ? COLORS.secondary : COLORS.onSurfaceVariant} style={{ fontWeight: '700' }}>
                                    {t.status}
                                </ThemedText>
                            </SurfaceCard>
                        ))}
                    </>
                )}

                <View style={{ height: 100 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    topBar: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: SPACING.lg, paddingVertical: 12,
    },
    topBarLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    scrollContent: { paddingHorizontal: SPACING.lg },
    indicatorsGrid: { flexDirection: 'row', gap: 12, marginBottom: SPACING.xl },
    conditionCard: { flex: 1, height: 120, justifyContent: 'space-between' },
    alertWrapper: { position: 'relative', marginBottom: SPACING.xl },
    alertGlow: {
        position: 'absolute', top: -16, left: -16, right: -16, bottom: -16,
        backgroundColor: 'rgba(206, 189, 255, 0.08)', borderRadius: 999,
    },
    alertCard: {
        backgroundColor: COLORS.surfaceContainerLow, borderRadius: BORDER_RADIUS.xl,
        padding: SPACING.xl, borderWidth: 1, borderColor: 'rgba(73, 69, 82, 0.1)',
    },
    alertTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    alertIconBox: {
        backgroundColor: 'rgba(206, 189, 255, 0.15)', padding: 12, borderRadius: BORDER_RADIUS.lg,
    },
    shieldBadge: {
        backgroundColor: 'rgba(0, 109, 66, 0.2)', paddingHorizontal: 12, paddingVertical: 4,
        borderRadius: BORDER_RADIUS.round, borderWidth: 1, borderColor: 'rgba(128, 217, 164, 0.2)',
    },
    simBtn: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        backgroundColor: COLORS.surfaceContainerLow, padding: 16,
        borderRadius: BORDER_RADIUS.lg, borderWidth: 1, borderColor: 'rgba(73, 69, 82, 0.1)',
    },
});