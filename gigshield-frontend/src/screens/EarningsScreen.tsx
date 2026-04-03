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
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { COLORS, SPACING } from '../constants/Theme';
import { ThemedText } from '../components/core/ThemedText';
import { SurfaceCard } from '../components/core/SurfaceCard';
import { StatusBadge } from '../components/core/StatusBadge';
import { GradientButton } from '../components/core/GradientButton';
import { api } from '../services/api';

export default function EarningsScreen({ navigation }: any) {
    const [earnings, setEarnings] = useState<any[]>([]);
    const [summary, setSummary] = useState<any>({ total: 0, thisWeek: 0 });
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);

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

    const generatePDFReport = async () => {
        setDownloading(true);
        try {
            const today = new Date().toLocaleDateString('en-IN', {
                day: '2-digit', month: 'long', year: 'numeric',
            });

            const tableRows = earnings.map((item) => {
                const statusColor = item.status === 'Credited' ? '#00C896' : '#888';
                return `
                    <tr>
                        <td>${item.type || '—'}</td>
                        <td>${item.date || '—'}</td>
                        <td style="font-weight:600;">&#8377;${(item.amount || 0).toLocaleString()}</td>
                        <td><span style="color:${statusColor}; font-weight:600;">${item.status || '—'}</span></td>
                    </tr>
                `;
            }).join('');

            const html = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8" />
                    <style>
                        * { margin: 0; padding: 0; box-sizing: border-box; }
                        body {
                            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                            background: #ffffff;
                            color: #1C1B1F;
                            padding: 40px;
                        }

                        /* Header */
                        .header {
                            display: flex;
                            justify-content: space-between;
                            align-items: flex-start;
                            margin-bottom: 32px;
                            padding-bottom: 24px;
                            border-bottom: 2px solid #E6E1E5;
                        }
                        .brand {
                            display: flex;
                            align-items: center;
                            gap: 10px;
                        }
                        .brand-dot {
                            width: 12px;
                            height: 12px;
                            background: #7C5CBF;
                            border-radius: 50%;
                        }
                        .brand-name {
                            font-size: 22px;
                            font-weight: 700;
                            color: #7C5CBF;
                            letter-spacing: -0.5px;
                        }
                        .report-meta { text-align: right; }
                        .report-meta h1 {
                            font-size: 28px;
                            font-weight: 800;
                            letter-spacing: -1px;
                            color: #1C1B1F;
                        }
                        .report-meta p {
                            font-size: 12px;
                            color: #79747E;
                            margin-top: 4px;
                        }

                        /* Summary cards */
                        .summary-grid {
                            display: grid;
                            grid-template-columns: 1fr 1fr;
                            gap: 16px;
                            margin-bottom: 32px;
                        }
                        .summary-card {
                            background: #F7F2FA;
                            border-radius: 16px;
                            padding: 20px 24px;
                            border: 1px solid #E6E1E5;
                        }
                        .summary-card .label {
                            font-size: 11px;
                            font-weight: 600;
                            letter-spacing: 0.8px;
                            text-transform: uppercase;
                            color: #79747E;
                            margin-bottom: 8px;
                        }
                        .summary-card .amount {
                            font-size: 28px;
                            font-weight: 800;
                            color: #7C5CBF;
                            letter-spacing: -1px;
                        }
                        .summary-card .trend {
                            font-size: 12px;
                            font-weight: 600;
                            color: #00C896;
                            margin-top: 6px;
                        }

                        /* Table */
                        .section-title {
                            font-size: 13px;
                            font-weight: 700;
                            letter-spacing: 0.8px;
                            text-transform: uppercase;
                            color: #79747E;
                            margin-bottom: 12px;
                        }
                        table {
                            width: 100%;
                            border-collapse: collapse;
                            font-size: 13px;
                        }
                        thead tr {
                            background: #1C1B1F;
                            color: #ffffff;
                        }
                        thead th {
                            padding: 12px 16px;
                            text-align: left;
                            font-weight: 600;
                            font-size: 12px;
                            letter-spacing: 0.3px;
                        }
                        thead th:first-child { border-radius: 8px 0 0 8px; }
                        thead th:last-child { border-radius: 0 8px 8px 0; }
                        tbody tr { border-bottom: 1px solid #F0EBF4; }
                        tbody tr:last-child { border-bottom: none; }
                        tbody td {
                            padding: 14px 16px;
                            color: #1C1B1F;
                            vertical-align: middle;
                        }
                        tbody tr:nth-child(even) { background: #FAFAFA; }

                        /* Footer */
                        .footer {
                            margin-top: 40px;
                            padding-top: 20px;
                            border-top: 1px solid #E6E1E5;
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                        }
                        .footer p {
                            font-size: 11px;
                            color: #C4BFCA;
                        }
                        .footer .page { font-size: 11px; color: #C4BFCA; }
                    </style>
                </head>
                <body>
                    <!-- Header -->
                    <div class="header">
                        <div class="brand">
                            <div class="brand-dot"></div>
                            <span class="brand-name">GigShield</span>
                        </div>
                        <div class="report-meta">
                            <h1>Earnings Report</h1>
                            <p>Generated on ${today}</p>
                        </div>
                    </div>

                    <!-- Summary -->
                    <div class="summary-grid">
                        <div class="summary-card">
                            <div class="label">Total Earnings</div>
                            <div class="amount">&#8377;${summary.total.toLocaleString()}</div>
                            <div class="trend">&#8599; +12.4% overall</div>
                        </div>
                        <div class="summary-card">
                            <div class="label">This Week</div>
                            <div class="amount">&#8377;${summary.thisWeek.toLocaleString()}</div>
                        </div>
                    </div>

                    <!-- Transactions -->
                    <div class="section-title">Transaction History</div>
                    <table>
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th>Date</th>
                                <th>Amount</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${tableRows || `
                                <tr>
                                    <td colspan="4" style="text-align:center; color:#C4BFCA; padding: 32px;">
                                        No transactions found
                                    </td>
                                </tr>
                            `}
                        </tbody>
                    </table>

                    <!-- Footer -->
                    <div class="footer">
                        <p>GigShield &mdash; Financial Ledger &mdash; Confidential</p>
                        <span class="page">Page 1</span>
                    </div>
                </body>
                </html>
            `;

            // Generate PDF from HTML
            const { uri } = await Print.printToFileAsync({ html, base64: false });

            // Share / save it
            const canShare = await Sharing.isAvailableAsync();
            if (canShare) {
                await Sharing.shareAsync(uri, {
                    mimeType: 'application/pdf',
                    dialogTitle: 'Save Earnings Report',
                    UTI: 'com.adobe.pdf',
                });
            } else {
                Alert.alert('Saved', `PDF saved to: ${uri}`);
            }
        } catch (e) {
            console.log('PDF generation error:', e);
            Alert.alert('Error', 'Failed to generate PDF report.');
        } finally {
            setDownloading(false);
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
                    <ThemedText variant="h3" color={COLORS.primary} style={{ letterSpacing: -1 }}>GigShield</ThemedText>
                </View>
                <View style={styles.avatar}>
                    <MaterialIcons name="person" size={18} color={COLORS.onSurface} />
                </View>
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
                    title={downloading ? 'Generating PDF...' : 'Download Report'}
                    onPress={downloading ? () => { } : generatePDFReport}
                    icon={downloading ? undefined : 'download'}
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