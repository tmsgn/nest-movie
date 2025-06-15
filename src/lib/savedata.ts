export function saveToLocalStorage<T>(key: string, data: T): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(data));
  }
}

export function loadFromLocalStorage<T>(key: string): T | null {
  if (typeof window !== "undefined") {
    const item = localStorage.getItem(key);
    if (item) {
      try {
        return JSON.parse(item) as T;
      } catch {
        return null;
      }
    }
  }
  return null;
}