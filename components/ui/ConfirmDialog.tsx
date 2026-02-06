import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Modal } from './Modal';
import { useTheme } from '@/context/ThemeContext';
import { spacing, fontSize } from '@/theme/spacing';
import { AlertCircle } from 'lucide-react-native';

interface ConfirmDialogProps {
    visible: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    isDestructive?: boolean;
    showCancel?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export function ConfirmDialog({
    visible,
    title,
    message,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    isDestructive = false,
    showCancel = true,
    onConfirm,
    onCancel,
}: ConfirmDialogProps) {
    const { colors } = useTheme();

    return (
        <Modal visible={visible} onClose={onCancel}>
            <View style={styles.container}>
                <View style={[styles.iconContainer, { backgroundColor: isDestructive ? colors.error + '20' : colors.primary + '20' }]}>
                    <AlertCircle size={24} color={isDestructive ? colors.error : colors.primary} />
                </View>

                <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
                <Text style={[styles.message, { color: colors.textSecondary }]}>{message}</Text>

                <View style={styles.actions}>
                    {showCancel && (
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton, { borderColor: colors.border }]}
                            onPress={onCancel}
                        >
                            <Text style={[styles.buttonText, { color: colors.text }]}>
                                {cancelLabel}
                            </Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity
                        style={[
                            styles.button,
                            { backgroundColor: isDestructive ? colors.error : colors.primary }
                        ]}
                        onPress={onConfirm}
                    >
                        <Text style={[styles.buttonText, { color: '#ffffff' }]}>
                            {confirmLabel}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.md,
    },
    title: {
        fontSize: fontSize.xl,
        fontWeight: 'bold',
        marginBottom: spacing.xs,
        textAlign: 'center',
    },
    message: {
        fontSize: fontSize.md,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: spacing.xl,
    },
    actions: {
        flexDirection: 'row',
        gap: spacing.sm,
        width: '100%',
    },
    button: {
        flex: 1,
        height: 48,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButton: {
        borderWidth: 1,
    },
    buttonText: {
        fontSize: fontSize.md,
        fontWeight: '600',
    },
});
