import React, { useState } from 'react';
import * as Location from 'expo-location';
import {
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    TextInput,
    Alert,
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, GRADIENTS, SPACING, BORDER_RADIUS } from '../constants/Theme';
import { ThemedText } from '../components/core/ThemedText';
import { SurfaceCard } from '../components/core/SurfaceCard';
import { AIInsightChip } from '../components/core/AIInsightChip';
import { GradientButton } from '../components/core/GradientButton';
import { api } from '../services/api';

export default function FileClaimScreen({ navigation }: any) {
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [useLocation, setUseLocation] = useState(false);
    const [locationData, setLocationData] = useState<any>(null);

    const handleToggleLocation = async () => {
        if (!useLocation) {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission denied', 'Location permission is required to auto-detect.');
                return;
            }
            setUseLocation(true);
            try {
                const loc = await Location.getCurrentPositionAsync({});
                setLocationData({
                    lat: loc.coords.latitude,
                    lng: loc.coords.longitude
                });
            } catch(e) {
                Alert.alert('Error', 'Failed to get location');
                setUseLocation(false);
            }
        } else {
            setUseLocation(false);
            setLocationData(null);
        }
    };

    const handleSubmitClaim = async () => {
        if (!title || !amount) {
            Alert.alert('Error', 'Please fill in the claim title and amount');
            return;
        }
        setLoading(true);
        try {
            const today = new Date();
            const dateStr = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            await api.fileClaim({
                title,
                amount: parseFloat(amount),
                date: dateStr,
                icon: '🏥',
                details: description,
                location: locationData ? `${locationData.lat},${locationData.lng}` : undefined,
            });
            Alert.alert('Success', 'Your claim has been filed successfully!', [
                { text: 'OK', onPress: () => navigation.goBack() },
            ]);
        } catch (e: any) {
            Alert.alert('Error', e.message || 'Failed to file claim');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Top bar */}
            <View style={styles.topBar}>
                <View style={styles.topBarLeft}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
                        <MaterialIcons name="close" size={24} color={COLORS.onSurface} />
                    </TouchableOpacity>
                    <ThemedText variant="h3" color={COLORS.primary} style={{ fontWeight: '900', letterSpacing: -1 }}>
                        Helion
                    </ThemedText>
                </View>
                <ThemedText variant="overline" color={COLORS.outline}>New Claim</ThemedText>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <ThemedText variant="overline" color={COLORS.secondary}>Incident Details</ThemedText>
                    <ThemedText variant="h1" style={{ fontSize: 32, lineHeight: 38, marginTop: 8 }}>
                        What happened{'\n'}on your shift?
                    </ThemedText>
                    <ThemedText variant="body" color={COLORS.onSurfaceVariant} style={{ marginTop: 12, lineHeight: 22, maxWidth: 320 }}>
                        Provide specific details about the incident. Our AI uses this to expedite your coverage verification.
                    </ThemedText>
                </View>

                {/* Form Card */}
                <SurfaceCard variant="default" style={styles.formCard}>
                    {/* Claim Title */}
                    <FormField label="Claim Title">
                        <TextInput
                            style={styles.input}
                            placeholderTextColor={`${COLORS.onSurfaceVariant}66`}
                            placeholder="e.g. Bike Accident, Medical Expense"
                            value={title}
                            onChangeText={setTitle}
                        />
                    </FormField>

                    {/* Amount */}
                    <FormField label="Claim Amount (₹)">
                        <TextInput
                            style={styles.input}
                            placeholderTextColor={`${COLORS.onSurfaceVariant}66`}
                            placeholder="e.g. 5000"
                            value={amount}
                            onChangeText={setAmount}
                            keyboardType="numeric"
                        />
                    </FormField>

                    {/* Description */}
                    <FormField label="Detailed Account">
                        <TextInput
                            style={[styles.input, { minHeight: 100, textAlignVertical: 'top' }]}
                            placeholderTextColor={`${COLORS.onSurfaceVariant}66`}
                            placeholder="Describe the sequence of events..."
                            multiline
                            value={description}
                            onChangeText={setDescription}
                        />
                    </FormField>

                    {/* AI Tip */}
                    <AIInsightChip
                        variant="compact"
                        description="Include the exact location and any third parties involved for 40% faster processing."
                        style={{ marginBottom: SPACING.lg }}
                    />

                    {/* Location toggle */}
                    <LocationToggle isEnabled={useLocation} onToggle={handleToggleLocation} locationStr={locationData ? `${locationData.lat.toFixed(4)}, ${locationData.lng.toFixed(4)}` : undefined} />
                </SurfaceCard>

                {/* Bento info cards */}
                <View style={styles.bentoRow}>
                    <InfoBentoCard icon="verified-user" title="Active Policy" desc="Policy is protecting this shift." color={COLORS.primary} />
                    <InfoBentoCard icon="speed" title="Rapid Pay" desc="Eligible for instant payout once verified." color={COLORS.secondary} />
                </View>

                {/* Actions */}
                <View style={styles.actions}>
                    <GradientButton
                        title="Submit Claim"
                        onPress={handleSubmitClaim}
                        icon="arrow-forward"
                        loading={loading}
                    />
                    <TouchableOpacity style={styles.saveBtn} onPress={() => navigation.goBack()}>
                        <ThemedText variant="body" color={COLORS.primary} style={{ fontWeight: '500' }}>
                            Cancel
                        </ThemedText>
                    </TouchableOpacity>
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>

            {/* Floating AI Guardian chip */}
            <View style={styles.floatingChip}>
                <View style={styles.floatingChipInner}>
                    <View style={styles.pulseDot} />
                    <ThemedText variant="overline" color={COLORS.onSecondaryContainer} style={{ fontWeight: '700' }}>
                        AI Guardian Active
                    </ThemedText>
                </View>
            </View>
        </SafeAreaView>
    );
}

