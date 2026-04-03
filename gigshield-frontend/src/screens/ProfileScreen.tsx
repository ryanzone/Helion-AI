import React, { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    ActivityIndicator,
    TextInput,
    Alert,
    Platform
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
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
    const navigation = useNavigation<any>();

    const [profile, setProfile] = useState<any>(null);
    const [documents, setDocuments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeSubscription, setActiveSubscription] = useState<any>(null);

    const [editing, setEditing] = useState(false);
    const [editName, setEditName] = useState('');
    const [editPhone, setEditPhone] = useState('');
    const [editLocation, setEditLocation] = useState('');
    const [saving, setSaving] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            loadProfile();
        }, [])
    );

    const loadProfile = async () => {
        try {
            const data = await api.getProfile();
            setProfile(data);
            setDocuments(data.documents || []);

            // 🎯 FETCH ACTIVE SUB
            const subs = await api.getSubscriptions();
            const active = subs.find((s: any) => s.status === 'active');
            setActiveSubscription(active);

        } catch (e) {
            console.log('Profile load error:', e);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: '*/*',
                copyToCacheDirectory: true
            });

            if (result.canceled) return;

            const file = result.assets[0];
            const formData = new FormData();

            if (Platform.OS === 'web') {
                // On Web, use the browser-native 'file' instance
                if (file.file) {
                    formData.append('file', file.file);
                } else {
                    // Fallback: fetch blob from URI if file object is missing
                    const response = await fetch(file.uri);
                    const blob = await response.blob();
                    formData.append('file', blob, file.name);
                }
            } else {
                // On Native, use the URI-based object
                formData.append('file', {
                    uri: file.uri,
                    name: file.name,
                    type: file.mimeType || 'application/octet-stream'
                } as any);
            }

            const uploaded = await api.uploadDocument(formData);
            setDocuments(prev => [uploaded, ...prev]);
            Alert.alert('Success', 'Document uploaded successfully');

        } catch (err: any) {
            Alert.alert('Upload Failed', err.message);
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

            <View style={styles.topBar}>
                <ThemedText variant="h3" color={COLORS.primary} style={{ fontWeight: '900' }}>
                    GigShield
                </ThemedText>

                <TouchableOpacity onPress={() => {
                    setEditName(displayUser?.name || '');
                    setEditPhone(displayUser?.phone || '');
                    setEditLocation(displayUser?.location || '');
                    setEditing(true);
                }}>
                    <MaterialIcons name="edit-note" size={24} color={COLORS.outline} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>

                <ThemedText variant="h1">{displayUser?.name}</ThemedText>
                <ThemedText>{displayUser?.phone} • {displayUser?.location}</ThemedText>

                {!editing && (
                    <>
                        <AIInsightChip
                            title="Helion Insight"
                            description="Your safety score is strong."
                        />

                        {/* ACTIVE PLAN */}
                        <View style={{ marginTop: SPACING.xl }}>
                            <ThemedText variant="h3" style={{ marginBottom: SPACING.md }}>
                                Active Plan
                            </ThemedText>

                            <SurfaceCard variant="low" style={{ padding: SPACING.lg }}>
                                {activeSubscription ? (
                                    <>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <View>
                                                <ThemedText variant="h3" color={COLORS.primary}>
                                                    {activeSubscription.plans?.name}
                                                </ThemedText>
                                                <ThemedText variant="caption" color={COLORS.onSurfaceVariant}>
                                                    ₹{activeSubscription.premium || activeSubscription.plans?.weekly_price}/week • {activeSubscription.city_pool}
                                                </ThemedText>
                                            </View>
                                            <MaterialIcons name="verified" size={24} color={COLORS.secondary} />
                                        </View>

                                        <View style={{ flexDirection: 'row', marginTop: SPACING.lg, gap: 12 }}>
                                            <TouchableOpacity
                                                onPress={() => navigation.navigate('PlanSelection')}
                                                style={{ flex: 1, padding: 12, backgroundColor: 'rgba(206,189,255,0.1)', borderRadius: BORDER_RADIUS.md, alignItems: 'center' }}
                                            >
                                                <ThemedText color={COLORS.primary} style={{ fontWeight: '600' }}>Change</ThemedText>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                onPress={async () => {
                                                    Alert.alert('Drop Plan', 'Are you sure?', [
                                                        { text: 'Cancel', style: 'cancel' },
                                                        {
                                                            text: 'Drop', style: 'destructive', onPress: async () => {
                                                                try {
                                                                    await api.cancelSubscription(activeSubscription.id);
                                                                    loadProfile();
                                                                    Alert.alert('Success', 'Plan dropped');
                                                                } catch (err) {
                                                                    Alert.alert('Error', 'Could not drop plan');
                                                                }
                                                            }
                                                        }
                                                    ])
                                                }}
                                                style={{ flex: 1, padding: 12, backgroundColor: 'rgba(255,107,107,0.1)', borderRadius: BORDER_RADIUS.md, alignItems: 'center' }}
                                            >
                                                <ThemedText color="#FF6B6B" style={{ fontWeight: '600' }}>Drop Plan</ThemedText>
                                            </TouchableOpacity>
                                        </View>
                                    </>
                                ) : (
                                    <View style={{ alignItems: 'center', paddingVertical: 10 }}>
                                        <ThemedText color={COLORS.onSurfaceVariant}>No active plan</ThemedText>
                                        <TouchableOpacity
                                            onPress={() => navigation.navigate('PlanSelection')}
                                            style={{ marginTop: 12, padding: 12, backgroundColor: COLORS.primary, borderRadius: BORDER_RADIUS.md, width: '100%', alignItems: 'center' }}
                                        >
                                            <ThemedText color={COLORS.onPrimary} style={{ fontWeight: '600' }}>Browse Plans</ThemedText>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </SurfaceCard>
                        </View>

                        {/* DOCUMENTS */}
                        <View style={{ marginTop: SPACING.xl }}>
                            <ThemedText variant="h3" style={{ marginBottom: SPACING.md }}>
                                Documents
                            </ThemedText>

                            <SurfaceCard variant="low" style={{ padding: SPACING.lg }}>

                                {documents.length > 0 ? documents.map((doc, i) => (
                                    <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                                        <MaterialIcons name="insert-drive-file" size={24} color={COLORS.primary} style={{ marginRight: 12 }} />
                                        <View style={{ flex: 1 }}>
                                            <ThemedText>{doc.name}</ThemedText>
                                            <ThemedText variant="caption" color={COLORS.onSurfaceVariant}>
                                                {doc.status || 'Uploaded'}
                                            </ThemedText>
                                        </View>
                                        <MaterialIcons name="check-circle" size={20} color={COLORS.secondary} />
                                    </View>
                                )) : (
                                    <ThemedText color={COLORS.onSurfaceVariant}>
                                        No documents uploaded yet
                                    </ThemedText>
                                )}

                                <TouchableOpacity
                                    onPress={handleUpload}
                                    style={{
                                        marginTop: SPACING.md,
                                        backgroundColor: 'rgba(206, 189, 255, 0.1)',
                                        padding: 12,
                                        borderRadius: BORDER_RADIUS.md,
                                        alignItems: 'center'
                                    }}
                                >
                                    <ThemedText color={COLORS.primary} style={{ fontWeight: '600' }}>
                                        + Upload Document
                                    </ThemedText>
                                </TouchableOpacity>

                            </SurfaceCard>
                        </View>

                        <TouchableOpacity
                            onPress={logout}
                            style={{
                                padding: 16,
                                backgroundColor: 'rgba(147, 0, 10, 0.15)',
                                borderRadius: BORDER_RADIUS.lg,
                                alignItems: 'center',
                                marginTop: SPACING.xl,
                                marginBottom: 40
                            }}
                        >
                            <ThemedText color="#FF6B6B" style={{ fontWeight: '700' }}>
                                Logout
                            </ThemedText>
                        </TouchableOpacity>
                    </>
                )}

                {editing && (
                    <View style={{ marginTop: SPACING.md }}>
                        <ThemedText variant="h3" style={{ marginBottom: SPACING.lg }}>Edit Profile</ThemedText>
                        
                        <ThemedText variant="caption" style={{ marginBottom: 4 }}>Full Name</ThemedText>
                        <TextInput 
                            style={styles.input}
                            value={editName}
                            onChangeText={setEditName}
                            placeholder="Your Name"
                            placeholderTextColor={COLORS.onSurfaceVariant}
                        />

                        <ThemedText variant="caption" style={{ marginTop: SPACING.md, marginBottom: 4 }}>Phone Number</ThemedText>
                        <TextInput 
                            style={styles.input}
                            value={editPhone}
                            onChangeText={setEditPhone}
                            placeholder="Phone"
                            keyboardType="phone-pad"
                            placeholderTextColor={COLORS.onSurfaceVariant}
                        />

                        <ThemedText variant="caption" style={{ marginTop: SPACING.md, marginBottom: 4 }}>Location (City)</ThemedText>
                        <TextInput 
                            style={styles.input}
                            value={editLocation}
                            onChangeText={setEditLocation}
                            placeholder="e.g. Chennai, TN"
                            placeholderTextColor={COLORS.onSurfaceVariant}
                        />

                        <View style={{ flexDirection: 'row', marginTop: SPACING.xl, gap: 12 }}>
                            <TouchableOpacity 
                                onPress={() => setEditing(false)}
                                style={[styles.button, { flex: 1, backgroundColor: 'rgba(255,255,255,0.05)' }]}
                            >
                                <ThemedText>Cancel</ThemedText>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                onPress={async () => {
                                    setSaving(true);
                                    try {
                                        await api.updateProfile({
                                            name: editName,
                                            phone: editPhone,
                                            location: editLocation
                                        });
                                        const data = await api.getProfile();
                                        setProfile(data);
                                        setEditing(false);
                                        Alert.alert('Success', 'Profile updated');
                                    } catch (e) {
                                        Alert.alert('Error', 'Failed to save profile');
                                    } finally {
                                        setSaving(false);
                                    }
                                }}
                                disabled={saving}
                                style={[styles.button, { flex: 1, backgroundColor: COLORS.primary }]}
                            >
                                {saving ? (
                                    <ActivityIndicator color={COLORS.onPrimary} />
                                ) : (
                                    <ThemedText color={COLORS.onPrimary} style={{ fontWeight: '600' }}>Save Changes</ThemedText>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    topBar: { flexDirection: 'row', justifyContent: 'space-between', padding: 20 },
    scrollContent: { padding: 20 },
    input: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 16,
        borderRadius: BORDER_RADIUS.md,
        color: COLORS.onSurface,
        fontSize: 16,
        marginBottom: 8
    },
    button: {
        padding: 16,
        borderRadius: BORDER_RADIUS.lg,
        alignItems: 'center',
        justifyContent: 'center'
    }
});