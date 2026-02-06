import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useTodos } from '@/context/TodoContext';
import { Input } from '@/components/ui/Input';
import { AnimatedTodoItem } from '@/components/AnimatedTodoItem';
import { FilterBar } from '@/components/FilterBar';
import { filterAndSortTodos, getTodoStats } from '@/utils/todoFilters';
import { spacing, fontSize } from '@/theme/spacing';
import { Plus, Search, AlertCircle } from 'lucide-react-native';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

export default function TodoListScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const {
    todos,
    filters,
    isLoading,
    error,
    refreshTodos,
    toggleComplete,
    deleteTodo,
    setSearch,
  } = useTodos();

  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const filteredTodos = filterAndSortTodos(todos, filters);
  const stats = getTodoStats(todos);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setSearch(searchQuery);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshTodos();
    setRefreshing(false);
  };

  const handleToggle = async (id: string) => {
    try {
      await toggleComplete(id);
      const todo = todos.find(t => t.id === id);
      if (todo && !todo.completed && stats.completedToday >= 4) {
        setTimeout(() => {
          setAlertTitle('Great Job!');
          setAlertMessage(`You've completed ${stats.completedToday + 1} tasks today! Keep it up!`);
          setAlertVisible(true);
        }, 300);
      }
    } catch (err) {
      setAlertTitle('Error');
      setAlertMessage('Failed to update todo');
      setAlertVisible(true);
    }
  };

  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setTodoToDelete(id);
    setDeleteConfirmVisible(true);
  };

  const onConfirmDelete = async () => {
    if (todoToDelete) {
      try {
        await deleteTodo(todoToDelete);
      } catch (err) {
        setAlertTitle('Error');
        setAlertMessage('Failed to delete todo');
        setAlertVisible(true);
      }
    }
    setDeleteConfirmVisible(false);
    setTodoToDelete(null);
  };

  const handleEdit = (id: string) => {
    router.push(`/add-todo?id=${id}`);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>My Todos</Text>
        <View style={styles.headerStats}>
          {stats.overdue > 0 && (
            <View style={[styles.badge, { backgroundColor: colors.error + '20' }]}>
              <AlertCircle size={14} color={colors.error} />
              <Text style={[styles.badgeText, { color: colors.error }]}>
                {stats.overdue} overdue
              </Text>
            </View>
          )}
          <Text style={[styles.stats, { color: colors.textSecondary }]}>
            {stats.active} active • {stats.completed} completed
          </Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Input
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search todos..."
          style={styles.searchInput}
        />
      </View>

      <FilterBar />

      {error && (
        <View style={[styles.errorContainer, { backgroundColor: colors.error + '20' }]}>
          <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
        </View>
      )}

      <FlatList
        data={filteredTodos}
        keyExtractor={item => item.id}
        renderItem={({ item, index }) => (
          <AnimatedTodoItem
            todo={item}
            onToggle={() => handleToggle(item.id)}
            onPress={() => handleEdit(item.id)}
            onDelete={() => handleDelete(item.id)}
            index={index}
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              {searchQuery || filters.filter !== 'all' || filters.category
                ? 'No todos found'
                : 'No todos yet. Create your first todo!'}
            </Text>
          </View>
        }
      />

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => router.push('/add-todo')}
        activeOpacity={0.8}
      >
        <Plus size={28} color="#ffffff" />
      </TouchableOpacity>

      <ConfirmDialog
        visible={deleteConfirmVisible}
        title="Delete Todo"
        message="Are you sure you want to delete this todo?"
        confirmLabel="Delete"
        cancelLabel="Cancel"
        isDestructive
        onConfirm={onConfirmDelete}
        onCancel={() => setDeleteConfirmVisible(false)}
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
    marginBottom: spacing.xs,
  },
  headerStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
  stats: {
    fontSize: fontSize.sm,
  },
  searchContainer: {
    paddingHorizontal: spacing.lg,
  },
  searchInput: {
    marginBottom: 0,
  },
  errorContainer: {
    marginHorizontal: spacing.lg,
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.sm,
  },
  errorText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  listContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl * 2,
  },
  emptyContainer: {
    paddingTop: spacing.xxl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: fontSize.md,
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.xxl + spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
