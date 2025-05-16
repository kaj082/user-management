import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

interface UserState {
  users: User[];
  currentUser: User | null;

  addUser: (user: Omit<User, "id">) => void;
  setCurrentUser: (user: User | null) => void;
  updateUser: (updatedUser: User) => void;
  logout: () => void;
}

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      users: [],
      currentUser: null,

      addUser: (user) => {
        const userWithId: User = { ...user, id: generateId() };
        const updatedUsers = [...get().users, userWithId];
        set({ users: updatedUsers, currentUser: userWithId });
      },

      setCurrentUser: (user) => {
        set({ currentUser: user });
      },

      updateUser: (updatedUser) => {
        const users = get().users.map((u) =>
          u.id === updatedUser.id ? updatedUser : u
        );
        set({ users, currentUser: updatedUser });
      },

      logout: () => {
        set({ currentUser: null });
      },
    }),
    {
      name: "user-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
