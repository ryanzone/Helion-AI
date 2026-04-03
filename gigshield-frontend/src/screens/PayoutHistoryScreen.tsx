import React, { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    SafeAreaView,
    StatusBar,
    Platform,
    ActivityIndicator,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, GRADIENTS, SPACING, BORDER_RADIUS } from '../constants/Theme';
import { ThemedText } from '../components/core/ThemedText';
import { GlassCard } from '../components/core/GlassCard';
import { GradientButton } from '../components/core/GradientButton';
import { api } from '../services/api';

export default function PayoutHistoryScreen() {
    const [payouts, setPayouts] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPayouts();
    }, []);

    const loadPayouts = async () => {
        try {
            const data = await api.getPayouts();
            setPayouts(data.payouts || []);
            setTotal(data.total || 0);
        } catch (e) {
            console.log('Payouts load error:', e);
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

    const getGradient = (type: string) => {
        if (type?.includes('Claim') || type?.includes('Reimbursement')) return GRADIENTS.primary;
        if (type?.includes('Bonus')) return GRADIENTS.success;
        return GRADIENTS.secondary;
    };

    const getIcon = (icon: string) => {
        if (icon === '💰') return 'cash-outline';
        if (icon === '🏥') return 'medkit-outline';
        if (icon === '🎉') return 'gift-outline';
        return 'shield-checkmark-outline';
    };

    const renderItem = ({ item }: { item: any }) => (
        <GlassCard style={styles.payoutCard}>
            <View style={styles.payoutHeader}>
                <LinearGradient 
                    colors={getGradient(item.type) as any}
                    style={styles.iconCircle}
                >
                    <Ionicons 
                        name={getIcon(item.icon) as any} 
                        size={20} 
                        color="#FFF" 
                    />
                </LinearGradient>
                <View style={styles.payoutInfo}>
                    <ThemedText variant="h3" style={{ fontSize: 16 }}>{item.type}</ThemedText>
                    <ThemedText variant="caption" color={COLORS.textMuted}>{item.date}</ThemedText>
                </View>
                <View style={styles.amountContainer}>
                    <ThemedText variant="h3" style={{ fontSize: 16 }}>₹{item.amount?.toLocaleString()}</ThemedText>
                    <View style={styles.statusBadge}>
                        <View style={styles.statusDot} />
                        <ThemedText variant="caption" color={COLORS.success} style={{ fontWeight: 'bold' }}>{item.status}</ThemedText>
                    </View>
                </View>
            </View>
        </GlassCard>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            <LinearGradient
                colors={[COLORS.background, '#0A1428'] as any}
                style={StyleSheet.absoluteFill}
            />

            <View style={styles.header}>
                <ThemedText variant="h1">Payout History</ThemedText>
                <GlassCard style={styles.summaryCard} gradient>
                    <ThemedText variant="caption" color="rgba(255,255,255,0.7)">Total Protected Payouts</ThemedText>
                    <ThemedText variant="h2" style={{ color: '#FFF', fontSize: 28, marginTop: 4 }}>₹{total.toLocaleString()}</ThemedText>
                </GlassCard>
            </View>

            <FlatList
                data={payouts}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={{ padding: SPACING.xl, alignItems: 'center' }}>
                        <MaterialIcons name="payments" size={40} color={COLORS.outlineVariant} />
                        <ThemedText variant="body" color={COLORS.onSurfaceVariant} style={{ textAlign: 'center', marginTop: 12 }}>
                            No payouts yet
                        </ThemedText>
                        <ThemedText variant="caption" color={COLORS.outlineVariant} style={{ textAlign: 'center', marginTop: 4 }}>
                            Your payouts will appear here
                        </ThemedText>
                    </View>
                }
            />

            <View style={styles.footer}>
                <GradientButton
                    title="Download Yearly Report"
                    onPress={() => {}}
                    variant="primary"
                    style={styles.footerBtn}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        padding: SPACING.lg,
        paddingBottom: SPACING.md,
    },
    summaryCard: {
        marginTop: SPACING.lg,
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.lg,
    },
    listContent: {
        padding: SPACING.lg,
        paddingBottom: 150,
    },
    payoutCard: {
        padding: SPACING.md,
        marginBottom: SPACING.md,
    },
    payoutHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.md,
    },
    payoutInfo: {
        flex: 1,
    },
    amountContainer: {
        alignItems: 'flex-end',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 255, 136, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
        marginTop: 4,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: COLORS.success,
        marginRight: 6,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: SPACING.lg,
        paddingBottom: Platform.OS === 'ios' ? 40 : SPACING.lg,
        backgroundColor: 'transparent',
    },
    footerBtn: {
    },
});
