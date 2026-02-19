const STORAGE_KEY = 'user_id';

export function getUserId(): string {
  if (typeof window === 'undefined') return '';

  let userId = localStorage.getItem(STORAGE_KEY);
  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem(STORAGE_KEY, userId);
  }
  return userId;
}
