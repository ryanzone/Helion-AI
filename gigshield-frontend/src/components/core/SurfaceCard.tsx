import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, BORDER_RADIUS } from '../../constants/Theme';

type SurfaceVariant = 'lowest' | 'low' | 'default' | 'high' | 'highest';

interface SurfaceCardProps {
    children: React.ReactNode;
    style?: ViewStyle;
    variant?: SurfaceVariant;
    borderAccent?: string;
    borderSide?: 'left' | 'bottom';
}

function getBackgroundColor(variant: SurfaceVariant): string {
    switch (variant) {
        case 'lowest': return COLORS.surfaceContainerLowest;
        case 'low': return COLORS.surfaceContainerLow;
        case 'high': return COLORS.surfaceContainerHigh;
        case 'highest': return COLORS.surfaceContainerHighest;
        default: return COLORS.surfaceContainer;
    }
}

export const SurfaceCard: React.FC<SurfaceCardProps> = ({
    children,
    style,
    variant = 'default',
    borderAccent,
    borderSide = 'bottom',
}) => {
    const accentStyle: ViewStyle = borderAccent
        ? borderSide === 'left'
            ? { borderLeftWidth: 4, borderLeftColor: borderAccent }
            : { borderBottomWidth: 2, borderBottomColor: borderAccent }
        : {};

    return (
        <View
            style={[
                styles.card,
                { backgroundColor: getBackgroundColor(variant) },
                accentStyle,
                style,
            ]}
        >
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: BORDER_RADIUS.lg,
        padding: 24,
        borderWidth: 1,
        borderColor: 'rgba(73, 69, 82, 0.05)',
    },
});
