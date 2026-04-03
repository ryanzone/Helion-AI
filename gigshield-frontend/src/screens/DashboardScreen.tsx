import React, { useEffect, useState } from 'react';
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
import { useStore } from '../store/store';
import { COLORS, GRADIENTS, SPACING, BORDER_RADIUS } from '../constants/Theme';
import { ThemedText } from '../components/core/ThemedText';
import { SurfaceCard } from '../components/core/SurfaceCard';
import { AIInsightChip } from '../components/core/AIInsightChip';
import { api } from '../services/api';

export default function DashboardScreen({ navigation }: any) {
    const user = useStore((state) => state.user);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<any>(null);
    const [recentPayouts, setRecentPayouts] = useState<any[]>([]);
    const [coverage, setCoverage] = useState<any[]>([]);

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            const data = await api.getDashboard();
            setStats(data.stats);
            setRecentPayouts(data.recentPayouts || []);
            setCoverage(data.coverage || []);
        } catch (e) {
            console.log('Dashboard load error:', e);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </SafeAreaView>
        );
    }

    const totalPayouts = recentPayouts.reduce((sum: number, p: any) => sum + (p.amount || 0), 0);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Top App Bar */}
            <View style={styles.topBar}>
                <View style={styles.topBarLeft}>
                    <MaterialIcons name="security" size={24} color={COLORS.primary} />
                    <ThemedText variant="h3" color={COLORS.primary} style={{ letterSpacing: -1 }}>
                        Helion
                    </ThemedText>
                </View>
                <View style={styles.topBarRight}>
                    <TouchableOpacity>
                        <MaterialIcons name="notifications" size={24} color={`${COLORS.onSurface}99`} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.avatar} onPress={() => navigation.navigate('Account')}>
                        <MaterialIcons name="person" size={20} color={COLORS.onSurface} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Hero Section: Pro Active Status */}
                <HeroCard navigation={navigation} planName={stats?.activePlan || 'Pro Active'} />

                {/* Bento Grid: Stats */}
                <View style={styles.bentoGrid}>
                    <MetricCard icon="trending-up" label="Total Earnings" value={`₹${stats?.totalEarnings?.toLocaleString() || '0'}`} unit="" status="All Time" />
                    <MetricCard icon="shield" label="Safety Score" value={`${stats?.safetyScore || 0}`} unit="/100" status="Current" />
                </View>

                {/* Recent Payouts Card */}
                <RecentPayoutsCard total={totalPayouts} payouts={recentPayouts} />

                {/* AI Insights */}
                <AIInsightChip
                    description="Based on your activity, you could increase your hourly earnings by switching to 'Peak Protection' during evening shifts."
                    style={{ marginBottom: SPACING.xl }}
                />

                {/* Activity Ledger */}
                <View style={styles.sectionHeader}>
                    <ThemedText variant="h3">Activity Ledger</ThemedText>
                    <TouchableOpacity onPress={() => navigation.navigate('WorkerActivity')}>
                        <ThemedText variant="caption" color={COLORS.primary} style={{ fontWeight: '600' }}>
                            View All
                        </ThemedText>
                    </TouchableOpacity>
                </View>

                {recentPayouts.length > 0 ? recentPayouts.map((p: any, i: number) => (
                    <LedgerItem
                        key={p.id || i}
                        icon={p.icon === '💰' ? 'account-balance-wallet' : p.icon === '🏥' ? 'local-hospital' : 'receipt-long'}
                        title={p.type}
                        subtitle={`${p.date} • ${p.status}`}
                        amount={`₹${p.amount?.toLocaleString()}`}
                        status={p.status}
                        statusColor={p.status === 'Completed' ? COLORS.secondary : COLORS.onSurfaceVariant}
                    />
                )) : (
                    <SurfaceCard variant="lowest" style={{ padding: SPACING.xl, alignItems: 'center', marginBottom: SPACING.lg }}>
                        <MaterialIcons name="inbox" size={40} color={COLORS.outlineVariant} />
                        <ThemedText variant="body" color={COLORS.onSurfaceVariant} style={{ textAlign: 'center', marginTop: 12 }}>
                            No recent activity
                        </ThemedText>
                        <ThemedText variant="caption" color={COLORS.outlineVariant} style={{ textAlign: 'center', marginTop: 4 }}>
                            Your transactions will appear here
                        </ThemedText>
                    </SurfaceCard>
                )}

                <View style={{ height: 100 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

// ─── Sub Components ────────────────────────────────────────

function HeroCard({ navigation, planName }: { navigation: any; planName: string }) {
    return (
        <TouchableOpacity activeOpacity={0.95} style={styles.heroWrapper}>
            <LinearGradient
                colors={['rgba(206, 189, 255, 0.1)', 'transparent'] as any}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.heroCard}
            >
                <View style={styles.heroContent}>
                    <View style={{ flex: 1 }}>
                        <ThemedText variant="overline" color={COLORS.primary}>
                            Current Subscription
                        </ThemedText>
                        <ThemedText variant="h1" style={{ fontSize: 42, marginTop: 4 }}>
                            {planName}
                        </ThemedText>
                        <ThemedText variant="body" color={COLORS.onSurfaceVariant} style={{ marginTop: 8, maxWidth: 280 }}>
                            Your digital ledger is synced and secured. Premium protection is active.
                        </ThemedText>
                    </View>
                </View>
                <TouchableOpacity
                    style={styles.managePlanBtn}
                    onPress={() => navigation.navigate('PlanSelection')}
                    activeOpacity={0.85}
                >
                    <LinearGradient
                        colors={GRADIENTS.primary as any}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.managePlanGradient}
                    >
                        <MaterialIcons name="bolt" size={18} color={COLORS.onPrimary} />
                        <ThemedText variant="body" color={COLORS.onPrimary} style={{ fontWeight: '700', marginLeft: 6 }}>
                            Manage Plan
                        </ThemedText>
                    </LinearGradient>
                </TouchableOpacity>
            </LinearGradient>
        </TouchableOpacity>
    );
}

