import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, BORDER_RADIUS } from '../../constants/Theme';

interface GlassCardProps {
    children: React.ReactNode;
    style?: ViewStyle;
    gradient?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, style, gradient }) => {
    return (
        <View style={[styles.card, gradient && styles.gradientCard, style]}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.surfaceContainer,
        borderRadius: BORDER_RADIUS.lg,
        borderWidth: 1,
        borderColor: 'rgba(73, 69, 82, 0.1)',
        padding: 16,
    },
    gradientCard: {
        backgroundColor: COLORS.surfaceContainerLow,
        borderColor: 'rgba(73, 69, 82, 0.05)',
    },
});
