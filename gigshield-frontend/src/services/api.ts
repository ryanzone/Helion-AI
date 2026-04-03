const BASE_URL = "https://helion-ai.onrender.com";

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
        return data;
    },

    register: async (userData: any) => {
        const res = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: headers(),
            body: JSON.stringify(userData),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Register failed');
        return data;
    },

    getDashboard: async () => {
        const res = await fetch(`${BASE_URL}/dashboard`, { headers: headers() });
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

    subscribePlan: async (plan_id: string, city_pool: string) => {
        const res = await fetch(`${BASE_URL}/plans/subscribe`, {
            method: 'POST',
            headers: headers(),
            body: JSON.stringify({ plan_id, city_pool }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        return data;
    },

    getSubscriptions: async () => {
        const res = await fetch(`${BASE_URL}/subscriptions`, { headers: headers() });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        return data;
    },
};

