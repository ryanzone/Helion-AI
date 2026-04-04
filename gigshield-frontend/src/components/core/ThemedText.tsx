import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import { COLORS } from '../../constants/Theme';

interface ThemedTextProps {
    children: React.ReactNode;
    style?: TextStyle | TextStyle[];
    variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'label' | 'overline';
    color?: string;
    numberOfLines?: number;
}

export const ThemedText: React.FC<ThemedTextProps> = ({
    children,
    style,
    variant = 'body',
    color,
    numberOfLines,
}) => {
    return (
        <Text
            style={[styles[variant], color ? { color } : {}, style]}
            numberOfLines={numberOfLines}
        >
            {children}
        </Text>
    );
};

const styles = StyleSheet.create({
    h1: {
        fontSize: 36,
        fontWeight: '800',
        color: COLORS.onSurface,
        letterSpacing: -1.5,
    },
    h2: {
        fontSize: 28,
        fontWeight: '700',
        color: COLORS.onSurface,
        letterSpacing: -1,
    },
    h3: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.onSurface,
        letterSpacing: -0.5,
    },
    body: {
        fontSize: 14,
        color: COLORS.onSurface,
        lineHeight: 22,
    },
    caption: {
        fontSize: 12,
        color: COLORS.onSurfaceVariant,
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.onSurfaceVariant,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    overline: {
        fontSize: 10,
        fontWeight: '700',
        color: COLORS.onSurfaceVariant,
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
});
