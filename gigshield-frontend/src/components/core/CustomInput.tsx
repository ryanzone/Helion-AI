import React from 'react';
import { View, TextInput, StyleSheet, ViewStyle, TextInputProps } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { COLORS } from '../../constants/Theme';

interface CustomInputProps extends TextInputProps {
    icon?: keyof typeof MaterialIcons.glyphMap;
    containerStyle?: ViewStyle;
    label?: string;
}

export const CustomInput: React.FC<CustomInputProps> = ({ icon, containerStyle, ...props }) => {
    return (
        <View style={[styles.container, containerStyle]}>
            {icon && <MaterialIcons name={icon} size={20} color={COLORS.onSurfaceVariant} style={styles.icon} />}
            <TextInput
                style={styles.input}
                placeholderTextColor={`${COLORS.onSurfaceVariant}66`}
                {...props}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'rgba(73, 69, 82, 0.3)',
        marginBottom: 24,
    },
    icon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        paddingVertical: 16,
        paddingHorizontal: 2,
        color: COLORS.onSurface,
        fontSize: 16,
        backgroundColor: 'transparent',
    },
});
