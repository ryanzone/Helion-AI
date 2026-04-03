// Expo Web should have `process.env`, but guard defensively to avoid crashing the app
// with `process is not defined` when env polyfills are missing.
const BASE_URL =
    (typeof process !== 'undefined' &&
        process.env &&
        process.env.EXPO_PUBLIC_API_URL) ||
    'http://localhost:3001/api';

let authToken: string | null = null;

export const setToken = (token: string | null) => {
    authToken = token;
};

const headers = () => ({
    'Content-Type': 'application/json',
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
});

export const api = {
    login: async (email: string, password: string) => {
        const res = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: headers(),
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Login failed');
        return data; // { token, user }
    },

    register: async (userData: any) => {
        const res = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: headers(),
            body: JSON.stringify(userData),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Register failed');
        return data; // { token, user }
    },

    getDashboard: async () => {
        const res = await fetch(`${BASE_URL}/dashboard`, { headers: headers() });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        return data;
    },

    getClaims: async (status?: string) => {
        const url = status ? `${BASE_URL}/claims?status=${status}` : `${BASE_URL}/claims`;
        const res = await fetch(url, { headers: headers() });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        return data;
    },

    fileClaim: async (claim: any) => {
        const res = await fetch(`${BASE_URL}/claims`, {
            method: 'POST',
            headers: headers(),
            body: JSON.stringify(claim),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        return data;
    },

    getEarnings: async () => {
        const res = await fetch(`${BASE_URL}/earnings`, { headers: headers() });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        return data;
    },

    getHealth: async () => {
        const res = await fetch(`${BASE_URL}/health`, { headers: headers() });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        return data;
    },

    getProfile: async () => {
        const res = await fetch(`${BASE_URL}/profile`, { headers: headers() });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        return data;
    },

    updateProfile: async (updates: any) => {
        const res = await fetch(`${BASE_URL}/profile`, {
            method: 'PUT',
            headers: headers(),
            body: JSON.stringify(updates),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        return data;
    },

    getPayouts: async () => {
        const res = await fetch(`${BASE_URL}/payouts`, { headers: headers() });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        return data;
    },

    getPlans: async () => {
        const res = await fetch(`${BASE_URL}/plans`, { headers: headers() });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        return data;
    },

    getPlan: async (id: string) => {
        const res = await fetch(`${BASE_URL}/plans/${id}`, { headers: headers() });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        return data;
    },
};