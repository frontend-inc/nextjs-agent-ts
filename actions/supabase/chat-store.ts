import { generateUUID } from '@/lib/utils';

const STORAGE_KEY = 'user_id';

export function getUserId(): string {
  if (typeof window === 'undefined') return '';

  let userId = localStorage.getItem(STORAGE_KEY);
  if (!userId) {
    userId = generateUUID();
    localStorage.setItem(STORAGE_KEY, userId);
  }
  return userId;
}
