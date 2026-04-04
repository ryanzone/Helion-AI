import { create } from 'zustand';
import { setToken } from '../services/api';

interface User {
    id: string;
    email: string;
    name: string;
    phone: string;
    location: string;
}

interface AppState {
    isLoggedIn: boolean;
    user: User | null;
    token: string | null;
    setUser: (user: User | null) => void;
    setLoggedIn: (isLoggedIn: boolean) => void;
    setToken: (token: string | null) => void;
    logout: () => void;
}

export const useStore = create<AppState>((set) => ({
    isLoggedIn: false,
    user: null,
    token: null,
    setUser: (user) => set({ user }),
    setLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
    setToken: (token) => {
        setToken(token); // syncs it into api.ts module-level variable
        set({ token });
    },
    logout: () => {
        setToken(null);
        set({ user: null, isLoggedIn: false, token: null });
    },
}));