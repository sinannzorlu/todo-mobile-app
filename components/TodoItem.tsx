import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Todo } from '@/types/todo';
import { spacing, borderRadius, fontSize } from '@/theme/spacing';
import { getCategoryById } from '@/constants/categories';
import { isOverdue } from '@/utils/todoFilters';
import {
  CheckCircle2,
  Circle,
  Calendar,
  Flag,
  Repeat,
  Tag,
  Trash2,
} from 'lucide-react-native';

interface TodoItemProps {
  todo: Todo;
  onToggle: () => void;
  onPress: () => void;
  onDelete: () => void;
}

export function TodoItem({ todo, onToggle, onPress, onDelete }: TodoItemProps) {
  const { colors } = useTheme();
  const category = getCategoryById(todo.category_id);
  const overdue = isOverdue(todo);

  const getPriorityColor = () => {
    switch (todo.priority) {
      case 'high':
        return colors.priorityHigh;
      case 'medium':
        return colors.priorityMedium;
      case 'low':
        return colors.priorityLow;
      default:
        return colors.textTertiary;
    }
  };

  const getCategoryColor = () => {
    if (!todo.category_id) return colors.textTertiary;
    switch (todo.category_id) {
      case 'work':
        return colors.categoryWork;
      case 'personal':
        return colors.categoryPersonal;
      case 'study':
        return colors.categoryStudy;
      case 'health':
        return colors.categoryHealth;
      case 'shopping':
        return colors.categoryShopping;
      default:
        return colors.textTertiary;
    }
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (d.toDateString() === today.toDateString()) return 'Today';
    if (d.toDateString() === tomorrow.toDateString()) return 'Tomorrow';

    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: overdue && !todo.completed ? colors.error : colors.border,
        },
      ]}
    >
      <TouchableOpacity onPress={onToggle} style={styles.checkbox}>
        {todo.completed ? (
          <CheckCircle2 size={24} color={colors.success} />
        ) : (
          <Circle size={24} color={colors.textTertiary} />
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.content} onPress={onPress} activeOpacity={0.7}>
        <View style={styles.header}>
          <Text
            style={[
              styles.title,
              {
                color: todo.completed ? colors.textTertiary : colors.text,
                textDecorationLine: todo.completed ? 'line-through' : 'none',
              },
            ]}
            numberOfLines={1}
          >
            {todo.title}
          </Text>
          <Flag size={16} color={getPriorityColor()} fill={getPriorityColor()} />
        </View>

        {todo.description && (
          <Text
            style={[styles.description, { color: colors.textSecondary }]}
            numberOfLines={2}
          >
            {todo.description}
          </Text>
        )}

        <View style={styles.footer}>
          <View style={styles.metadata}>
            {todo.due_date && (
              <View style={styles.metadataItem}>
                <Calendar
                  size={14}
                  color={overdue && !todo.completed ? colors.error : colors.textSecondary}
                />
                <Text
                  style={[
                    styles.metadataText,
                    {
                      color: overdue && !todo.completed ? colors.error : colors.textSecondary,
                    },
                  ]}
                >
                  {formatDate(todo.due_date)}
                </Text>
              </View>
            )}

            {todo.category_id && category && (
              <View
                style={[
                  styles.categoryBadge,
                  { backgroundColor: getCategoryColor() + '20' },
                ]}
              >
                <Text
                  style={[styles.categoryText, { color: getCategoryColor() }]}
                >
                  {category.label}
                </Text>
              </View>
            )}

            {todo.is_recurring && (
              <View style={styles.metadataItem}>
                <Repeat size={14} color={colors.textSecondary} />
              </View>
            )}

            {todo.tags.length > 0 && (
              <View style={styles.metadataItem}>
                <Tag size={14} color={colors.textSecondary} />
                <Text style={[styles.metadataText, { color: colors.textSecondary }]}>
                  {todo.tags.length}
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
        <Trash2 size={20} color={colors.error} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    marginBottom: spacing.sm,
  },
  checkbox: {
    marginRight: spacing.md,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  title: {
    flex: 1,
    fontSize: fontSize.md,
    fontWeight: '600',
    marginRight: spacing.sm,
  },
  description: {
    fontSize: fontSize.sm,
    marginBottom: spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metadataText: {
    fontSize: fontSize.xs,
  },
  categoryBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  categoryText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
  deleteButton: {
    marginLeft: spacing.md,
    padding: spacing.xs,
  },
});
