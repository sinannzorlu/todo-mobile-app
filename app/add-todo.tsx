import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useTodos } from '@/context/TodoContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Priority, CategoryId, RecurringPattern } from '@/types/todo';
import { CATEGORIES } from '@/constants/categories';
import { spacing, borderRadius, fontSize } from '@/theme/spacing';
import { X, Calendar, Tag as TagIcon } from 'lucide-react-native';

export default function AddTodoScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { todos, addTodo, updateTodo } = useTodos();

  const isEdit = !!id;
  const existingTodo = isEdit ? todos.find(t => t.id === id) : null;

  const [title, setTitle] = useState(existingTodo?.title || '');
  const [description, setDescription] = useState(existingTodo?.description || '');
  const [priority, setPriority] = useState<Priority>(existingTodo?.priority || 'medium');
  const [categoryId, setCategoryId] = useState<CategoryId | undefined>(
    existingTodo?.category_id
  );
  const [dueDate, setDueDate] = useState(existingTodo?.due_date || '');
  const [tags, setTags] = useState<string[]>(existingTodo?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [isRecurring, setIsRecurring] = useState(existingTodo?.is_recurring || false);
  const [recurringPattern, setRecurringPattern] = useState<RecurringPattern>(
    existingTodo?.recurring_pattern || 'daily'
  );
  const [hasReminder, setHasReminder] = useState(!!existingTodo?.reminder);

  const [titleError, setTitleError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const priorityOptions: Priority[] = ['low', 'medium', 'high'];
  const recurringOptions: RecurringPattern[] = ['daily', 'weekly', 'monthly'];

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleSetDueDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setDueDate(tomorrow.toISOString());
  };

  const handleSave = async () => {
    setTitleError('');

    if (!title.trim()) {
      setTitleError('Title is required');
      return;
    }

    setIsLoading(true);

    try {
      const todoData = {
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        category_id: categoryId,
        due_date: dueDate || undefined,
        tags,
        is_recurring: isRecurring,
        recurring_pattern: isRecurring ? recurringPattern : undefined,
        reminder: hasReminder && dueDate ? dueDate : undefined,
        completed: existingTodo?.completed || false,
        order: existingTodo?.order || 0,
      };

      if (isEdit && id) {
        await updateTodo(id as string, todoData);
      } else {
        await addTodo(todoData);
      }

      router.back();
    } catch (err) {
      Alert.alert('Error', 'Failed to save todo');
    } finally {
      setIsLoading(false);
    }
  };

  const getPriorityColor = (p: Priority) => {
    switch (p) {
      case 'high':
        return colors.priorityHigh;
      case 'medium':
        return colors.priorityMedium;
      case 'low':
        return colors.priorityLow;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
          <X size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {isEdit ? 'Edit Todo' : 'New Todo'}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Input
          label="Title"
          value={title}
          onChangeText={setTitle}
          placeholder="What needs to be done?"
          error={titleError}
        />

        <Input
          label="Description"
          value={description}
          onChangeText={setDescription}
          placeholder="Add more details..."
          multiline
          numberOfLines={3}
          style={styles.textArea}
        />

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Priority</Text>
          <View style={styles.row}>
            {priorityOptions.map(p => (
              <TouchableOpacity
                key={p}
                style={[
                  styles.chip,
                  {
                    backgroundColor:
                      priority === p ? getPriorityColor(p) + '20' : colors.surface,
                    borderColor: priority === p ? getPriorityColor(p) : colors.border,
                  },
                ]}
                onPress={() => setPriority(p)}
              >
                <Text
                  style={[
                    styles.chipText,
                    {
                      color: priority === p ? getPriorityColor(p) : colors.text,
                    },
                  ]}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Category</Text>
          <View style={styles.row}>
            <TouchableOpacity
              style={[
                styles.chip,
                {
                  backgroundColor: !categoryId ? colors.primary + '20' : colors.surface,
                  borderColor: !categoryId ? colors.primary : colors.border,
                },
              ]}
              onPress={() => setCategoryId(undefined)}
            >
              <Text
                style={[
                  styles.chipText,
                  { color: !categoryId ? colors.primary : colors.text },
                ]}
              >
                None
              </Text>
            </TouchableOpacity>
            {CATEGORIES.map(cat => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.chip,
                  {
                    backgroundColor:
                      categoryId === cat.id ? colors.primary + '20' : colors.surface,
                    borderColor: categoryId === cat.id ? colors.primary : colors.border,
                  },
                ]}
                onPress={() => setCategoryId(cat.id)}
              >
                <Text
                  style={[
                    styles.chipText,
                    { color: categoryId === cat.id ? colors.primary : colors.text },
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Due Date</Text>
          {dueDate ? (
            <View style={styles.row}>
              <View
                style={[
                  styles.dateDisplay,
                  { backgroundColor: colors.surface, borderColor: colors.border },
                ]}
              >
                <Calendar size={16} color={colors.primary} />
                <Text style={[styles.dateText, { color: colors.text }]}>
                  {new Date(dueDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setDueDate('')}>
                <Text style={[styles.link, { color: colors.error }]}>Clear</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Button
              title="Set Due Date"
              onPress={handleSetDueDate}
              variant="outline"
              size="sm"
            />
          )}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Tags</Text>
          <View style={styles.tagInput}>
            <Input
              value={tagInput}
              onChangeText={setTagInput}
              placeholder="Add a tag..."
              onSubmitEditing={handleAddTag}
              style={{ flex: 1 }}
            />
            <Button title="Add" onPress={handleAddTag} size="sm" />
          </View>
          {tags.length > 0 && (
            <View style={styles.tagList}>
              {tags.map(tag => (
                <View
                  key={tag}
                  style={[
                    styles.tag,
                    { backgroundColor: colors.primary + '20', borderColor: colors.primary },
                  ]}
                >
                  <TagIcon size={14} color={colors.primary} />
                  <Text style={[styles.tagText, { color: colors.primary }]}>{tag}</Text>
                  <TouchableOpacity onPress={() => handleRemoveTag(tag)}>
                    <X size={14} color={colors.primary} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={[styles.switchRow, { borderTopColor: colors.border }]}>
          <Text style={[styles.switchLabel, { color: colors.text }]}>Reminder</Text>
          <Switch
            value={hasReminder}
            onValueChange={setHasReminder}
            trackColor={{ false: colors.border, true: colors.primary }}
          />
        </View>

        <View style={[styles.switchRow, { borderTopColor: colors.border }]}>
          <Text style={[styles.switchLabel, { color: colors.text }]}>Recurring</Text>
          <Switch
            value={isRecurring}
            onValueChange={setIsRecurring}
            trackColor={{ false: colors.border, true: colors.primary }}
          />
        </View>

        {isRecurring && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Repeat Pattern
            </Text>
            <View style={styles.row}>
              {recurringOptions.map(pattern => (
                <TouchableOpacity
                  key={pattern}
                  style={[
                    styles.chip,
                    {
                      backgroundColor:
                        recurringPattern === pattern
                          ? colors.primary + '20'
                          : colors.surface,
                      borderColor:
                        recurringPattern === pattern ? colors.primary : colors.border,
                    },
                  ]}
                  onPress={() => setRecurringPattern(pattern)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      {
                        color:
                          recurringPattern === pattern ? colors.primary : colors.text,
                      },
                    ]}
                  >
                    {pattern.charAt(0).toUpperCase() + pattern.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <Button
          title="Cancel"
          onPress={() => router.back()}
          variant="outline"
          style={{ flex: 1 }}
        />
        <Button
          title={isEdit ? 'Update' : 'Create'}
          onPress={handleSave}
          loading={isLoading}
          style={{ flex: 1 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.xxl,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
  },
  closeButton: {
    padding: spacing.xs,
  },
  headerTitle: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  textArea: {
    height: 80,
    paddingTop: spacing.md,
    textAlignVertical: 'top',
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  chipText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  dateDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
  },
  dateText: {
    fontSize: fontSize.md,
  },
  link: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    textDecorationLine: 'underline',
    paddingHorizontal: spacing.sm,
  },
  tagInput: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-start',
  },
  tagList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  tagText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderTopWidth: 1,
  },
  switchLabel: {
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.lg,
    borderTopWidth: 1,
  },
});
