import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { COLORS, BORDER_RADIUS, SPACING } from '../../constants/Theme';
import { ThemedText } from './ThemedText';

interface AIInsightChipProps {
    title?: string;
    description: string;
    style?: ViewStyle;
    variant?: 'default' | 'compact';
}

export const AIInsightChip: React.FC<AIInsightChipProps> = ({
    title = 'Helion AI Insight',
    description,
    style,
    variant = 'default',
}) => {
    if (variant === 'compact') {
        return (
            <View style={[styles.compactContainer, style]}>
                <MaterialIcons name="auto-awesome" size={14} color={COLORS.secondary} />
                <ThemedText variant="caption" color={COLORS.onSecondaryContainer}>
                    {description}
                </ThemedText>
            </View>
        );
    }

    return (
        <View style={[styles.container, style]}>
            <View style={styles.header}>
                <View style={styles.iconContainer}>
                    <MaterialIcons name="auto-awesome" size={16} color={COLORS.secondary} />
                </View>
                <View style={styles.textContent}>
                    <ThemedText
                        variant="overline"
                        color={COLORS.secondary}
                        style={{ letterSpacing: 1.5 }}
                    >
                        {title}
                    </ThemedText>
                    <ThemedText
                        variant="body"
                        color={COLORS.onSurfaceVariant}
                        style={{ marginTop: 4, lineHeight: 20 }}
                    >
                        {description}
                    </ThemedText>
                </View>
            </View>
            <View style={styles.pulsingDot} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(0, 109, 66, 0.12)',
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.lg,
        borderLeftWidth: 4,
        borderLeftColor: COLORS.secondary,
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        flex: 1,
        gap: 12,
    },
    iconContainer: {
        width: 28,
        height: 28,
        borderRadius: 8,
        backgroundColor: 'rgba(0, 109, 66, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 2,
    },
    textContent: {
        flex: 1,
    },
    pulsingDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: COLORS.secondary,
        marginTop: 6,
        marginLeft: 8,
    },
    compactContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: 'rgba(0, 109, 66, 0.1)',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: BORDER_RADIUS.md,
        borderWidth: 1,
        borderColor: 'rgba(128, 217, 164, 0.05)',
    },
});
