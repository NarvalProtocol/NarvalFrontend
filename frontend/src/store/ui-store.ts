import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  isDarkMode: boolean;
  isSidebarOpen: boolean;
  activeTab: string;
  
  setDarkMode: (isDark: boolean) => void;
  toggleSidebar: () => void;
  setActiveTab: (tab: string) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      isDarkMode: false,
      isSidebarOpen: false,
      activeTab: 'assets',
      
      setDarkMode: (isDark) => set({ isDarkMode: isDark }),
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      setActiveTab: (tab) => set({ activeTab: tab }),
    }),
    {
      name: 'ui-storage', // Local storage key name
      partialize: (state) => ({ isDarkMode: state.isDarkMode }), // Only persist dark mode settings
    }
  )
); 