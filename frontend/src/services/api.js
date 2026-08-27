const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';


/* =========================================================
   GENERIC API REQUEST
========================================================= */

const getDemoFallback = (endpoint, options = {}) => {
  const method = options.method || 'GET';
  let body = {};
  if (options.body) {
    try {
      body = JSON.parse(options.body);
    } catch {
      body = {};
    }
  }

  if (endpoint === '/api/auth/profile') {
    if (method === 'PUT') {
      const existing = JSON.parse(localStorage.getItem('mam_demo_user') || '{}');
      const updated = { ...existing, ...body };
      localStorage.setItem('mam_demo_user', JSON.stringify(updated));
      return { success: true, data: { user: updated } };
    }
  }

  if (endpoint === '/api/health/profile') {
    if (method === 'POST') {
      localStorage.setItem('mam_demo_health', JSON.stringify(body));
      return { success: true, data: body, message: 'Health profile saved successfully' };
    }
    if (method === 'DELETE') {
      localStorage.removeItem('mam_demo_health');
      return { success: true, message: 'Health profile reset successfully' };
    }
    const saved = localStorage.getItem('mam_demo_health');
    return { success: true, data: saved ? JSON.parse(saved) : null };
  }

  if (endpoint === '/api/health/analysis') {
    return {
      success: true,
      data: {
        score: 85,
        summary: 'Good baseline. Maintain consistent sleep and daily physical activity.',
        metrics: { bmi: 22.5, sleepScore: 88, stressLevel: 'Moderate' },
      },
    };
  }

  if (endpoint === '/api/health/plan') {
    return {
      success: true,
      data: {
        title: '12-Month Wellness & Fitness Plan',
        months: [
          { month: 1, focus: 'Hydration & Baseline Sleep', status: 'In Progress' },
          { month: 2, focus: 'Cardio & Mobility', status: 'Pending' },
        ],
      },
    };
  }

  if (endpoint === '/api/wealth/profile') {
    if (method === 'POST') {
      localStorage.setItem('mam_demo_wealth', JSON.stringify(body));
      return { success: true, data: body, message: 'Wealth profile saved successfully' };
    }
    if (method === 'DELETE') {
      localStorage.removeItem('mam_demo_wealth');
      return { success: true, message: 'Wealth profile reset successfully' };
    }
    const saved = localStorage.getItem('mam_demo_wealth');
    return { success: true, data: saved ? JSON.parse(saved) : null };
  }

  if (endpoint === '/api/wealth/analysis') {
    return {
      success: true,
      data: {
        financialHealthScore: 78,
        savingsRate: '25%',
        recommendation: 'Build Emergency Fund & start monthly SIP investments.',
      },
    };
  }

  if (endpoint === '/api/wealth/plan') {
    return {
      success: true,
      data: {
        title: '12-Month Wealth Growth Plan',
        targets: ['Emergency Fund', 'Index SIP', 'Term Insurance'],
      },
    };
  }

  if (endpoint === '/api/growth/profile') {
    if (method === 'POST') {
      localStorage.setItem('mam_demo_growth', JSON.stringify(body));
      return { success: true, data: body, message: 'Growth profile saved successfully' };
    }
    if (method === 'DELETE') {
      localStorage.removeItem('mam_demo_growth');
      return { success: true, message: 'Growth profile reset' };
    }
    const saved = localStorage.getItem('mam_demo_growth');
    return { success: true, data: saved ? JSON.parse(saved) : null };
  }

  if (endpoint === '/api/growth/roadmap') {
    return {
      success: true,
      data: {
        milestones: [
          { id: 1, title: 'Learn Modern Web Development', status: 'In Progress' },
          { id: 2, title: 'Build Fullstack Application', status: 'Active' },
        ],
      },
    };
  }

  if (endpoint === '/api/day-profile') {
    if (method === 'POST') {
      localStorage.setItem('mam_demo_day', JSON.stringify(body));
      return { success: true, data: body };
    }
    if (method === 'DELETE') {
      localStorage.removeItem('mam_demo_day');
      return { success: true, message: 'Day profile deleted' };
    }
    const saved = localStorage.getItem('mam_demo_day');
    return { success: true, data: saved ? JSON.parse(saved) : null };
  }

  if (endpoint === '/api/daily-plan/today') {
    return {
      success: true,
      data: {
        plan: {
          id: 'demo-plan-1',
          tasks: [
            { id: 't1', title: 'Morning Hydration & Walk', completed: true },
            { id: 't2', title: 'Deep Work Session (2 Hours)', completed: false },
            { id: 't3', title: 'Evening Reading & Reflection', completed: false },
          ],
        },
      },
    };
  }

  if (endpoint === '/api/dashboard') {
    return {
      success: true,
      data: {
        healthScore: 85,
        wealthScore: 78,
        growthScore: 90,
        overallIndex: 84,
      },
    };
  }

  return { success: true, data: {} };
};

const request = async (endpoint, options = {}) => {
  const config = {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  };

  if (options.body !== undefined) {
    config.body = options.body;
  }

  console.log('API REQUEST:', {
    url: `${API_BASE_URL}${endpoint}`,
    method: config.method,
    body: config.body,
  });

  try {
    const response = await fetch(
      `${API_BASE_URL}${endpoint}`,
      config
    );

    const text = await response.text();
    let data;

    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(
        text || 'Invalid server response'
      );
    }

    if (!response.ok) {
      throw new Error(
        data.message || 'Request failed.'
      );
    }

    return data;
  } catch (error) {
    if (error.message.includes('fetch') || error.message.includes('NetworkError') || error.name === 'TypeError') {
      console.warn('Backend server unreachable. Using local demo fallback for:', endpoint);
      return getDemoFallback(endpoint, options);
    }
    throw error;
  }
};