function MetricCard({ icon, label, value, unit, status }: {
    icon: keyof typeof MaterialIcons.glyphMap;
    label: string;
    value: string;
    unit: string;
    status: string;
}) {
    return (
        <SurfaceCard variant="low" style={styles.metricCard}>
            <View style={styles.metricTop}>
                <View style={styles.metricIconBox}>
                    <MaterialIcons name={icon} size={22} color={COLORS.primary} />
                </View>
                <ThemedText variant="overline" color={COLORS.secondary} style={{ fontWeight: '700' }}>
                    {status}
                </ThemedText>
            </View>
            <View style={styles.metricBottom}>
                <ThemedText variant="overline" color={COLORS.onSurfaceVariant}>
                    {label}
                </ThemedText>
                <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                    <ThemedText variant="h1" style={{ fontSize: 36 }}>{value}</ThemedText>
                    {unit ? <ThemedText variant="h3" color={COLORS.onSurfaceVariant} style={{ marginLeft: 2 }}>
                        {unit}
                    </ThemedText> : null}
                </View>
            </View>
        </SurfaceCard>
    );
}

function RecentPayoutsCard({ total, payouts }: { total: number; payouts: any[] }) {
    const hasPayouts = payouts.length > 0;
    const progressWidth = hasPayouts ? `${Math.min((payouts.length / 10) * 100, 100)}%` : '0%';

    return (
        <SurfaceCard variant="default" style={styles.payoutsCard}>
            <View style={styles.payoutsTop}>
                <View>
                    <ThemedText variant="overline" color={COLORS.onSurfaceVariant}>
                        Recent Payouts
                    </ThemedText>
                    <ThemedText variant="h2" color={hasPayouts ? COLORS.primary : COLORS.onSurfaceVariant} style={{ marginTop: 4 }}>
                        {hasPayouts ? `₹${total.toLocaleString()}` : '₹0'}
                    </ThemedText>
                </View>
                <TouchableOpacity style={styles.arrowBtn}>
                    <MaterialIcons name="arrow-outward" size={22} color={COLORS.onSurfaceVariant} />
                </TouchableOpacity>
            </View>
            <View style={styles.payoutsBottom}>
                <View style={styles.payoutsTrend}>
                    <ThemedText variant="caption" color={COLORS.onSurfaceVariant}>
                        {hasPayouts ? `${payouts.length} payouts` : 'No payouts yet'}
                    </ThemedText>
                    {hasPayouts && (
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                            <MaterialIcons name="trending-up" size={14} color={COLORS.secondary} />
                            <ThemedText variant="caption" color={COLORS.secondary} style={{ fontWeight: '700' }}>
                                Active
                            </ThemedText>
                        </View>
                    )}
                </View>
                <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: progressWidth as any }]} />
                </View>
            </View>
        </SurfaceCard>
    );
}

