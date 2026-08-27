const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const request = async (endpoint, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Request failed.');
  }

  return data;
};

const getDemoUser = () => {
  const stored = localStorage.getItem('mam_demo_user');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }
  return null;
};

const saveDemoUser = (user) => {
  localStorage.setItem('mam_demo_user', JSON.stringify(user));
};

export const registerUser = async (payload) => {
  try {
    return await request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  } catch (error) {
    if (error.message.includes('fetch') || error.message.includes('NetworkError') || error.name === 'TypeError') {
      console.warn('Backend unreachable. Falling back to demo auth mode.');
      const demoUser = {
        id: 'demo-user-id',
        name: payload.name || payload.email.split('@')[0],
        email: payload.email || 'user@margdarshi.com',
      };
      saveDemoUser(demoUser);
      return {
        success: true,
        data: {
          token: 'demo-jwt-token-12345',
          user: demoUser,
        },
      };
    }
    return {
      success: false,
      message: error.message,
    };
  }
};

export const loginUser = async (payload) => {
  try {
    return await request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  } catch (error) {
    if (error.message.includes('fetch') || error.message.includes('NetworkError') || error.name === 'TypeError') {
      console.warn('Backend unreachable. Falling back to demo auth mode.');
      const existingUser = getDemoUser();
      const demoUser = existingUser || {
        id: 'demo-user-id',
        name: payload.email ? payload.email.split('@')[0] : 'Demo User',
        email: payload.email || 'user@margdarshi.com',
      };
      saveDemoUser(demoUser);
      return {
        success: true,
        data: {
          token: 'demo-jwt-token-12345',
          user: demoUser,
        },
      };
    }
    return {
      success: false,
      message: error.message,
    };
  }
};

export const getCurrentUser = async (token) => {
  if (token === 'demo-jwt-token-12345') {
    const demoUser = getDemoUser() || {
      id: 'demo-user-id',
      name: 'Demo User',
      email: 'user@margdarshi.com',
    };
    return {
      success: true,
      data: { user: demoUser },
    };
  }

  try {
    return await request('/api/auth/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    if (error.message.includes('fetch') || error.message.includes('NetworkError') || error.name === 'TypeError') {
      const demoUser = getDemoUser() || {
        id: 'demo-user-id',
        name: 'Demo User',
        email: 'user@margdarshi.com',
      };
      return {
        success: true,
        data: { user: demoUser },
      };
    }
    return {
      success: false,
      message: error.message,
    };
  }
};
