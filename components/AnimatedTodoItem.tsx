import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Todo } from '@/types/todo';
import { Trash2, Circle, CheckCircle2 } from 'lucide-react-native';
import { spacing, fontSize } from '@/theme/spacing';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width - spacing.lg * 2;

interface AnimatedTodoItemProps {
  todo: Todo;
  onToggle: () => void;
  onPress: () => void;
  onDelete: () => void;
  index: number;
}

export function AnimatedTodoItem({
  todo,
  onToggle,
  onPress,
  onDelete,
}: AnimatedTodoItemProps) {
  const { colors } = useTheme();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return colors.error;
      case 'medium':
        return colors.warning;
      case 'low':
        return colors.success;
      default:
        return colors.textSecondary;
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onPress}
        style={[
          styles.card,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            width: ITEM_WIDTH,
          },
        ]}
        activeOpacity={0.7}
      >
        <TouchableOpacity onPress={onToggle} style={styles.checkbox}>
          {todo.completed ? (
            <CheckCircle2 size={24} color={colors.primary} />
          ) : (
            <Circle size={24} color={colors.textSecondary} />
          )}
        </TouchableOpacity>

        <View style={styles.content}>
          <Text
            style={[
              styles.title,
              {
                color: todo.completed ? colors.textSecondary : colors.text,
                textDecorationLine: todo.completed ? 'line-through' : 'none',
              },
            ]}
            numberOfLines={1}
          >
            {todo.title}
          </Text>
          {todo.description ? (
            <Text
              style={[styles.description, { color: colors.textSecondary }]}
              numberOfLines={2}
            >
              {todo.description}
            </Text>
          ) : null}
          <View style={styles.footer}>
            <View
              style={[
                styles.priorityBadge,
                { backgroundColor: getPriorityColor(todo.priority) + '20' },
              ]}
            >
              <Text
                style={[
                  styles.priorityText,
                  { color: getPriorityColor(todo.priority) },
                ]}
              >
                {todo.priority}
              </Text>
            </View>
            {todo.due_date && (
              <Text style={[styles.dueDate, { color: colors.textSecondary }]}>
                {new Date(todo.due_date).toLocaleDateString()}
              </Text>
            )}
          </View>
        </View>

        <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
          <Trash2 size={20} color={colors.error} />
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  card: {
    flexDirection: 'row',
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  checkbox: {
    marginRight: spacing.md,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: fontSize.md,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  description: {
    fontSize: fontSize.sm,
    marginBottom: spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  priorityBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  dueDate: {
    fontSize: fontSize.xs,
  },
  deleteButton: {
    padding: spacing.sm,
    marginLeft: spacing.sm,
  },
});
