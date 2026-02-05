import { CategoryId } from '@/types/todo';

export interface Category {
  id: CategoryId;
  label: string;
  icon: string;
}

export const CATEGORIES: Category[] = [
  { id: 'work', label: 'Work', icon: 'briefcase' },
  { id: 'personal', label: 'Personal', icon: 'user' },
  { id: 'study', label: 'Study', icon: 'book' },
  { id: 'health', label: 'Health', icon: 'heart' },
  { id: 'shopping', label: 'Shopping', icon: 'shopping-cart' },
];

export const getCategoryById = (id?: CategoryId): Category | undefined => {
  return CATEGORIES.find(cat => cat.id === id);
};
