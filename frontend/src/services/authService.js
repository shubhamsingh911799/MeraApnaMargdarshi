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

// Local Accounts storage helper
const getLocalAccounts = () => {
  try {
    return JSON.parse(localStorage.getItem('mam_local_accounts') || '[]');
  } catch {
    return [];
  }
};

const saveLocalAccount = (user) => {
  const accounts = getLocalAccounts();
  const existingIndex = accounts.findIndex((a) => a.email.toLowerCase() === user.email.toLowerCase());
  if (existingIndex >= 0) {
    accounts[existingIndex] = user;
  } else {
    accounts.push(user);
  }
  localStorage.setItem('mam_local_accounts', JSON.stringify(accounts));
};

const getActiveUser = () => {
  try {
    return JSON.parse(localStorage.getItem('mam_active_user') || 'null');
  } catch {
    return null;
  }
};

const setActiveUser = (user) => {
  localStorage.setItem('mam_active_user', JSON.stringify(user));
};

export const registerUser = async (payload) => {
  try {
    return await request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  } catch (error) {
    if (error.message.includes('fetch') || error.message.includes('NetworkError') || error.name === 'TypeError') {
      const email = payload.email ? payload.email.trim().toLowerCase() : '';
      const name = payload.name ? payload.name.trim() : email.split('@')[0];
      const password = payload.password || '';

      const accounts = getLocalAccounts();
      const alreadyExists = accounts.find((a) => a.email.toLowerCase() === email);

      if (alreadyExists) {
        return {
          success: false,
          message: 'An account with this email already exists. Please sign in.',
        };
      }

      const newUser = {
        id: 'user-' + Date.now(),
        name,
        email,
        password,
      };

      saveLocalAccount(newUser);
      setActiveUser({ id: newUser.id, name: newUser.name, email: newUser.email });

      const userSession = { id: newUser.id, name: newUser.name, email: newUser.email };
      const token = 'local-token-' + newUser.id;

      return {
        success: true,
        data: {
          token,
          user: userSession,
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
      const email = payload.email ? payload.email.trim().toLowerCase() : '';
      const password = payload.password || '';

      const accounts = getLocalAccounts();
      const userAcc = accounts.find((a) => a.email.toLowerCase() === email);

      if (!userAcc) {
        const newUser = {
          id: 'user-' + Date.now(),
          name: email.split('@')[0],
          email,
          password,
        };
        saveLocalAccount(newUser);
        setActiveUser({ id: newUser.id, name: newUser.name, email: newUser.email });
        return {
          success: true,
          data: {
            token: 'local-token-' + newUser.id,
            user: { id: newUser.id, name: newUser.name, email: newUser.email },
          },
        };
      }

      if (userAcc.password && userAcc.password !== password) {
        return {
          success: false,
          message: 'Incorrect password. Please try again.',
        };
      }

      const userSession = { id: userAcc.id, name: userAcc.name, email: userAcc.email };
      setActiveUser(userSession);
      const token = 'local-token-' + userAcc.id;

      return {
        success: true,
        data: {
          token,
          user: userSession,
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
  if (token && token.startsWith('local-token-')) {
    const activeUser = getActiveUser();
    if (activeUser) {
      return {
        success: true,
        data: { user: activeUser },
      };
    }
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
      const activeUser = getActiveUser() || {
        id: 'user-default',
        name: 'Margdarshi User',
        email: 'user@margdarshi.com',
      };
      return {
        success: true,
        data: { user: activeUser },
      };
    }
    return {
      success: false,
      message: error.message,
    };
  }
};
