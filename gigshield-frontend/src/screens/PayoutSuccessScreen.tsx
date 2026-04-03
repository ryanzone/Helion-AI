import React from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, GRADIENTS, SPACING, BORDER_RADIUS } from '../constants/Theme';
import { ThemedText } from '../components/core/ThemedText';
import { SurfaceCard } from '../components/core/SurfaceCard';

export default function PayoutSuccessScreen({ route, navigation }: any) {
    const { amount = 450, type = 'Payment' } = route.params || {};
    
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />

            <View style={styles.content}>
                {/* Success icon with glow */}
                <SuccessIcon />

                {/* Hero text */}
                <ThemedText variant="h1" style={styles.title}>
                    Payout Successful
                </ThemedText>
                <ThemedText variant="body" color={COLORS.onSurfaceVariant} style={styles.subtitle}>
                    Your {type.toLowerCase()} of{' '}
                    <ThemedText variant="body" style={{ fontWeight: '700' }}>₹{amount}</ThemedText>
                    {' '}has been sent to your primary account.
                </ThemedText>

                {/* Transaction details */}
                <TransactionDetails amount={amount} />

                {/* Done button */}
                <TouchableOpacity
                    activeOpacity={0.85}
                    style={styles.doneBtn}
                    onPress={() => navigation.navigate('MainTabs')}
                >
                    <LinearGradient
                        colors={GRADIENTS.editorial as any}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.doneBtnGradient}
                    >
                        <ThemedText variant="body" color={COLORS.onPrimary} style={{ fontWeight: '700', fontSize: 16 }}>
                            Done
                        </ThemedText>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

// ─── Sub Components ────────────────────────────────────

function SuccessIcon() {
    return (
        <View style={styles.iconWrapper}>
            {/* Glow */}
            <View style={styles.iconGlow} />
            <View style={styles.iconCircle}>
                <MaterialIcons name="check-circle" size={56} color={COLORS.secondary} />
            </View>
        </View>
    );
}

function TransactionDetails({ amount }: { amount: number }) {
    const details: { label: string; value: string; icon?: any; highlight?: boolean }[] = [
        { label: 'Transaction ID', value: `#TXN-${Math.floor(Math.random() * 90000) + 10000}-GS` },
        { label: 'Amount', value: `₹${amount}` },
        { label: 'Est. Arrival', value: 'Instant (GigShield Priority)', highlight: true },
    ];

    return (
        <SurfaceCard variant="low" style={styles.detailsCard}>
            {details.map((d, i) => (
                <View key={d.label} style={[styles.detailRow, i < details.length - 1 && styles.detailRowBorder]}>
                    <ThemedText variant="overline" color={COLORS.onSurfaceVariant}>{d.label}</ThemedText>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        {d.icon && <MaterialIcons name={d.icon} size={14} color={COLORS.secondary} />}
                        <ThemedText
                            variant="caption"
                            color={d.highlight ? COLORS.secondary : COLORS.onSurface}
                            style={d.highlight ? { fontWeight: '600' } : {}}
                        >
                            {d.value}
                        </ThemedText>
                    </View>
                </View>
            ))}
        </SurfaceCard>
    );
}

// ─── Styles ────────────────────────────────────────────

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    content: {
        flex: 1, justifyContent: 'center', alignItems: 'center',
        paddingHorizontal: SPACING.xl,
    },
    iconWrapper: { position: 'relative', marginBottom: SPACING.xl },
    iconGlow: {
        position: 'absolute', top: -20, left: -20, right: -20, bottom: -20,
        backgroundColor: 'rgba(128, 217, 164, 0.15)', borderRadius: 999,
    },
    iconCircle: {
        width: 128, height: 128, borderRadius: 64,
        backgroundColor: COLORS.secondaryContainer,
        justifyContent: 'center', alignItems: 'center',
    },
    title: {
        fontSize: 32, textAlign: 'center', marginBottom: 12,
    },
    subtitle: {
        fontSize: 16, textAlign: 'center', lineHeight: 24, maxWidth: 280,
        marginBottom: SPACING.xl,
    },
    detailsCard: {
        width: '100%', padding: SPACING.lg,
        borderWidth: 1, borderColor: 'rgba(73, 69, 82, 0.1)',
        marginBottom: SPACING.xxl,
    },
    detailRow: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingVertical: 16,
    },
    detailRowBorder: {
        borderBottomWidth: 1, borderBottomColor: 'rgba(73, 69, 82, 0.1)',
    },
    doneBtn: {
        width: '100%', borderRadius: BORDER_RADIUS.lg, overflow: 'hidden',
    },
    doneBtnGradient: {
        paddingVertical: 16, alignItems: 'center', justifyContent: 'center',
    },
});
