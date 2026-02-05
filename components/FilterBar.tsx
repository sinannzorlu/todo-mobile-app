import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useTodos } from '@/context/TodoContext';
import { FilterType, SortType } from '@/types/todo';
import { CATEGORIES } from '@/constants/categories';
import { spacing, borderRadius, fontSize } from '@/theme/spacing';
import { Filter, X } from 'lucide-react-native';

export function FilterBar() {
  const { colors } = useTheme();
  const { filters, setFilter, setCategory, setSortBy } = useTodos();
  const [showModal, setShowModal] = useState(false);

  const filterOptions: { value: FilterType; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
  ];

  const sortOptions: { value: SortType; label: string }[] = [
    { value: 'created_at', label: 'Created Date' },
    { value: 'due_date', label: 'Due Date' },
    { value: 'priority', label: 'Priority' },
    { value: 'title', label: 'Name (A-Z)' },
  ];

  return (
    <>
      <View style={styles.container}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {filterOptions.map(option => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.chip,
                {
                  backgroundColor:
                    filters.filter === option.value
                      ? colors.primary
                      : colors.surface,
                  borderColor: colors.border,
                },
              ]}
              onPress={() => setFilter(option.value)}
            >
              <Text
                style={[
                  styles.chipText,
                  {
                    color:
                      filters.filter === option.value
                        ? '#ffffff'
                        : colors.text,
                  },
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={[
              styles.chip,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
            onPress={() => setShowModal(true)}
          >
            <Filter size={16} color={colors.text} />
            <Text style={[styles.chipText, { color: colors.text }]}>
              More Filters
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <Modal
        visible={showModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Filters & Sort
              </Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                Category
              </Text>
              <View style={styles.options}>
                <TouchableOpacity
                  style={[
                    styles.option,
                    {
                      backgroundColor: !filters.category
                        ? colors.primary + '20'
                        : colors.surface,
                      borderColor: colors.border,
                    },
                  ]}
                  onPress={() => setCategory(undefined)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      { color: !filters.category ? colors.primary : colors.text },
                    ]}
                  >
                    All Categories
                  </Text>
                </TouchableOpacity>
                {CATEGORIES.map(cat => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.option,
                      {
                        backgroundColor:
                          filters.category === cat.id
                            ? colors.primary + '20'
                            : colors.surface,
                        borderColor: colors.border,
                      },
                    ]}
                    onPress={() => setCategory(cat.id)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        {
                          color:
                            filters.category === cat.id ? colors.primary : colors.text,
                        },
                      ]}
                    >
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                Sort By
              </Text>
              <View style={styles.options}>
                {sortOptions.map(option => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.option,
                      {
                        backgroundColor:
                          filters.sortBy === option.value
                            ? colors.primary + '20'
                            : colors.surface,
                        borderColor: colors.border,
                      },
                    ]}
                    onPress={() => {
                      setSortBy(option.value);
                      setShowModal(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        {
                          color:
                            filters.sortBy === option.value
                              ? colors.primary
                              : colors.text,
                        },
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.sm,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    gap: spacing.xs,
  },
  chipText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.lg,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  modalTitle: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
  },
  options: {
    gap: spacing.sm,
  },
  option: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
  },
  optionText: {
    fontSize: fontSize.md,
    fontWeight: '600',
  },
});
