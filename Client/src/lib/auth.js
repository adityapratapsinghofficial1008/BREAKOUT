const TOKEN_KEY = 'breakout_auth_token';
const USER_KEY = 'breakout_auth_user';

async function safeJson(res) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export const authClient = {
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  getUser() {
    try {
      const u = localStorage.getItem(USER_KEY);
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  },

  setAuth(token, user) {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  clearAuth() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getAuthHeaders() {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  },

  async register({ email, password, name }) {
    let res;
    try {
      res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, clientUrl: window.location.origin })
      });
    } catch (networkErr) {
      throw new Error(`Cannot reach backend server. Please make sure the Server is running on port 8000.`);
    }

    const data = await safeJson(res);
    if (!res.ok || !data?.success) {
      if (res.status === 502 || res.status === 504 || res.status === 500 && !data) {
        throw new Error('Backend server is not responding (502 Bad Gateway). Please start the server using: npm run dev in the Server folder.');
      }
      throw new Error(data?.error || `Registration failed (status ${res.status})`);
    }
    return data;
  },

  async login({ email, password }) {
    let res;
    try {
      res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
    } catch (networkErr) {
      throw new Error(`Cannot reach backend server. Please make sure the Server is running on port 8000.`);
    }

    const data = await safeJson(res);
    if (!res.ok || !data?.success) {
      if (res.status === 502 || res.status === 504 || res.status === 500 && !data) {
        throw new Error('Backend server is not responding (502 Bad Gateway). Please start the server using: npm run dev in the Server folder.');
      }
      const err = new Error(data?.error || `Login failed (status ${res.status})`);
      err.isUnverified = data?.isUnverified;
      err.email = data?.email;
      throw err;
    }
    this.setAuth(data.token, data.user);
    return data;
  },

  async resendVerification(email) {
    let res;
    try {
      res = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, clientUrl: window.location.origin })
      });
    } catch (networkErr) {
      throw new Error(`Cannot reach backend server.`);
    }

    const data = await safeJson(res);
    if (!res.ok || !data?.success) {
      throw new Error(data?.error || 'Failed to resend verification link');
    }
    return data;
  },

  async verifyEmail(token) {
    let res;
    try {
      res = await fetch(`/api/auth/verify-email?token=${encodeURIComponent(token)}`);
    } catch (networkErr) {
      throw new Error(`Cannot reach backend server.`);
    }

    const data = await safeJson(res);
    if (!res.ok || !data?.success) {
      throw new Error(data?.error || 'Verification failed');
    }
    if (data.token && data.user) {
      this.setAuth(data.token, data.user);
    }
    return data;
  },

  async getCurrentUser() {
    const token = this.getToken();
    if (!token) return null;

    try {
      const res = await fetch('/api/auth/me', {
        headers: this.getAuthHeaders()
      });
      if (!res.ok) {
        this.clearAuth();
        return null;
      }
      const data = await safeJson(res);
      if (data?.success && data?.user) {
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
        return data.user;
      }
      return null;
    } catch {
      return this.getUser();
    }
  }
};
