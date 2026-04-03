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
import { useStore } from '../store/store';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/Theme';
import { ThemedText } from '../components/core/ThemedText';
import { SurfaceCard } from '../components/core/SurfaceCard';
import { AIInsightChip } from '../components/core/AIInsightChip';
import { api } from '../services/api';

export default function ProfileScreen() {
    const user = useStore((state) => state.user);
    const logout = useStore((state) => state.logout);
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const data = await api.getProfile();
            setProfile(data);
        } catch (e) {
            console.log('Profile load error:', e);
        } finally {
            setLoading(false);
        }
    };

    const displayUser = profile || user;

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
                <ThemedText variant="h3" color={COLORS.primary} style={{ fontWeight: '900', letterSpacing: -1 }}>
                    GigShield
                </ThemedText>
                <View style={styles.topBarRight}>
                    <TouchableOpacity>
                        <MaterialIcons name="notifications" size={24} color={COLORS.onSurface} />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <MaterialIcons name="settings" size={24} color={COLORS.onSurface} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Hero Profile Section */}
                <HeroSection
                    name={displayUser?.name || 'User'}
                    phone={displayUser?.phone || 'N/A'}
                    location={displayUser?.location || 'N/A'}
                />

                {/* Main Grid */}
                <View style={styles.mainGrid}>
                    {/* Side column */}
                    <View style={styles.sideColumn}>
                        <SecurityRating rating={profile?.securityRating || 0} />
                        <QuickActions onLogout={logout} />
                    </View>

                    {/* Main column */}
                    <View style={styles.mainColumn}>
                        <PersonalInfoSection user={displayUser} />
                    </View>
                </View>

                {/* AI Insight */}
                <AIInsightChip
                    title="GigShield Insight"
                    description="Your safety score is in the top 5% of earners this month."
                    style={{ marginTop: SPACING.lg, marginBottom: SPACING.lg }}
                />

                {/* KYC Documents */}
                <DocumentsSection documents={profile?.documents || []} />

                <View style={{ height: 100 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

// ─── Sub Components ────────────────────────────────────

function HeroSection({ name, phone, location }: { name: string; phone: string; location: string }) {
    return (
        <View style={styles.heroSection}>
            <View style={styles.heroRow}>
                <View style={{ flex: 1 }}>
                    <View style={styles.kycBadge}>
                        <MaterialIcons name="verified" size={14} color={COLORS.secondary} />
                        <ThemedText variant="overline" color={COLORS.secondary} style={{ fontWeight: '700', marginLeft: 4 }}>
                            KYC Verified
                        </ThemedText>
                    </View>
                    <ThemedText variant="h1" style={{ fontSize: 40, lineHeight: 44, marginTop: 12 }}>
                        {name}
                    </ThemedText>
                    <ThemedText variant="body" color={COLORS.outline} style={{ marginTop: 8, fontWeight: '500' }}>
                        {phone} • {location}
                    </ThemedText>
                </View>
            </View>
        </View>
    );
}

function SecurityRating({ rating }: { rating: number }) {
    return (
        <SurfaceCard variant="default" borderAccent={`${COLORS.primary}33`} style={{ marginBottom: SPACING.md }}>
            <ThemedText variant="overline" color={COLORS.outlineVariant}>Security Rating</ThemedText>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', marginTop: 12 }}>
                <ThemedText variant="h1" color={COLORS.primary} style={{ fontSize: 48 }}>{rating}</ThemedText>
                <ThemedText variant="body" color={COLORS.secondary} style={{ fontWeight: '700', marginLeft: 4 }}>/100</ThemedText>
            </View>
            <ThemedText variant="caption" color={COLORS.onSurfaceVariant} style={{ marginTop: 8, lineHeight: 18 }}>
                Your identity score is looking good. Connected accounts are verified.
            </ThemedText>
        </SurfaceCard>
    );
}

function QuickActions({ onLogout }: { onLogout: () => void }) {
    return (
        <SurfaceCard variant="lowest" style={{ padding: 16 }}>
            <ThemedText variant="overline" color={COLORS.outlineVariant} style={{ marginBottom: 12 }}>
                Quick Actions
            </ThemedText>
            <ActionItem icon="privacy-tip" label="Privacy Shield" />
            <ActionItem icon="payment" label="Payment Methods" />
            <TouchableOpacity style={styles.logoutRow} onPress={onLogout}>
                <MaterialIcons name="logout" size={20} color={COLORS.error} />
                <ThemedText variant="body" color={COLORS.error} style={{ fontWeight: '500', marginLeft: 12 }}>
                    Logout
                </ThemedText>
            </TouchableOpacity>
        </SurfaceCard>
    );
}

function ActionItem({ icon, label }: { icon: keyof typeof MaterialIcons.glyphMap; label: string }) {
    return (
        <TouchableOpacity style={styles.actionItem} activeOpacity={0.7}>
            <ThemedText variant="body" style={{ fontWeight: '500' }}>{label}</ThemedText>
            <MaterialIcons name="chevron-right" size={20} color={COLORS.outline} />
        </TouchableOpacity>
    );
}

function PersonalInfoSection({ user }: { user: any }) {
    return (
        <SurfaceCard variant="default" style={{ padding: SPACING.xl }}>
            <View style={styles.sectionHeader}>
                <ThemedText variant="h3">Personal Information</ThemedText>
                <TouchableOpacity>
                    <MaterialIcons name="edit-note" size={24} color={COLORS.outline} />
                </TouchableOpacity>
            </View>
            <View style={styles.infoGrid}>
                <InfoField label="Email Address" value={user?.email || 'N/A'} />
                <InfoField label="Phone" value={user?.phone || 'N/A'} />
                <InfoField label="Location" value={user?.location || 'N/A'} />
                <InfoField label="Member Since" value={user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'} />
            </View>
        </SurfaceCard>
    );
}

function InfoField({ label, value, fullWidth }: { label: string; value: string; fullWidth?: boolean }) {
    return (
        <View style={[styles.infoField, fullWidth && { width: '100%' }]}>
            <ThemedText variant="overline" color={COLORS.outline}>{label}</ThemedText>
            <ThemedText variant="body" style={{ fontSize: 16, fontWeight: '500', marginTop: 4, borderBottomWidth: 1, borderBottomColor: 'rgba(73, 69, 82, 0.1)', paddingBottom: 8 }}>
                {value}
            </ThemedText>
        </View>
    );
}

function DocumentsSection({ documents }: { documents: any[] }) {
    return (
        <View>
            <View style={styles.sectionHeader}>
                <View>
                    <ThemedText variant="h3">Vault Documents</ThemedText>
                    <ThemedText variant="caption" color={COLORS.onSurfaceVariant} style={{ marginTop: 2 }}>
                        Encrypted storage for your compliance files.
                    </ThemedText>
                </View>
                <TouchableOpacity>
                    <ThemedText variant="overline" color={COLORS.primary} style={{ fontWeight: '700' }}>Upload New</ThemedText>
                </TouchableOpacity>
            </View>
            <View style={styles.docsGrid}>
                {documents.length > 0 ? documents.map((doc, index) => (
                    <DocumentCard key={index} {...doc} />
                )) : (
                    <ThemedText variant="body" color={COLORS.onSurfaceVariant}>No documents available.</ThemedText>
                )}
                <TouchableOpacity style={styles.addDocCard}>
                    <MaterialIcons name="add-circle" size={28} color={COLORS.outlineVariant} />
                    <ThemedText variant="body" color={COLORS.outlineVariant} style={{ fontWeight: '600', marginTop: 8 }}>
                        Add Document
                    </ThemedText>
                </TouchableOpacity>
            </View>
        </View>
    );
}

function DocumentCard({ icon, title, subtitle, color }: {
    icon: keyof typeof MaterialIcons.glyphMap; title: string; subtitle: string; color: string;
}) {
    return (
        <TouchableOpacity style={styles.docCard} activeOpacity={0.7}>
            <View style={[styles.docIconBox, { backgroundColor: `${color}1A` }]}>
                <MaterialIcons name={icon} size={24} color={color} />
            </View>
            <ThemedText variant="body" style={{ fontWeight: '700', marginTop: 12 }}>{title}</ThemedText>
            <ThemedText variant="overline" color={COLORS.outline} style={{ marginTop: 4 }}>{subtitle}</ThemedText>
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
    topBarRight: { flexDirection: 'row', alignItems: 'center', gap: 16 },
    scrollContent: { paddingHorizontal: SPACING.lg },
    heroSection: { marginBottom: SPACING.xl },
    heroRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
    kycBadge: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: 'rgba(0, 109, 66, 0.15)', paddingHorizontal: 10, paddingVertical: 4,
        borderRadius: BORDER_RADIUS.round, alignSelf: 'flex-start',
    },
    mainGrid: { gap: SPACING.lg },
    sideColumn: { gap: 0 },
    mainColumn: {},
    sectionHeader: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: SPACING.lg,
    },
    infoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.lg },
    infoField: { width: '45%', marginBottom: 8 },
    actionItem: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingVertical: 12,
    },
    logoutRow: {
        flexDirection: 'row', alignItems: 'center',
        paddingVertical: 12, marginTop: 8,
        borderTopWidth: 1, borderTopColor: 'rgba(73, 69, 82, 0.1)',
    },
    docsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    docCard: {
        backgroundColor: COLORS.surfaceContainer, padding: SPACING.lg,
        borderRadius: BORDER_RADIUS.md, width: '47%',
    },
    docIconBox: {
        width: 48, height: 48, borderRadius: 12,
        justifyContent: 'center', alignItems: 'center',
    },
    addDocCard: {
        borderWidth: 2, borderStyle: 'dashed', borderColor: 'rgba(73, 69, 82, 0.3)',
        borderRadius: BORDER_RADIUS.md, width: '47%', padding: SPACING.lg,
        justifyContent: 'center', alignItems: 'center',
    },
});
