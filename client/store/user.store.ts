import { create } from "zustand";

export interface IUser = {
};

interface User {
  user: IUser | null;
  setUser: (user: IUser | null) => void;
}

export const useUserStore = create<User>((set) => ({
  user: null,
  setUser: (user: PUBLIC_USER | null) => set({ user: user }),
  updateUserFromServer: (user: USER | null) => {
    if (!user) {
      set({ user: null });
      return;
    }
    // Strip sensitive data before storing
    // eslint-disable-next-line
    const { isTrialUser, ...publicUser } = user;
    set({ user: publicUser });
  },
}));
