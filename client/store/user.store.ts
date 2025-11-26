import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface IUser {
  username: string;
  email: string;
}

type UserStore = {
  user: IUser | null;
  token: string | null;
  setToken: (token: string | null) => void;
  setUser: (user: IUser | null) => void;
};

const useUser = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setToken: (token) => set({ token }),
      setUser: (user) => set({ user }),
    }),
    {
      name: "devx-user",
      partialize: (state) => ({ token: state.token }),
    },
  ),
);

export default useUser;
