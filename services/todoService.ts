import { Todo, Priority, CategoryId, RecurringPattern } from '@/types/todo';

const MOCK_TODOS: Todo[] = [
  {
    id: '1',
    user_id: '1',
    title: 'Complete project documentation',
    description: 'Write comprehensive docs for the new feature',
    completed: false,
    priority: 'high',
    due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    category_id: 'work',
    tags: ['documentation', 'urgent'],
    is_recurring: false,
    order: 0,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    user_id: '1',
    title: 'Grocery shopping',
    description: 'Buy milk, eggs, bread',
    completed: false,
    priority: 'medium',
    due_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    category_id: 'shopping',
    tags: ['groceries'],
    is_recurring: true,
    recurring_pattern: 'weekly',
    order: 1,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    user_id: '1',
    title: 'Morning workout',
    completed: true,
    priority: 'high',
    category_id: 'health',
    tags: ['fitness', 'morning'],
    is_recurring: true,
    recurring_pattern: 'daily',
    order: 2,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    user_id: '1',
    title: 'Study React Native',
    description: 'Complete the Expo tutorial',
    completed: false,
    priority: 'low',
    due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    category_id: 'study',
    tags: ['learning', 'react-native'],
    is_recurring: false,
    order: 3,
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '5',
    user_id: '1',
    title: 'Call dentist',
    completed: false,
    priority: 'medium',
    due_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    category_id: 'personal',
    tags: ['health', 'appointment'],
    reminder: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(),
    is_recurring: false,
    order: 4,
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

let todos = [...MOCK_TODOS];

export const todoService = {
  async getTodos(): Promise<Todo[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...todos];
  },

  async createTodo(
    data: Omit<Todo, 'id' | 'user_id' | 'created_at' | 'updated_at'>
  ): Promise<Todo> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const newTodo: Todo = {
      ...data,
      id: Date.now().toString(),
      user_id: '1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    todos.push(newTodo);
    return newTodo;
  },

  async updateTodo(id: string, data: Partial<Todo>): Promise<Todo> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const index = todos.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Todo not found');
    }

    todos[index] = {
      ...todos[index],
      ...data,
      updated_at: new Date().toISOString(),
    };

    return todos[index];
  },

  async deleteTodo(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    todos = todos.filter(t => t.id !== id);
  },

  async toggleComplete(id: string): Promise<Todo> {
    const todo = todos.find(t => t.id === id);
    if (!todo) {
      throw new Error('Todo not found');
    }

    return this.updateTodo(id, { completed: !todo.completed });
  },
};
