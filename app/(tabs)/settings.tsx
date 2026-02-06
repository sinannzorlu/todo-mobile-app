import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { spacing, borderRadius, fontSize } from '@/theme/spacing';
import {
  User,
  Moon,
  Sun,
  Monitor,
  LogOut,
  Info,
  ChevronRight,
} from 'lucide-react-native';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

export default function SettingsScreen() {
  const { colors, theme, setTheme, isDark } = useTheme();
  const { user, logout } = useAuth();
  const router = useRouter();

  const [logoutConfirmVisible, setLogoutConfirmVisible] = React.useState(false);
  const [alertVisible, setAlertVisible] = React.useState(false);
  const [alertTitle, setAlertTitle] = React.useState('');
  const [alertMessage, setAlertMessage] = React.useState('');

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      logout().catch(err => {
        console.error('Logout error:', err);
      });
      return;
    }
    setLogoutConfirmVisible(true);
  };

  const onConfirmLogout = async () => {
    setLogoutConfirmVisible(false);
    try {
      await logout();
      router.replace('/(auth)/login');
    } catch (error: any) {
      setAlertTitle('Error');
      setAlertMessage(error.message || 'Failed to logout');
      setAlertVisible(true);
    }
  };

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'auto', label: 'Auto', icon: Monitor },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <View style={styles.userInfo}>
            <View
              style={[styles.avatar, { backgroundColor: colors.primary + '20' }]}
            >
              <User size={24} color={colors.primary} />
            </View>
            <View style={styles.userDetails}>
              <Text style={[styles.userName, { color: colors.text }]}>
                {user?.email || 'User'}
              </Text>
              <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
                {user?.email}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            APPEARANCE
          </Text>
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.settingLabel, { color: colors.text }]}>Theme</Text>
          <View style={styles.themeOptions}>
            {themeOptions.map(option => {
              const Icon = option.icon;
              const isSelected = theme === option.value;

              return (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.themeOption,
                    {
                      backgroundColor: isSelected
                        ? colors.primary + '20'
                        : colors.background,
                      borderColor: isSelected ? colors.primary : colors.border,
                    },
                  ]}
                  onPress={() => setTheme(option.value as any)}
                >
                  <Icon
                    size={20}
                    color={isSelected ? colors.primary : colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.themeOptionText,
                      { color: isSelected ? colors.primary : colors.text },
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            ABOUT
          </Text>
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => {
              setAlertTitle('About Todo App');
              setAlertMessage('A beautiful and feature-rich todo application built with React Native and Expo.\n\nVersion: 1.0.0');
              setAlertVisible(true);
            }}
          >
            <View style={styles.settingLeft}>
              <Info size={20} color={colors.textSecondary} />
              <Text style={[styles.settingText, { color: colors.text }]}>
                About
              </Text>
            </View>
            <ChevronRight size={20} color={colors.textTertiary} />
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            ACCOUNT
          </Text>
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <TouchableOpacity style={styles.settingRow} onPress={handleLogout}>
            <View style={styles.settingLeft}>
              <LogOut size={20} color={colors.error} />
              <Text style={[styles.settingText, { color: colors.error }]}>
                Logout
              </Text>
            </View>
            <ChevronRight size={20} color={colors.textTertiary} />
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textTertiary }]}>
            Todo App v1.0.0
          </Text>
          <Text style={[styles.footerText, { color: colors.textTertiary }]}>
            Made with React Native & Expo
          </Text>
        </View>
      </ScrollView>

      <ConfirmDialog
        visible={logoutConfirmVisible}
        title="Logout"
        message="Are you sure you want to log out?"
        confirmLabel="Logout"
        cancelLabel="Cancel"
        isDestructive
        onConfirm={onConfirmLogout}
        onCancel={() => setLogoutConfirmVisible(false)}
      />

      <ConfirmDialog
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        confirmLabel="OK"
        showCancel={false}
        onConfirm={() => setAlertVisible(false)}
        onCancel={() => setAlertVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: spacing.xxl,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    fontSize: fontSize.xxxl,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  section: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionHeader: {
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  sectionTitle: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    letterSpacing: 1,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  userEmail: {
    fontSize: fontSize.sm,
  },
  settingLabel: {
    fontSize: fontSize.md,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  themeOptions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  themeOption: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    gap: spacing.xs,
  },
  themeOptionText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  settingText: {
    fontSize: fontSize.md,
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    marginTop: spacing.xl,
    gap: spacing.xs,
  },
  footerText: {
    fontSize: fontSize.xs,
  },
});
