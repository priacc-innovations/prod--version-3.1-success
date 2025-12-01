import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface User {
  id: number;
  empid: number | string;
  fullName: string;
  email: string;
  role: "admin" | "hr" | "employee" | "trainer";
  photoUrl: string;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  theme: "light" | "dark";

  setUser: (data: User) => void;
  updateUser: (data: Partial<User>) => void;
  clearUser: () => void;
  toggleTheme: () => void;

  refreshUser: () => Promise<void>;  // ⭐ NEW
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      theme: "light",

      setUser: (data) =>
        set({
          user: data,
          isAuthenticated: true,
        }),

      updateUser: (updatedFields) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedFields } : null,
        })),

      clearUser: () =>
        set({
          user: null,
          isAuthenticated: false,
        }),

      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === "dark" ? "light" : "dark",
        })),

      // ⭐ REFRESH SIGNED PHOTO URL RIGHT AFTER LOGIN
      refreshUser: async () => {
        const state = get();
        if (!state.user?.id) return;

        try {
          const res = await fetch(`/api/user/${state.user.id}`);
          const data = await res.json();

          set({ user: data }); // update full user with signed photo URL
        } catch (err) {
          console.error("Failed to refresh user", err);
        }
      },
    }),
    {
      name: "mama-auth-store",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        theme: state.theme,
      }),
    }
  )
);
