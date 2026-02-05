import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useTodos } from '@/context/TodoContext';
import { getTodoStats } from '@/utils/todoFilters';
import { spacing, borderRadius, fontSize } from '@/theme/spacing';
import {
  CheckCircle2,
  Circle,
  AlertCircle,
  TrendingUp,
  Calendar,
} from 'lucide-react-native';

export default function StatsScreen() {
  const { colors } = useTheme();
  const { todos } = useTodos();
  const stats = getTodoStats(todos);

  const completionRate =
    stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Statistics</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Your productivity overview
        </Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.card,
            styles.heroCard,
            { backgroundColor: colors.primary + '20' },
          ]}
        >
          <Text style={[styles.heroLabel, { color: colors.primary }]}>
            Completion Rate
          </Text>
          <Text style={[styles.heroValue, { color: colors.primary }]}>
            {completionRate}%
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { backgroundColor: colors.primary, width: `${completionRate}%` },
              ]}
            />
          </View>
        </View>

        <View style={styles.grid}>
          <StatCard
            icon={<Circle size={24} color={colors.primary} />}
            label="Total Tasks"
            value={stats.total.toString()}
            color={colors.primary}
          />
          <StatCard
            icon={<CheckCircle2 size={24} color={colors.success} />}
            label="Completed"
            value={stats.completed.toString()}
            color={colors.success}
          />
          <StatCard
            icon={<TrendingUp size={24} color={colors.secondary} />}
            label="Active"
            value={stats.active.toString()}
            color={colors.secondary}
          />
          <StatCard
            icon={<AlertCircle size={24} color={colors.error} />}
            label="Overdue"
            value={stats.overdue.toString()}
            color={colors.error}
          />
        </View>

        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            Recent Activity
          </Text>
          <View style={styles.statRow}>
            <View style={styles.statRowLeft}>
              <Calendar size={20} color={colors.textSecondary} />
              <Text style={[styles.statRowLabel, { color: colors.text }]}>
                Completed Today
              </Text>
            </View>
            <Text style={[styles.statRowValue, { color: colors.success }]}>
              {stats.completedToday}
            </Text>
          </View>
          <View style={styles.statRow}>
            <View style={styles.statRowLeft}>
              <Calendar size={20} color={colors.textSecondary} />
              <Text style={[styles.statRowLabel, { color: colors.text }]}>
                Completed This Week
              </Text>
            </View>
            <Text style={[styles.statRowValue, { color: colors.success }]}>
              {stats.completedThisWeek}
            </Text>
          </View>
        </View>

        {stats.overdue > 0 && (
          <View
            style={[
              styles.card,
              { backgroundColor: colors.error + '10', borderColor: colors.error },
            ]}
          >
            <View style={styles.warningHeader}>
              <AlertCircle size={20} color={colors.error} />
              <Text style={[styles.cardTitle, { color: colors.error }]}>
                Action Required
              </Text>
            </View>
            <Text style={[styles.warningText, { color: colors.error }]}>
              You have {stats.overdue} overdue {stats.overdue === 1 ? 'task' : 'tasks'}.
              Consider completing or rescheduling them.
            </Text>
          </View>
        )}

        {stats.completedToday >= 5 && (
          <View
            style={[
              styles.card,
              { backgroundColor: colors.success + '10', borderColor: colors.success },
            ]}
          >
            <View style={styles.warningHeader}>
              <TrendingUp size={20} color={colors.success} />
              <Text style={[styles.cardTitle, { color: colors.success }]}>
                Great Progress!
              </Text>
            </View>
            <Text style={[styles.warningText, { color: colors.success }]}>
              You've completed {stats.completedToday} tasks today. Keep up the excellent
              work!
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  const { colors } = useTheme();

  return (
    <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
      <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>{icon}</View>
      <Text style={[styles.statValue, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{label}</Text>
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
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSize.md,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  card: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
  },
  heroCard: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  heroLabel: {
    fontSize: fontSize.md,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  heroValue: {
    fontSize: 64,
    fontWeight: 'bold',
    marginBottom: spacing.md,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  statValue: {
    fontSize: fontSize.xxl,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: fontSize.sm,
    textAlign: 'center',
  },
  cardTitle: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    marginBottom: spacing.md,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  statRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  statRowLabel: {
    fontSize: fontSize.md,
  },
  statRowValue: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  warningText: {
    fontSize: fontSize.md,
    lineHeight: fontSize.md * 1.5,
  },
});
