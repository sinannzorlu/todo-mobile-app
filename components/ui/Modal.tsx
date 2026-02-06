import React from 'react';
import {
    Modal as RNModal,
    View,
    StyleSheet,
    TouchableWithoutFeedback,
    Platform,
    Dimensions,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '@/context/ThemeContext';

interface ModalProps {
    visible: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export function Modal({ visible, onClose, children }: ModalProps) {
    const { colors, isDark } = useTheme();

    return (
        <RNModal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    {Platform.OS === 'ios' ? (
                        <BlurView
                            intensity={isDark ? 30 : 50}
                            tint={isDark ? 'dark' : 'light'}
                            style={StyleSheet.absoluteFill}
                        />
                    ) : (
                        <View
                            style={[
                                StyleSheet.absoluteFill,
                                { backgroundColor: 'rgba(0, 0, 0, 0.6)' },
                            ]}
                        />
                    )}

                    <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
                        <View
                            style={[
                                styles.content,
                                {
                                    backgroundColor: colors.surface,
                                    borderColor: colors.border,
                                },
                            ]}
                        >
                            {children}
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </RNModal>
    );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    content: {
        width: Math.min(width - 48, 400),
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
    },
});
