const API_BASE_URL = 'http://localhost:5000';

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

export const registerUser = async (payload) => {
  try {
    return await request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  } catch (error) {
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
    return {
      success: false,
      message: error.message,
    };
  }
};

export const getCurrentUser = async (token) => {
  try {
    return await request('/api/auth/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};
