// LocalStorage utility functions
export class LocalStorageService {
  // Generic get method
  static get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error getting ${key} from localStorage:`, error);
      return null;
    }
  }

  // Generic set method
  static set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting ${key} to localStorage:`, error);
    }
  }

  // Remove item
  static remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error);
    }
  }

  // Clear all localStorage
  static clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }

  // Check if localStorage is available
  static isAvailable(): boolean {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  // Get all keys
  static getAllKeys(): string[] {
    try {
      return Object.keys(localStorage);
    } catch (error) {
      console.error('Error getting localStorage keys:', error);
      return [];
    }
  }

  // Get storage size (approximate)
  static getStorageSize(): number {
    try {
      let total = 0;
      for (const key in localStorage) {
        if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
          total += localStorage[key].length + key.length;
        }
      }
      return total;
    } catch (error) {
      console.error('Error calculating storage size:', error);
      return 0;
    }
  }
}

// Specific storage keys - central management
export const STORAGE_KEYS = {
  FAVORITES: 'favorites-storage',
  USER_PREFERENCES: 'user-preferences',
  RECENT_VIEWS: 'recent-views',
  THEME: 'app-theme',
  LAST_VISITED_USER: 'last-visited-user',
  LAST_VISITED_ALBUM: 'last-visited-album',
  SEARCH_HISTORY: 'search-history',
} as const;

// User Preferences interface
export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  itemsPerPage: number;
  autoPlayImages: boolean;
  showNotifications: boolean;
  language: string;
}

// Recent views interface
export interface RecentView {
  id: number;
  type: 'user' | 'post' | 'album';
  title: string;
  timestamp: number;
  url: string;
}

// User preferences service
export class UserPreferencesService {
  private static defaultPreferences: UserPreferences = {
    theme: 'light',
    itemsPerPage: 12,
    autoPlayImages: true,
    showNotifications: true,
    language: 'en',
  };

  static getPreferences(): UserPreferences {
    const saved = LocalStorageService.get<UserPreferences>(STORAGE_KEYS.USER_PREFERENCES);
    return { ...this.defaultPreferences, ...saved };
  }

  static setPreferences(preferences: Partial<UserPreferences>): void {
    const current = this.getPreferences();
    const updated = { ...current, ...preferences };
    LocalStorageService.set(STORAGE_KEYS.USER_PREFERENCES, updated);
  }

  static resetPreferences(): void {
    LocalStorageService.set(STORAGE_KEYS.USER_PREFERENCES, this.defaultPreferences);
  }
}

// Recent views service
export class RecentViewsService {
  private static maxItems = 10;

  static getRecentViews(): RecentView[] {
    return LocalStorageService.get<RecentView[]>(STORAGE_KEYS.RECENT_VIEWS) || [];
  }

  static addRecentView(view: Omit<RecentView, 'timestamp'>): void {
    const recentViews = this.getRecentViews();
    
    // Remove if already exists
    const filtered = recentViews.filter(
      item => !(item.type === view.type && item.id === view.id)
    );
    
    // Add new view at the beginning
    const updated = [
      { ...view, timestamp: Date.now() },
      ...filtered
    ].slice(0, this.maxItems);
    
    LocalStorageService.set(STORAGE_KEYS.RECENT_VIEWS, updated);
  }

  static clearRecentViews(): void {
    LocalStorageService.remove(STORAGE_KEYS.RECENT_VIEWS);
  }
}

// Theme service
export class ThemeService {
  static getTheme(): 'light' | 'dark' | 'auto' {
    return LocalStorageService.get<'light' | 'dark' | 'auto'>(STORAGE_KEYS.THEME) || 'light';
  }

  static setTheme(theme: 'light' | 'dark' | 'auto'): void {
    LocalStorageService.set(STORAGE_KEYS.THEME, theme);
    this.applyTheme(theme);
  }

  static applyTheme(theme: 'light' | 'dark' | 'auto'): void {
    const root = document.documentElement;
    
    if (theme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.setAttribute('data-bs-theme', prefersDark ? 'dark' : 'light');
    } else {
      root.setAttribute('data-bs-theme', theme);
    }
  }

  static initializeTheme(): void {
    const savedTheme = this.getTheme();
    this.applyTheme(savedTheme);
  }
}