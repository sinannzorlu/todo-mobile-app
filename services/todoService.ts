import { Todo, Priority, CategoryId, RecurringPattern } from '@/types/todo';
import { supabase } from '@/utils/supabase';

export const todoService = {
  async getTodos(): Promise<Todo[]> {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching todos:', error);
      throw error;
    }
    return data || [];
  },

  async createTodo(
    data: Omit<Todo, 'id' | 'user_id' | 'created_at' | 'updated_at'>
  ): Promise<Todo> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const todoData = {
      ...data,
      user_id: user.id,
      // Ensure ISO strings are preserved
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: newTodo, error } = await supabase
      .from('todos')
      .insert(todoData)
      .select()
      .single();

    if (error) {
      console.error('Error creating todo:', error);
      throw error;
    }
    return newTodo;
  },

  async updateTodo(id: string, data: Partial<Todo>): Promise<Todo> {
    const { data: updatedTodo, error } = await supabase
      .from('todos')
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating todo:', error);
      throw error;
    }
    return updatedTodo;
  },

  async deleteTodo(id: string): Promise<void> {
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting todo:', error);
      throw error;
    }
  },

  async toggleComplete(id: string): Promise<Todo> {
    // First get current status
    const { data: current, error: fetchError } = await supabase
      .from('todos')
      .select('completed')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    return this.updateTodo(id, { completed: !current.completed });
  },
};
