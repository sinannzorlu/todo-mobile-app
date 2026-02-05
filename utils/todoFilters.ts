import { Todo, TodoFilters } from '@/types/todo';

export function filterAndSortTodos(todos: Todo[], filters: TodoFilters): Todo[] {
  let filtered = [...todos];

  if (filters.filter === 'active') {
    filtered = filtered.filter(t => !t.completed);
  } else if (filters.filter === 'completed') {
    filtered = filtered.filter(t => t.completed);
  }

  if (filters.category) {
    filtered = filtered.filter(t => t.category_id === filters.category);
  }

  if (filters.search) {
    const search = filters.search.toLowerCase();
    filtered = filtered.filter(
      t =>
        t.title.toLowerCase().includes(search) ||
        t.description?.toLowerCase().includes(search) ||
        t.tags.some(tag => tag.toLowerCase().includes(search))
    );
  }

  filtered.sort((a, b) => {
    switch (filters.sortBy) {
      case 'created_at':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'due_date':
        if (!a.due_date && !b.due_date) return 0;
        if (!a.due_date) return 1;
        if (!b.due_date) return -1;
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      case 'priority':
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  return filtered;
}

export function getTodoStats(todos: Todo[]) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());

  const total = todos.length;
  const completed = todos.filter(t => t.completed).length;
  const active = total - completed;
  const overdue = todos.filter(
    t => !t.completed && t.due_date && new Date(t.due_date) < now
  ).length;
  const completedToday = todos.filter(
    t => t.completed && new Date(t.updated_at) >= today
  ).length;
  const completedThisWeek = todos.filter(
    t => t.completed && new Date(t.updated_at) >= weekStart
  ).length;

  return {
    total,
    completed,
    active,
    overdue,
    completedToday,
    completedThisWeek,
  };
}

export function isOverdue(todo: Todo): boolean {
  if (!todo.due_date || todo.completed) return false;
  return new Date(todo.due_date) < new Date();
}
