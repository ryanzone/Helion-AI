import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, BORDER_RADIUS } from '../../constants/Theme';
import { ThemedText } from './ThemedText';

type StatusType = 'approved' | 'pending' | 'rejected' | 'active' | 'completed' | 'invoiced';

interface StatusBadgeProps {
    status: StatusType;
    style?: ViewStyle;
}

function getStatusConfig(status: StatusType) {
    switch (status) {
        case 'approved':
        case 'completed':
            return { label: status.toUpperCase(), color: COLORS.secondary, bg: 'rgba(0, 109, 66, 0.2)' };
        case 'pending':
            return { label: 'PENDING', color: COLORS.onSurface, bg: COLORS.surfaceContainerHighest };
        case 'rejected':
            return { label: 'REJECTED', color: COLORS.error, bg: 'rgba(147, 0, 10, 0.2)' };
        case 'active':
            return { label: 'ACTIVE', color: COLORS.secondary, bg: 'rgba(0, 109, 66, 0.2)' };
        case 'invoiced':
            return { label: 'INVOICED', color: COLORS.onSurfaceVariant, bg: COLORS.surfaceContainerHighest };
        default: {
            const s: string = status;
            return { label: s.toUpperCase(), color: COLORS.onSurfaceVariant, bg: COLORS.surfaceContainerHighest };
        }
    }
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, style }) => {
    const config = getStatusConfig(status);

    return (
        <View style={[styles.badge, { backgroundColor: config.bg }, style]}>
            <View style={[styles.dot, { backgroundColor: config.color }]} />
            <ThemedText
                variant="overline"
                color={config.color}
                style={{ fontWeight: '800', letterSpacing: 1.5 }}
            >
                {config.label}
            </ThemedText>
        </View>
    );
};

const styles = StyleSheet.create({
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: BORDER_RADIUS.round,
        gap: 6,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
});
