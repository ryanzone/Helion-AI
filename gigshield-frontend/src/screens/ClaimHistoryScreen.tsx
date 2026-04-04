import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
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
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/Theme';
import { ThemedText } from '../components/core/ThemedText';
import { SurfaceCard } from '../components/core/SurfaceCard';
import { StatusBadge } from '../components/core/StatusBadge';
import { AIInsightChip } from '../components/core/AIInsightChip';
import { api } from '../services/api';

const FILTERS = ['All Claims', 'Approved', 'Pending', 'Rejected'];

export default function ClaimHistoryScreen({ navigation }: any) {
    const [activeFilter, setActiveFilter] = useState(0);
    const [claims, setClaims] = useState<any[]>([]);
    const [summary, setSummary] = useState<any>({ total: 0, approved: 0, pending: 0 });
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            loadClaims();
        }, [])
    );

    const loadClaims = async () => {
        try {
            const data = await api.getClaims();
            setClaims(data.claims || []);
            setSummary(data.summary || { total: 0, approved: 0, pending: 0 });
        } catch (e) {
            console.log('Claims load error:', e);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id: string) => {
        try {
            await api.updateClaimStatus(id, 'Approved');
            loadClaims();
        } catch (err) {
            console.log('Approve failed:', err);
        }
    };

    const filteredClaims = activeFilter === 0
        ? claims
        : claims.filter(c => c.status === FILTERS[activeFilter]);

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Top bar */}
            <TopBar navigation={navigation} />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <ThemedText variant="overline" color={COLORS.secondary}>Protection Ledger</ThemedText>
                    <ThemedText variant="h1" style={{ fontSize: 32 }}>Claim History</ThemedText>
                </View>

                {/* Summary stats */}
                <View style={styles.statsGrid}>
                    <StatCard label="Active Claims" value={`${summary.pending}`} accent={`${summary.approved} approved`} />
                    <StatCard label="Total Amount" value={`₹${summary.total.toLocaleString()}`} prefix="" />
                </View>

                {/* Filter chips */}
                <FilterChips filters={FILTERS} active={activeFilter} onSelect={setActiveFilter} />

                {/* Claims list */}
                {filteredClaims.length > 0 ? filteredClaims.map((claim: any, i: number) => (
                    <React.Fragment key={claim.id}>
                        <ClaimCard claim={claim} onApprove={() => handleApprove(claim.id)} />
                        {i === 0 && (
                            <AIInsightChip
                                description={`Your approval rate has increased this quarter. Submitting detailed descriptions is driving faster processing times.`}
                                style={{ marginBottom: 16 }}
                            />
                        )}
                    </React.Fragment>
                )) : (
                    <SurfaceCard variant="lowest" style={{ padding: SPACING.xl, alignItems: 'center', marginBottom: SPACING.lg }}>
                        <MaterialIcons name="assignment" size={40} color={COLORS.outlineVariant} />
                        <ThemedText variant="body" color={COLORS.onSurfaceVariant} style={{ textAlign: 'center', marginTop: 12 }}>
                            No claims found
                        </ThemedText>
                        <ThemedText variant="caption" color={COLORS.outlineVariant} style={{ textAlign: 'center', marginTop: 4 }}>
                            File a claim to get started
                        </ThemedText>
                    </SurfaceCard>
                )}

                {/* File new claim button */}
                <TouchableOpacity
                    style={styles.fileClaimBtn}
                    onPress={() => navigation.navigate('FileClaim')}
                    activeOpacity={0.8}
                >
                    <MaterialIcons name="add-circle" size={20} color={COLORS.primary} />
                    <ThemedText variant="body" color={COLORS.primary} style={{ fontWeight: '700', marginLeft: 8 }}>
                        File New Claim
                    </ThemedText>
                </TouchableOpacity>

                <View style={{ height: 100 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

// ─── Sub Components ────────────────────────────────────

function TopBar({ navigation }: { navigation: any }) {
    return (
        <View style={styles.topBar}>
            <View style={styles.topBarLeft}>
                <MaterialIcons name="security" size={24} color={COLORS.primary} />
                <ThemedText variant="h3" color={COLORS.primary} style={{ letterSpacing: -1 }}>Helion</ThemedText>
            </View>
            <TouchableOpacity style={styles.avatar} onPress={() => navigation.navigate('Account')}>
                <MaterialIcons name="person" size={20} color={COLORS.onSurface} />
            </TouchableOpacity>
        </View>
    );
}

function StatCard({ label, value, accent, prefix }: {
    label: string; value: string; accent?: string; prefix?: string;
}) {
    return (
        <SurfaceCard variant="default" style={styles.statCard}>
            <ThemedText variant="overline" color={COLORS.onSurfaceVariant}>{label}</ThemedText>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', marginTop: 8 }}>
                {prefix !== undefined && (
                    <ThemedText variant="caption" color={COLORS.onSurfaceVariant}>{prefix}</ThemedText>
                )}
                <ThemedText variant="h2" style={{ fontSize: 28, letterSpacing: -1.5 }}>{value}</ThemedText>
                {accent && (
                    <ThemedText variant="caption" color={COLORS.secondary} style={{ marginLeft: 8, fontWeight: '700' }}>
                        {accent}
                    </ThemedText>
                )}
            </View>
        </SurfaceCard>
    );
}

function FilterChips({ filters, active, onSelect }: {
    filters: string[]; active: number; onSelect: (i: number) => void;
}) {
    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow} contentContainerStyle={{ gap: 8 }}>
            {filters.map((f, i) => (
                <TouchableOpacity
                    key={f}
                    style={[styles.filterChip, i === active && styles.filterChipActive]}
                    onPress={() => onSelect(i)}
                >
                    <ThemedText
                        variant="overline"
                        color={i === active ? COLORS.onPrimary : COLORS.onSurfaceVariant}
                        style={{ fontWeight: '700' }}
                    >
                        {f}
                    </ThemedText>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
}

function ClaimCard({ claim, onApprove }: { claim: any; onApprove?: () => void }) {
    const statusLower = (claim.status || '').toLowerCase();
    const iconBg = statusLower === 'approved' ? 'rgba(128, 217, 164, 0.1)' :
                   statusLower === 'pending' ? 'rgba(206, 189, 255, 0.1)' :
                   'rgba(147, 0, 10, 0.15)';
    const iconColor = statusLower === 'approved' ? COLORS.secondary :
                      statusLower === 'pending' ? COLORS.primary :
                      COLORS.error;
    const iconName: keyof typeof MaterialIcons.glyphMap = claim.icon === '🏍️' ? 'two-wheeler' :
                    claim.icon === '🏥' ? 'local-hospital' :
                    claim.icon === '📱' ? 'phone-android' : 'receipt';

    return (
        <SurfaceCard variant="lowest" style={styles.claimCard}>
            <View style={styles.claimTop}>
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                    <View style={[styles.claimIcon, { backgroundColor: iconBg }]}>
                        <MaterialIcons name={iconName} size={22} color={iconColor} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <ThemedText variant="h3" style={{ fontSize: 18 }}>{claim.title}</ThemedText>
                        <ThemedText variant="caption">ID: {claim.id?.substring(0, 8)}</ThemedText>
                    </View>
                </View>
                <StatusBadge status={statusLower} />
            </View>
            <View style={styles.claimBottom}>
                <View>
                    <ThemedText variant="overline" color={COLORS.onSurfaceVariant}>Date Filed</ThemedText>
                    <ThemedText variant="body" style={{ fontWeight: '500', marginTop: 2 }}>{claim.date}</ThemedText>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                    <ThemedText variant="overline" color={COLORS.onSurfaceVariant}>
                        {statusLower === 'rejected' ? 'Value' : 'Payout'}
                    </ThemedText>
                    <ThemedText
                        variant="h3"
                        color={statusLower === 'rejected' ? COLORS.outlineVariant : COLORS.primary}
                        style={[
                            { fontSize: 20, marginTop: 2 },
                            statusLower === 'rejected' ? { textDecorationLine: 'line-through' as const } : {},
                        ]}
                    >
                        ₹{claim.amount?.toLocaleString()}
                    </ThemedText>
                </View>
            </View>

            {/* 🛠️ DEMO MODE APPROVAL BUTTON */}
            {statusLower === 'pending' && (
                <TouchableOpacity
                    onPress={onApprove}
                    style={{
                        marginTop: 16,
                        padding: 10,
                        backgroundColor: 'rgba(76, 175, 80, 0.1)',
                        borderRadius: 8,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderWidth: 1,
                        borderColor: 'rgba(76, 175, 80, 0.2)'
                    }}
                >
                    <MaterialIcons name="check-circle" size={16} color="#4CAF50" style={{ marginRight: 6 }} />
                    <ThemedText color="#4CAF50" style={{ fontWeight: '700', fontSize: 12 }}>ADMIN: APPROVE CLAIM</ThemedText>
                </TouchableOpacity>
            )}
        </SurfaceCard>
    );
}

// ─── Styles ────────────────────────────────────────────

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    topBar: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: SPACING.lg, paddingVertical: 12,
    },
    topBarLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    avatar: {
        width: 32, height: 32, borderRadius: 16,
        backgroundColor: COLORS.surfaceContainerHighest,
        justifyContent: 'center', alignItems: 'center',
    },
    scrollContent: { paddingHorizontal: SPACING.lg },
    header: { marginBottom: SPACING.lg },
    statsGrid: { flexDirection: 'row', gap: 12, marginBottom: SPACING.xl },
    statCard: { flex: 1, height: 120, justifyContent: 'space-between' },
    filterRow: { marginBottom: SPACING.xl },
    filterChip: {
        backgroundColor: COLORS.surfaceContainerHighest,
        paddingHorizontal: 16, paddingVertical: 8,
        borderRadius: BORDER_RADIUS.round,
    },
    filterChipActive: {
        backgroundColor: COLORS.primary,
    },
    claimCard: { marginBottom: 16, padding: SPACING.lg },
    claimTop: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
        marginBottom: 16,
    },
    claimIcon: {
        width: 48, height: 48, borderRadius: 12,
        justifyContent: 'center', alignItems: 'center', marginRight: 12,
    },
    claimBottom: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end',
        paddingTop: 16, borderTopWidth: 1, borderTopColor: 'rgba(73, 69, 82, 0.1)',
    },
    fileClaimBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        paddingVertical: 16, marginTop: 8,
    },
});