/* =========================================================
   API
========================================================= */

export const api = {


  /* =======================================================
     BACKEND HEALTH CHECK
  ======================================================= */

  health: async () => {
    return request('/api/health');
  },

  updateUserProfile: async (payload, token) => {
    return request('/api/auth/profile', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
  },



  /* =======================================================
     HEALTH PROFILE
  ======================================================= */

  saveHealthProfile: async (payload, token) => {

    return request(
      '/api/health/profile',
      {
        method: 'POST',

        headers:{
          Authorization:`Bearer ${token}`,
        },

        body:JSON.stringify(payload),
      }
    );

  },


  getHealthProfile: async(token)=>{

    return request(
      '/api/health/profile',
      {
        method:'GET',

        headers:{
          Authorization:`Bearer ${token}`,
        },
      }
    );

  },



  /* =======================================================
     HEALTH ANALYSIS
  ======================================================= */

  getHealthAnalysis: async(token)=>{

    return request(
      '/api/health/analysis',
      {
        method:'GET',

        headers:{
          Authorization:`Bearer ${token}`,
        },
      }
    );

  },



  /* =======================================================
     HEALTH PLAN
  ======================================================= */

  generateHealthPlan: async(token)=>{

    return request(
      '/api/health/plan',
      {
        method:'POST',

        headers:{
          Authorization:`Bearer ${token}`,
        },
      }
    );

  },


  getHealthPlan: async(token)=>{

    return request(
      '/api/health/plan',
      {
        method:'GET',

        headers:{
          Authorization:`Bearer ${token}`,
        },
      }
    );

  },

  /* =======================================================
     WEALTH PROFILE
  ======================================================= */

  saveWealthProfile: async (payload, token) => {
    return request('/api/wealth/profile', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
  },

  getWealthProfile: async (token) => {
    return request('/api/wealth/profile', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  /* =======================================================
     WEALTH ANALYSIS
  ======================================================= */

  getWealthAnalysis: async (token) => {
    return request('/api/wealth/analysis', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  /* =======================================================
     WEALTH PLAN
  ======================================================= */

  generateWealthPlan: async (token) => {
    return request('/api/wealth/plan', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  getWealthPlan: async (token) => {
    return request('/api/wealth/plan', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },



  /* =======================================================
     DAY PROFILE
  ======================================================= */


  saveDayProfile: async(payload, token)=>{

    return request(
      '/api/day-profile',
      {
        method:'POST',

        headers:{
          Authorization:`Bearer ${token}`,
        },

        body:JSON.stringify(payload),
      }
    );

  },


  getDayProfile: async(token)=>{

    return request(
      '/api/day-profile',
      {
        method:'GET',

        headers:{
          Authorization:`Bearer ${token}`,
        },
      }
    );

  },


  deleteDayProfile: async(token)=>{

    return request(
      '/api/day-profile',
      {
        method:'DELETE',

        headers:{
          Authorization:`Bearer ${token}`,
        },
      }
    );

  },

  /* =======================================================
     DAILY PLAN
  ======================================================= */

  getTodayPlan: async (token) => {
    try {
      console.log(
        'GETTING TODAY PLAN...'
      );
return await request(
  '/api/daily-plan/today',
        {
          method: 'GET',

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

    } catch (error) {

      console.error(
        'GET TODAY PLAN ERROR:',
        error
      );

      return {
        success: false,
        message: error.message,
      };

    }
  },

toggleTask: async (
  planId,
  taskId,
  completed,
  token
) => {

  try {

    console.log(
      "TOGGLING TASK:",
      {
        planId,
        taskId,
        completed,
      }
    );


    return await request(
      `/api/daily-plan/${planId}/tasks/${taskId}`,
      {
        method:"PATCH",

        headers:{
          Authorization:`Bearer ${token}`,
        },

        body:JSON.stringify({
          completed,
        }),
      }
    );


  } catch(error){

    console.error(
      "TOGGLE TASK ERROR:",
      error
    );

    return {
      success:false,
      message:error.message,
    };

  }
},

  /* =========================================================
     GROWTHMARGDARSHI
  ========================================================= */

  getGrowthProfile: async (token) => {
    try {
      return await request('/api/growth/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  saveGrowthProfile: async (payload, token) => {
    try {
      return await request('/api/growth/profile', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  getGrowthRoadmap: async (token) => {
    try {
      return await request('/api/growth/roadmap', {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  completeGrowthTask: async (taskId, token) => {
    try {
      return await request(`/api/growth/tasks/${taskId}/complete`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  saveGrowthReflection: async (payload, token) => {
    try {
      return await request('/api/growth/reflection', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  resetHealthProfile: async (token) => {
    try {
      return await request('/api/health/profile', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  resetWealthProfile: async (token) => {
    try {
      return await request('/api/wealth/profile', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  resetGrowthProfile: async (token) => {
    try {
      return await request('/api/growth/profile', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      return { success: false, message: error.message };
    }
  },
};