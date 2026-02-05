import React, { createContext, useContext, useState, useEffect } from 'react';
import { Todo, TodoFilters, FilterType, SortType } from '@/types/todo';
import { todoService } from '@/services/todoService';

interface TodoContextType {
  todos: Todo[];
  filters: TodoFilters;
  isLoading: boolean;
  error: string | null;
  refreshTodos: () => Promise<void>;
  addTodo: (todo: Omit<Todo, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateTodo: (id: string, data: Partial<Todo>) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  toggleComplete: (id: string) => Promise<void>;
  setFilter: (filter: FilterType) => void;
  setCategory: (category: string | undefined) => void;
  setSearch: (search: string) => void;
  setSortBy: (sortBy: SortType) => void;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export function TodoProvider({ children }: { children: React.ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filters, setFilters] = useState<TodoFilters>({
    filter: 'all',
    search: '',
    sortBy: 'created_at',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await todoService.getTodos();
      setTodos(data);
    } catch (err) {
      setError('Failed to load todos');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshTodos = async () => {
    await loadTodos();
  };

  const addTodo = async (todo: Omit<Todo, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      setError(null);
      const newTodo = await todoService.createTodo(todo);
      setTodos(prev => [...prev, newTodo]);
    } catch (err) {
      setError('Failed to add todo');
      throw err;
    }
  };

  const updateTodo = async (id: string, data: Partial<Todo>) => {
    try {
      setError(null);
      const updatedTodo = await todoService.updateTodo(id, data);
      setTodos(prev => prev.map(t => (t.id === id ? updatedTodo : t)));
    } catch (err) {
      setError('Failed to update todo');
      throw err;
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      setError(null);
      await todoService.deleteTodo(id);
      setTodos(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      setError('Failed to delete todo');
      throw err;
    }
  };

  const toggleComplete = async (id: string) => {
    try {
      setError(null);
      const updatedTodo = await todoService.toggleComplete(id);
      setTodos(prev => prev.map(t => (t.id === id ? updatedTodo : t)));
    } catch (err) {
      setError('Failed to toggle todo');
      throw err;
    }
  };

  const setFilter = (filter: FilterType) => {
    setFilters(prev => ({ ...prev, filter }));
  };

  const setCategory = (category: string | undefined) => {
    setFilters(prev => ({ ...prev, category: category as any }));
  };

  const setSearch = (search: string) => {
    setFilters(prev => ({ ...prev, search }));
  };

  const setSortBy = (sortBy: SortType) => {
    setFilters(prev => ({ ...prev, sortBy }));
  };

  return (
    <TodoContext.Provider
      value={{
        todos,
        filters,
        isLoading,
        error,
        refreshTodos,
        addTodo,
        updateTodo,
        deleteTodo,
        toggleComplete,
        setFilter,
        setCategory,
        setSearch,
        setSortBy,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
}

export function useTodos() {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error('useTodos must be used within a TodoProvider');
  }
  return context;
}
