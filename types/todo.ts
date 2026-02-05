export type Priority = 'low' | 'medium' | 'high';
export type CategoryId = 'work' | 'personal' | 'study' | 'health' | 'shopping';
export type RecurringPattern = 'daily' | 'weekly' | 'monthly';

export interface Todo {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  due_date?: string;
  category_id?: CategoryId;
  tags: string[];
  reminder?: string;
  is_recurring: boolean;
  recurring_pattern?: RecurringPattern;
  order: number;
  created_at: string;
  updated_at: string;
}

export type FilterType = 'all' | 'active' | 'completed';
export type SortType = 'created_at' | 'due_date' | 'priority' | 'title';

export interface TodoFilters {
  filter: FilterType;
  category?: CategoryId;
  search: string;
  sortBy: SortType;
}