// ─── Sub Components ────────────────────────────────────

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <View style={styles.formField}>
            <ThemedText variant="overline" color={COLORS.outline} style={{ fontWeight: '700', marginBottom: 8 }}>
                {label}
            </ThemedText>
            {children}
        </View>
    );
}

function LocationToggle({ isEnabled, onToggle, locationStr }: { isEnabled: boolean, onToggle: () => void, locationStr?: string }) {
    return (
        <View style={styles.toggleRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <MaterialIcons name="location-on" size={22} color={COLORS.primary} />
                <View style={{ marginLeft: 12 }}>
                    <ThemedText variant="body" style={{ fontWeight: '700' }}>Auto-detect Location</ThemedText>
                    <ThemedText variant="caption">{locationStr ? locationStr : 'Matches data from your gig app'}</ThemedText>
                </View>
            </View>
            <TouchableOpacity 
                style={[styles.togglePill, { backgroundColor: isEnabled ? COLORS.secondary : COLORS.surfaceContainerHighest, alignItems: isEnabled ? 'flex-end' : 'flex-start' }]}
                onPress={onToggle}
                activeOpacity={0.8}
            >
                <View style={[styles.toggleDot, { backgroundColor: isEnabled ? COLORS.onSecondary : COLORS.onSurfaceVariant }]} />
            </TouchableOpacity>
        </View>
    );
}

function InfoBentoCard({ icon, title, desc, color }: {
    icon: keyof typeof MaterialIcons.glyphMap; title: string; desc: string; color: string;
}) {
    return (
        <SurfaceCard variant="default" style={styles.bentoCard} borderAccent={`${color}1A`}>
            <MaterialIcons name={icon} size={28} color={color} />
            <ThemedText variant="overline" style={{ fontWeight: '700', marginTop: 16 }}>{title}</ThemedText>
            <ThemedText variant="caption" color={COLORS.onSurfaceVariant} style={{ marginTop: 4, lineHeight: 16 }}>
                {desc}
            </ThemedText>
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
    topBarLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    closeBtn: { padding: 4 },
    scrollContent: { paddingHorizontal: SPACING.lg },
    header: { marginBottom: SPACING.xl },
    formCard: { padding: SPACING.xl, marginBottom: SPACING.xl },
    formField: { marginBottom: SPACING.lg },
    input: {
        borderBottomWidth: 2, borderBottomColor: 'rgba(73, 69, 82, 0.3)',
        color: COLORS.onSurface, fontSize: 16, paddingVertical: 16, paddingHorizontal: 0,
    },
    toggleRow: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: COLORS.surfaceContainerLow, borderRadius: 12, padding: 16,
    },
    togglePill: {
        width: 48, height: 24, borderRadius: 12, backgroundColor: COLORS.secondary,
        justifyContent: 'center', alignItems: 'flex-end', paddingHorizontal: 4,
    },
    toggleDot: {
        width: 16, height: 16, borderRadius: 8, backgroundColor: COLORS.onSecondary,
    },
    bentoRow: { flexDirection: 'row', gap: 12, marginBottom: SPACING.xl },
    bentoCard: { flex: 1, aspectRatio: 1, justifyContent: 'space-between' },
    actions: { gap: 12, marginBottom: SPACING.xl },
    saveBtn: { alignItems: 'center', paddingVertical: 12 },
    floatingChip: {
        position: 'absolute', bottom: 24, alignSelf: 'center',
    },
    floatingChipInner: {
        flexDirection: 'row', alignItems: 'center', gap: 8,
        backgroundColor: `${COLORS.secondaryContainer}E6`, paddingHorizontal: 16, paddingVertical: 8,
        borderRadius: BORDER_RADIUS.round, borderWidth: 1, borderColor: 'rgba(128, 217, 164, 0.1)',
    },
    pulseDot: {
        width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.secondary,
    },
});
