const BASE_URL = 'http://10.3.33.162:3001/api';
const ML_URL = 'http://10.3.33.162:8000'; // ML Microservice

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
    subscribePlan: async (plan_id: string, city_pool: string) => {
    const res = await fetch(`${BASE_URL}/plans/subscribe`, {
        method: 'POST', headers: headers(),
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

getTriggers: async () => {
    const res = await fetch(`${BASE_URL}/triggers`, { headers: headers() });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data;
},

checkTrigger: async (payload: { peril_type: string; metric_value: number; city_pool: string; data_source?: string }) => {
    const res = await fetch(`${BASE_URL}/triggers/check`, {
        method: 'POST', headers: headers(),
        body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data;
},

getPremium: async () => {
    const res = await fetch(`${BASE_URL}/premium/calculate`, { headers: headers() });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data;
},

logActivity: async (activity: { activity_date: string; hours_active?: number; deliveries_count?: number; city?: string; platform?: string }) => {
    const res = await fetch(`${BASE_URL}/worker/activity`, {
        method: 'POST', headers: headers(),
        body: JSON.stringify(activity),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data;
},

    getActivity: async () => {
        const res = await fetch(`${BASE_URL}/worker/activity`, { headers: headers() });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        return data;
    },
    uploadDocument: async (formData: FormData) => {
        const res = await fetch(`${BASE_URL}/profile/upload`, {
            method: 'POST',
            headers: {
                ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
            },
            body: formData,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        return data;
    },

    getRiskPrediction: async (city: string, month: number) => {
        const res = await fetch(`${ML_URL}/predict`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ city, month }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || 'Prediction failed');
        return data;
    },

    cancelSubscription: async (id: string) => {
        const res = await fetch(`${BASE_URL}/subscriptions/${id}/cancel`, {
            method: 'PATCH',
            headers: headers(),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        return data;
    },

    updateClaimStatus: async (id: string, status: string) => {
        const res = await fetch(`${BASE_URL}/claims/${id}/status`, {
            method: 'PATCH',
            headers: headers(),
            body: JSON.stringify({ status }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        return data;
    },

    seedDemoData: async () => {
        const res = await fetch(`${BASE_URL}/admin/seed`, {
            method: 'POST',
            headers: headers(),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        return data;
    },
};