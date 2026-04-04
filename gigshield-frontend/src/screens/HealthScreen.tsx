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
import { Pedometer } from 'expo-sensors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/Theme';
import { ThemedText } from '../components/core/ThemedText';
import { SurfaceCard } from '../components/core/SurfaceCard';
import { AIInsightChip } from '../components/core/AIInsightChip';
import { api } from '../services/api';
import { useStore } from '../store/store';

export default function HealthScreen({ navigation }: any) {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<any>({ heart_rate: 0, steps: 0, safety_score: 0 });
    const [appointments, setAppointments] = useState<any[]>([]);
    const [coverage, setCoverage] = useState<any[]>([]);
    const [currentStepCount, setCurrentStepCount] = useState(0);
    const [prediction, setPrediction] = useState<any>(null);
    const user = useStore(state => state.user);

    useEffect(() => {
        let subscription: Pedometer.Subscription | null = null;
        const subscribe = async () => {
            const isAvailable = await Pedometer.isAvailableAsync();
            if (isAvailable) {
                subscription = Pedometer.watchStepCount(result => {
                    setCurrentStepCount(result.steps);
                });
            }
        };
        subscribe();
        return () => {
            if (subscription && subscription.remove) {
                subscription.remove();
            }
        };
    }, []);

    useEffect(() => {
        loadHealth();
    }, []);

    const loadHealth = async () => {
        try {
            const data = await api.getHealth();
            setStats(data.stats || { heart_rate: 0, steps: 0, safety_score: 0 });
            setAppointments(data.appointments || []);
            setCoverage(data.coverage || []);
        } catch (e) {
            console.log('Health load error:', e);
        } finally {
            setLoading(false);
            
            // 🤖 FETCH ML PREDICTION
            try {
                const city = user?.location || 'Chennai';
                const month = new Date().getMonth() + 1;
                const mlData = await api.getRiskPrediction(city, month);
                setPrediction(mlData);
            } catch (err) {
                console.log('ML Prediction failed:', err);
            }
        }
    };

    // ✅ FIXED BOOK FUNCTION
    const handleBookAppointment = () => {
        const newAppointment = {
            title: 'General Check-up',
            date: 'Tomorrow, 10:00 AM',
            location: 'City Hospital',
            icon: '🏥'
        };

        setAppointments(prev => [newAppointment, ...prev]);
    };

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </SafeAreaView>
        );
    }

    const totalSteps = (stats?.steps || 0) + currentStepCount;
    const stepsDisplay = totalSteps >= 1000 ? `${(totalSteps / 1000).toFixed(1)}k` : `${totalSteps}`;

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

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <ThemedText variant="overline" color={COLORS.secondary}>Wellness Dashboard</ThemedText>
                    <ThemedText variant="h1" style={{ fontSize: 32 }}>Health & Safety</ThemedText>
                </View>

                {/* Health stats */}
                <View style={styles.statsGrid}>
                    <HealthStatCard icon="favorite" title="Heart Rate" value={`${stats.heart_rate}`} unit="bpm" color="#FF6B6B" status="Normal" />
                    <HealthStatCard icon="directions-walk" title="Steps Today" value={stepsDisplay} unit="" color={COLORS.secondary} status="On Track" />
                </View>

                {/* Medical Coverage */}
                <SurfaceCard variant="default" style={styles.coverageCard}>
                    <View style={styles.coverageHeader}>
                        <View style={styles.coverageIconBox}>
                            <MaterialIcons name="medical-services" size={28} color={COLORS.secondary} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <ThemedText variant="h3" style={{ fontSize: 18 }}>Medical Coverage</ThemedText>
                            <ThemedText variant="overline" color={COLORS.secondary} style={{ marginTop: 4 }}>ACTIVE</ThemedText>
                        </View>
                    </View>

                    <View style={styles.coverageDetails}>
                        {coverage.length > 0 ? coverage.map((c: any, i: number) => (
                            <CoverageRow key={i} label={c.label} value={c.value} />
                        )) : (
                            <>
                                <CoverageRow label="Emergency Room" value="Covered 100%" />
                                <CoverageRow label="Prescriptions" value="Up to ₹500/yr" />
                                <CoverageRow label="Physical Therapy" value="12 sessions/yr" />
                                <CoverageRow label="Mental Health" value="Covered" />
                            </>
                        )}
                    </View>
                </SurfaceCard>

                {/* Safety Score */}
                <SurfaceCard variant="highest" style={styles.safetyCard}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View>
                            <ThemedText variant="overline" color={COLORS.onSurfaceVariant}>Safety Score</ThemedText>
                            <View style={{ flexDirection: 'row', alignItems: 'baseline', marginTop: 4 }}>
                                <ThemedText variant="h1" color={COLORS.secondary} style={{ fontSize: 48 }}>{stats.safety_score}</ThemedText>
                                <ThemedText variant="body" color={COLORS.onSurfaceVariant}>/100</ThemedText>
                            </View>
                        </View>
                        <MaterialIcons name="shield" size={48} color={`${COLORS.secondary}33`} />
                    </View>
                    <View style={styles.safetyBar}>
                        <View style={[styles.safetyFill, { width: `${stats.safety_score}%` }]} />
                    </View>
                </SurfaceCard>

                {/* AI Insight */}
                <AIInsightChip
                    title="Real-time Risk Analysis"
                    description={prediction 
                        ? `Based on ${prediction.weather.temp}°C and ${prediction.weather.humidity}% humidity in ${user?.location || 'your area'}, the incident risk probability is ${(prediction.risk * 100).toFixed(2)}%.`
                        : "Calculating safety insights from your environment..."
                    }
                    style={{ marginBottom: SPACING.lg }}
                />

                {/* Appointments Header */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md }}>
                    <ThemedText variant="h3">Appointments</ThemedText>
                    <TouchableOpacity
                        onPress={handleBookAppointment}
                        style={{ padding: 8, backgroundColor: 'rgba(206, 189, 255, 0.1)', borderRadius: 20, paddingHorizontal: 16 }}
                    >
                        <ThemedText variant="body" color={COLORS.primary} style={{ fontWeight: '600' }}>
                            + Book New
                        </ThemedText>
                    </TouchableOpacity>
                </View>

                {appointments.length > 0 ? appointments.map((a: any, i: number) => (
                    <AppointmentCard
                        key={i}
                        icon={a.icon === '🏥' ? 'event' : a.icon === '🦷' ? 'vaccines' : 'event'}
                        title={a.title}
                        date={a.date}
                        location={a.location}
                    />
                )) : (
                    <SurfaceCard variant="lowest" style={{ padding: SPACING.xl, alignItems: 'center', marginBottom: SPACING.lg }}>
                        <MaterialIcons name="event" size={40} color={COLORS.outlineVariant} />
                        <ThemedText variant="body" color={COLORS.onSurfaceVariant} style={{ textAlign: 'center', marginTop: 12 }}>
                            No upcoming appointments
                        </ThemedText>
                        <ThemedText variant="caption" color={COLORS.outlineVariant} style={{ textAlign: 'center', marginTop: 4 }}>
                            Scheduled appointments will appear here
                        </ThemedText>
                    </SurfaceCard>
                )}

                <View style={{ height: 100 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

// ─── Sub Components ────────────────────────────────────

function HealthStatCard({ icon, title, value, unit, color, status }: {
    icon: keyof typeof MaterialIcons.glyphMap; title: string; value: string;
    unit: string; color: string; status: string;
}) {
    return (
        <SurfaceCard variant="low" style={styles.statCard}>
            <View style={styles.statTop}>
                <View style={[styles.statIconBox, { backgroundColor: `${color}1A` }]}>
                    <MaterialIcons name={icon} size={22} color={color} />
                </View>
                <ThemedText variant="overline" color={COLORS.secondary} style={{ fontWeight: '700' }}>{status}</ThemedText>
            </View>
            <View>
                <ThemedText variant="overline" color={COLORS.onSurfaceVariant}>{title}</ThemedText>
                <View style={{ flexDirection: 'row', alignItems: 'baseline', marginTop: 4 }}>
                    <ThemedText variant="h1" style={{ fontSize: 32 }}>{value}</ThemedText>
                    {unit ? <ThemedText variant="body" color={COLORS.onSurfaceVariant} style={{ marginLeft: 2 }}>{unit}</ThemedText> : null}
                </View>
            </View>
        </SurfaceCard>
    );
}

function CoverageRow({ label, value }: { label: string; value: string }) {
    return (
        <View style={styles.coverageRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <MaterialIcons name="check-circle" size={16} color={COLORS.secondary} />
                <ThemedText variant="body">{label}</ThemedText>
            </View>
            <ThemedText variant="caption" color={COLORS.onSurfaceVariant}>{value}</ThemedText>
        </View>
    );
}

function AppointmentCard({ icon, title, date, location }: {
    icon: keyof typeof MaterialIcons.glyphMap; title: string; date: string; location: string;
}) {
    return (
        <TouchableOpacity activeOpacity={0.7}>
            <SurfaceCard variant="default" style={styles.appointmentCard}>
                <View style={styles.appointmentIcon}>
                    <MaterialIcons name={icon} size={22} color={COLORS.primary} />
                </View>
                <View style={{ flex: 1 }}>
                    <ThemedText variant="body" style={{ fontWeight: '600' }}>{title}</ThemedText>
                    <ThemedText variant="caption" color={COLORS.onSurfaceVariant}>{date} • {location}</ThemedText>
                </View>
                <MaterialIcons name="chevron-right" size={20} color={COLORS.outline} />
            </SurfaceCard>
        </TouchableOpacity>
    );
}

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
    header: { marginBottom: SPACING.xl },
    statsGrid: { flexDirection: 'row', gap: 12, marginBottom: SPACING.lg },
    statCard: { flex: 1, height: 160, justifyContent: 'space-between' },
    statTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    statIconBox: { padding: 8, borderRadius: 10 },
    coverageCard: { marginBottom: SPACING.lg, padding: SPACING.xl },
    coverageHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.lg },
    coverageIconBox: {
        width: 48, height: 48, borderRadius: 24,
        backgroundColor: 'rgba(128, 217, 164, 0.1)',
        justifyContent: 'center', alignItems: 'center', marginRight: 16,
    },
    coverageDetails: { gap: 4 },
    coverageRow: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(73, 69, 82, 0.05)',
    },
    safetyCard: { marginBottom: SPACING.lg, padding: SPACING.xl },
    safetyBar: {
        height: 6, backgroundColor: COLORS.surfaceContainerLowest,
        borderRadius: 3, overflow: 'hidden', marginTop: SPACING.md,
    },
    safetyFill: {
        height: '100%', backgroundColor: COLORS.secondary, borderRadius: 3,
    },
    appointmentCard: {
        flexDirection: 'row', alignItems: 'center', marginBottom: 8, padding: 16,
    },
    appointmentIcon: {
        width: 44, height: 44, borderRadius: 22,
        backgroundColor: 'rgba(206, 189, 255, 0.1)',
        justifyContent: 'center', alignItems: 'center', marginRight: 12,
    },
});