import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { COLORS, GRADIENTS, BORDER_RADIUS, SHADOWS } from '../../constants/Theme';

interface GradientButtonProps {
    title: string;
    onPress: () => void;
    loading?: boolean;
    disabled?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
    colors?: string[];
    variant?: 'primary' | 'secondary' | 'success' | 'outline' | 'surface';
    icon?: keyof typeof MaterialIcons.glyphMap;
    iconPosition?: 'left' | 'right';
}

export const GradientButton: React.FC<GradientButtonProps> = ({
    title,
    onPress,
    loading,
    disabled,
    style,
    textStyle,
    colors,
    variant = 'primary',
    icon,
    iconPosition = 'right',
}) => {
    const getGradient = () => {
        if (colors) return colors;
        switch (variant) {
            case 'secondary': return GRADIENTS.secondary;
            case 'success': return GRADIENTS.success;
            default: return GRADIENTS.primary;
        }
    };

    if (variant === 'outline') {
        return (
            <TouchableOpacity
                onPress={onPress}
                disabled={loading || disabled}
                style={[styles.outlineButton, style]}
                activeOpacity={0.7}
            >
                {loading ? (
                    <ActivityIndicator color={COLORS.primary} size="small" />
                ) : (
                    <View style={styles.content}>
                        {icon && iconPosition === 'left' && (
                            <MaterialIcons name={icon} size={20} color={COLORS.primary} style={{ marginRight: 8 }} />
                        )}
                        <Text style={[styles.outlineText, textStyle]}>{title}</Text>
                        {icon && iconPosition === 'right' && (
                            <MaterialIcons name={icon} size={20} color={COLORS.primary} style={{ marginLeft: 8 }} />
                        )}
                    </View>
                )}
            </TouchableOpacity>
        );
    }

    if (variant === 'surface') {
        return (
            <TouchableOpacity
                onPress={onPress}
                disabled={loading || disabled}
                style={[styles.surfaceButton, style]}
                activeOpacity={0.7}
            >
                {loading ? (
                    <ActivityIndicator color={COLORS.primary} size="small" />
                ) : (
                    <View style={styles.content}>
                        {icon && iconPosition === 'left' && (
                            <MaterialIcons name={icon} size={20} color={COLORS.primary} style={{ marginRight: 8 }} />
                        )}
                        <Text style={[styles.surfaceText, textStyle]}>{title}</Text>
                        {icon && iconPosition === 'right' && (
                            <MaterialIcons name={icon} size={20} color={COLORS.primary} style={{ marginLeft: 8 }} />
                        )}
                    </View>
                )}
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity onPress={onPress} disabled={loading || disabled} style={[styles.buttonContainer, style]} activeOpacity={0.85}>
            <LinearGradient
                colors={getGradient() as any}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            >
                {loading ? (
                    <ActivityIndicator color={COLORS.onPrimary} size="small" />
                ) : (
                    <View style={styles.content}>
                        {icon && iconPosition === 'left' && (
                            <MaterialIcons name={icon} size={20} color={COLORS.onPrimary} style={{ marginRight: 8 }} />
                        )}
                        <Text style={[styles.text, textStyle]}>{title}</Text>
                        {icon && iconPosition === 'right' && (
                            <MaterialIcons name={icon} size={20} color={COLORS.onPrimary} style={{ marginLeft: 8 }} />
                        )}
                    </View>
                )}
            </LinearGradient>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        borderRadius: BORDER_RADIUS.lg,
        ...SHADOWS.medium,
        overflow: 'hidden',
    },
    gradient: {
        paddingVertical: 16,
        paddingHorizontal: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: COLORS.onPrimary,
        fontWeight: '700',
        fontSize: 16,
        letterSpacing: -0.3,
    },
    outlineButton: {
        borderRadius: BORDER_RADIUS.lg,
        borderWidth: 1.5,
        borderColor: COLORS.primary,
        paddingVertical: 16,
        paddingHorizontal: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    outlineText: {
        color: COLORS.primary,
        fontWeight: '700',
        fontSize: 16,
    },
    surfaceButton: {
        borderRadius: BORDER_RADIUS.lg,
        backgroundColor: 'rgba(206, 189, 255, 0.08)',
        paddingVertical: 16,
        paddingHorizontal: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    surfaceText: {
        color: COLORS.primary,
        fontWeight: '600',
        fontSize: 16,
    },
});
