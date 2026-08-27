const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';


/* =========================================================
   GENERIC API REQUEST
========================================================= */

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


  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    config
  );


  const text = await response.text();

  let data;


  try {
    data = JSON.parse(text);
  } 
  
  catch {
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