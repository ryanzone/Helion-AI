import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, StatusBar, ActivityIndicator, Alert } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/Theme';
import { ThemedText } from '../components/core/ThemedText';
import { SurfaceCard } from '../components/core/SurfaceCard';
import { GradientButton } from '../components/core/GradientButton';
import { api } from '../services/api';

export default function WorkerActivityScreen({ navigation }: any) {
    const [activity, setActivity] = useState<any[]>([]);
    const [summary, setSummary] = useState<any>({ active_days: 0, eligible: false });
    const [loading, setLoading] = useState(true);
    const [logging, setLogging] = useState(false);

    useEffect(() => { load(); }, []);

    const load = async () => {
        try {
            const data = await api.getActivity();
            setActivity(data.activity || []);
            setSummary(data.summary || { active_days: 0, eligible: false });
        } catch (e) {
            console.log('Activity load error:', e);
        } finally {
            setLoading(false);
        }
    };

    const logToday = async () => {
        setLogging(true);
        try {
            const today = new Date().toISOString().split('T')[0];
            const result = await api.logActivity({ activity_date: today, hours_active: 8, deliveries_count: 12, city: 'Mumbai', platform: 'zomato' });
            await load();
            if (result.underwritingPassed) Alert.alert('✅ Eligible!', 'You now qualify for coverage.');
        } catch (e: any) {
            Alert.alert('Error', e.message);
        } finally {
            setLogging(false);
        }
    };

    if (loading) return (
        <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
            <ActivityIndicator size="large" color={COLORS.primary} />
        </SafeAreaView>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialIcons name="arrow-back" size={24} color={COLORS.onSurface} />
                </TouchableOpacity>
                <ThemedText variant="h3" color={COLORS.primary} style={{ letterSpacing: -1 }}>Activity</ThemedText>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.summaryRow}>
                <SurfaceCard variant="default" style={styles.summaryCard}>
                    <ThemedText variant="overline" color={COLORS.onSurfaceVariant}>Active Days (30d)</ThemedText>
                    <ThemedText variant="h1" style={{ fontSize: 40, marginTop: 4 }}>{summary.active_days}<ThemedText variant="body" color={COLORS.onSurfaceVariant}>/7</ThemedText></ThemedText>
                </SurfaceCard>
                <SurfaceCard variant="default" style={{ ...styles.summaryCard, backgroundColor: summary.eligible ? 'rgba(128,217,164,0.1)' : undefined }}>
                    <ThemedText variant="overline" color={COLORS.onSurfaceVariant}>Underwriting</ThemedText>
                    <MaterialIcons
                        name={summary.eligible ? 'verified' : 'pending'}
                        size={32} color={summary.eligible ? COLORS.secondary : COLORS.onSurfaceVariant}
                        style={{ marginTop: 8 }}
                    />
                    <ThemedText variant="caption" color={summary.eligible ? COLORS.secondary : COLORS.onSurfaceVariant} style={{ fontWeight: '700', marginTop: 4 }}>
                        {summary.eligible ? 'ELIGIBLE' : 'NOT YET'}
                    </ThemedText>
                </SurfaceCard>
            </View>

            <FlatList
                data={activity}
                keyExtractor={item => item.id}
                contentContainerStyle={{ paddingHorizontal: SPACING.lg, paddingBottom: 160 }}
                ListEmptyComponent={
                    <SurfaceCard variant="lowest" style={{ padding: SPACING.xl, alignItems: 'center' }}>
                        <MaterialIcons name="directions-bike" size={40} color={COLORS.outlineVariant} />
                        <ThemedText variant="body" color={COLORS.onSurfaceVariant} style={{ textAlign: 'center', marginTop: 12 }}>No activity logged yet</ThemedText>
                    </SurfaceCard>
                }
                renderItem={({ item }) => (
                    <SurfaceCard variant="lowest" style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, padding: 16 }}>
                        <View>
                            <ThemedText variant="body" style={{ fontWeight: '600' }}>{item.activity_date}</ThemedText>
                            <ThemedText variant="caption">{item.platform} • {item.city}</ThemedText>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                            <ThemedText variant="body" style={{ fontWeight: '700' }}>{item.deliveries_count} deliveries</ThemedText>
                            <ThemedText variant="caption">{item.hours_active}h</ThemedText>
                        </View>
                    </SurfaceCard>
                )}
            />

            <View style={styles.footer}>
                <GradientButton title={logging ? 'Logging...' : 'Log Today\'s Activity'} onPress={logToday} icon="add-circle" />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.lg, paddingVertical: 12 },
    summaryRow: { flexDirection: 'row', gap: 12, paddingHorizontal: SPACING.lg, marginBottom: SPACING.lg },
    summaryCard: { flex: 1, height: 120, justifyContent: 'space-between' },
    footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: SPACING.lg, paddingBottom: 32 },
});