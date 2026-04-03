import React, { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    ActivityIndicator,
    Alert,
} from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/Theme';
import { ThemedText } from '../components/core/ThemedText';
import { SurfaceCard } from '../components/core/SurfaceCard';
import { StatusBadge } from '../components/core/StatusBadge';
import { GradientButton } from '../components/core/GradientButton';
import { api } from '../services/api';

export default function EarningsScreen({ navigation }: any) {
    const [earnings, setEarnings] = useState<any[]>([]);
    const [summary, setSummary] = useState<any>({ total: 0, thisWeek: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadEarnings();
    }, []);

    const loadEarnings = async () => {
        try {
            const data = await api.getEarnings();
            setEarnings(data.earnings || []);
            setSummary(data.summary || { total: 0, thisWeek: 0 });
        } catch (e) {
            console.log('Earnings load error:', e);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadReport = async () => {
        try {
            const html = `
            <html>
                <body style="font-family: sans-serif; padding: 20px;">
                    <h1>Helion Earnings Report</h1>
                    <h2>Summary</h2>
                    <p><strong>Total Earnings:</strong> ₹${summary.total}</p>
                    <p><strong>This Week:</strong> ₹${summary.thisWeek}</p>
                    <h2>Transactions</h2>
                    <table border="1" style="border-collapse: collapse; width: 100%;">
                        <tr><th>Date</th><th>Type</th><th>Status</th><th>Amount</th></tr>
                        ${earnings.map(e => `
                        <tr>
                            <td>${e.date}</td>
                            <td>${e.type}</td>
                            <td>${e.status}</td>
                            <td>₹${e.amount}</td>
                        </tr>`).join('')}
                    </table>
                </body>
            </html>
            `;
            const { uri } = await Print.printToFileAsync({ html });
            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(uri);
            } else {
                Alert.alert('Report Ready', 'Saved to: ' + uri);
            }
        } catch (e) {
            Alert.alert('Error', 'Failed to generate report');
        }
    };

    const renderItem = ({ item }: { item: any }) => (
        <EarningCard item={item} />
    );

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
            <View style={styles.topBar}>
                <View style={styles.topBarLeft}>
                    <MaterialIcons name="security" size={24} color={COLORS.primary} />
                    <ThemedText variant="h3" color={COLORS.primary} style={{ letterSpacing: -1 }}>Helion</ThemedText>
                </View>
                <TouchableOpacity style={styles.avatar} onPress={() => navigation.navigate('Account')}>
                    <MaterialIcons name="person" size={18} color={COLORS.onSurface} />
                </TouchableOpacity>
            </View>

            {/* Header */}
            <View style={styles.header}>
                <View>
                    <ThemedText variant="overline" color={COLORS.secondary}>Financial Ledger</ThemedText>
                    <ThemedText variant="h1" style={{ fontSize: 32 }}>Earnings</ThemedText>
                </View>
            </View>

            {/* Summary */}
            <View style={styles.summaryRow}>
                <SummaryCard label="Total Earnings" amount={`₹${summary.total.toLocaleString()}`} trend="+12.4%" />
                <SummaryCard label="This Week" amount={`₹${summary.thisWeek.toLocaleString()}`} />
            </View>

            {/* Earnings list */}
            <FlatList
                data={earnings}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={{ padding: SPACING.xl, alignItems: 'center' }}>
                        <MaterialIcons name="account-balance-wallet" size={40} color={COLORS.outlineVariant} />
                        <ThemedText variant="body" color={COLORS.onSurfaceVariant} style={{ textAlign: 'center', marginTop: 12 }}>
                            No earnings yet
                        </ThemedText>
                        <ThemedText variant="caption" color={COLORS.outlineVariant} style={{ textAlign: 'center', marginTop: 4 }}>
                            Your earnings will appear here
                        </ThemedText>
                    </View>
                }
            />

            {/* Footer */}
            <View style={styles.footer}>
                <GradientButton
                    title="Download Report"
                    onPress={handleDownloadReport}
                    icon="download"
                    variant="surface"
                />
            </View>
        </SafeAreaView>
    );
}

// ─── Sub Components ────────────────────────────────────

function SummaryCard({ label, amount, trend }: { label: string; amount: string; trend?: string }) {
    return (
        <SurfaceCard variant="default" style={styles.summaryCard}>
            <ThemedText variant="overline" color={COLORS.onSurfaceVariant}>{label}</ThemedText>
            <View style={{ marginTop: 8 }}>
                <ThemedText variant="h2" color={COLORS.primary} style={{ fontSize: 24 }}>{amount}</ThemedText>
                {trend && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
                        <MaterialIcons name="trending-up" size={14} color={COLORS.secondary} />
                        <ThemedText variant="overline" color={COLORS.secondary} style={{ fontWeight: '700' }}>
                            {trend}
                        </ThemedText>
                    </View>
                )}
            </View>
        </SurfaceCard>
    );
}

function EarningCard({ item }: { item: any }) {
    const iconName: keyof typeof MaterialIcons.glyphMap =
        item.icon === '🚀' ? 'rocket-launch' :
        item.icon === '💰' ? 'account-balance-wallet' :
        item.icon === '🎁' ? 'card-giftcard' :
        item.icon === '⚡' ? 'bolt' : 'payments';
    const color = item.status === 'Credited' ? COLORS.secondary : COLORS.onSurfaceVariant;
    const statusLower = (item.status || 'completed').toLowerCase();

    return (
        <TouchableOpacity activeOpacity={0.7} style={styles.earningCard}>
            <View style={[styles.earningIcon, { backgroundColor: `${color}1A` }]}>
                <MaterialIcons name={iconName} size={22} color={color} />
            </View>
            <View style={{ flex: 1 }}>
                <ThemedText variant="body" style={{ fontWeight: '600' }}>{item.type}</ThemedText>
                <ThemedText variant="caption">{item.date}</ThemedText>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
                <ThemedText variant="h3" style={{ fontSize: 16 }} color={COLORS.onSurface}>
                    ₹{item.amount?.toLocaleString()}
                </ThemedText>
                <StatusBadge status={statusLower === 'credited' ? 'approved' : statusLower} />
            </View>
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
    topBarLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    avatar: {
        width: 32, height: 32, borderRadius: 16,
        backgroundColor: COLORS.surfaceContainerHighest,
        justifyContent: 'center', alignItems: 'center',
    },
    header: {
        paddingHorizontal: SPACING.lg, marginBottom: SPACING.lg,
    },
    summaryRow: {
        flexDirection: 'row', gap: 12,
        paddingHorizontal: SPACING.lg, marginBottom: SPACING.lg,
    },
    summaryCard: { flex: 1, height: 120, justifyContent: 'space-between' },
    listContent: {
        paddingHorizontal: SPACING.lg,
        paddingBottom: 150,
    },
    earningCard: {
        flexDirection: 'row', alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1, borderBottomColor: 'rgba(73, 69, 82, 0.05)',
    },
    earningIcon: {
        width: 48, height: 48, borderRadius: 12,
        justifyContent: 'center', alignItems: 'center', marginRight: 16,
    },
    footer: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: SPACING.lg, paddingBottom: 100,
    },
});