function LedgerItem({ icon, title, subtitle, amount, status, statusColor }: {
    icon: keyof typeof MaterialIcons.glyphMap;
    title: string;
    subtitle: string;
    amount: string;
    status: string;
    statusColor: string;
}) {
    return (
        <TouchableOpacity style={styles.ledgerItem} activeOpacity={0.7}>
            <View style={styles.ledgerIcon}>
                <MaterialIcons name={icon} size={22} color={COLORS.onSurface} />
            </View>
            <View style={{ flex: 1 }}>
                <ThemedText variant="body" style={{ fontWeight: '600' }}>{title}</ThemedText>
                <ThemedText variant="caption">{subtitle}</ThemedText>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
                <ThemedText variant="body" style={{ fontWeight: '700' }}>{amount}</ThemedText>
                <ThemedText variant="overline" color={statusColor}>{status}</ThemedText>
            </View>
        </TouchableOpacity>
    );
}

// ─── Styles ────────────────────────────────────────────────

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.lg,
        paddingVertical: 12,
    },
    topBarLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    topBarRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: COLORS.surfaceContainerHighest,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(73, 69, 82, 0.15)',
    },
    scrollContent: {
        paddingHorizontal: SPACING.lg,
    },
    heroWrapper: {
        marginBottom: SPACING.xl,
    },
    heroCard: {
        borderRadius: BORDER_RADIUS.xxl,
        padding: SPACING.xl,
        borderWidth: 1,
        borderColor: 'rgba(73, 69, 82, 0.1)',
        overflow: 'hidden',
    },
    heroContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SPACING.lg,
    },
    managePlanBtn: {
        alignSelf: 'flex-start',
        borderRadius: BORDER_RADIUS.lg,
        overflow: 'hidden',
    },
    managePlanGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20,
    },
    bentoGrid: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: SPACING.lg,
    },
    metricCard: {
        flex: 1,
        height: 180,
        justifyContent: 'space-between',
    },
    metricTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    metricIconBox: {
        padding: 8,
        backgroundColor: COLORS.surfaceContainer,
        borderRadius: 10,
    },
    metricBottom: {},
    payoutsCard: {
        marginBottom: SPACING.xl,
        minHeight: 160,
        justifyContent: 'space-between',
    },
    payoutsTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    arrowBtn: {
        padding: 8,
        borderRadius: 20,
    },
    payoutsBottom: {
        marginTop: 16,
        gap: 12,
    },
    payoutsTrend: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    progressBar: {
        height: 6,
        backgroundColor: COLORS.surfaceContainerLowest,
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: COLORS.primary,
        borderRadius: 3,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    ledgerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: BORDER_RADIUS.lg,
        marginBottom: 8,
    },
    ledgerIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: COLORS.surfaceContainerHighest,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
});
