const BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

function getToken() {
  return localStorage.getItem('outpero.token');
}

async function req(method: string, path: string, body?: unknown) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) {
    localStorage.removeItem('outpero.token');
    localStorage.removeItem('outpero.session');
    window.location.reload();
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Request failed');
  }

  return res.json();
}

// Auth
export const api = {
  auth: {
    register: (email: string, password: string, name?: string) =>
      req('POST', '/auth/register', { email, password, name }),
    login: (email: string, password: string) =>
      req('POST', '/auth/login', { email, password }),
    me: () => req('GET', '/auth/me'),
  },

  employees: {
    list: () => req('GET', '/employees'),
    get: (id: string) => req('GET', `/employees/${id}`),
    create: (data: Record<string, unknown>) => req('POST', '/employees', data),
    update: (id: string, data: Record<string, unknown>) => req('PATCH', `/employees/${id}`, data),
    delete: (id: string) => req('DELETE', `/employees/${id}`),
  },

  campaigns: {
    list: () => req('GET', '/campaigns'),
    get: (id: string) => req('GET', `/campaigns/${id}`),
    create: (data: Record<string, unknown>) => req('POST', '/campaigns', data),
    start: (id: string) => req('POST', `/campaigns/${id}/start`),
    pause: (id: string) => req('POST', `/campaigns/${id}/pause`),
    uploadCsv: async (file: File, employeeId: string, name: string) => {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('employee_id', employeeId);
      fd.append('name', name);
      const res = await fetch(`${BASE}/campaigns/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${getToken()}` },
        body: fd,
      });
      return res.json();
    },
  },

  webhooks: {
    list: () => req('GET', '/webhooks'),
    create: (employeeId: string, name: string) =>
      req('POST', '/webhooks', { employee_id: employeeId, name }),
  },

  leads: {
    list: (params?: Record<string, string>) =>
      req('GET', '/leads' + (params ? '?' + new URLSearchParams(params) : '')),
    stats: () => req('GET', '/leads/stats'),
    get: (id: string) => req('GET', `/leads/${id}`),
  },

  calls: {
    list: (params?: Record<string, string>) =>
      req('GET', '/calls' + (params ? '?' + new URLSearchParams(params) : '')),
    stats: () => req('GET', '/calls/stats'),
    daily: (days?: number) => req('GET', `/calls/daily?days=${days ?? 30}`),
    get: (id: string) => req('GET', `/calls/${id}`),
  },

  billing: {
    plans: () => req('GET', '/billing/plans'),
    balance: () => req('GET', '/billing/balance'),
    transactions: () => req('GET', '/billing/transactions'),
    topup: (planId: string) => req('POST', '/billing/topup', { plan_id: planId }),
  },

  numbers: {
    list: () => req('GET', '/numbers'),
    assign: (numberId: string, employeeId: string) =>
      req('PATCH', `/numbers/${numberId}`, { employee_id: employeeId }),
  },

  settings: {
    get: () => req('GET', '/settings'),
    update: (data: Record<string, unknown>) => req('PATCH', '/settings', data),
  },

  keys: {
    list: () => req('GET', '/keys'),
    create: (name: string) => req('POST', '/keys', { name }),
  },

  voices: () => req('GET', '/voices'),
};
