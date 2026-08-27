const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';


/* =========================================================
   GENERIC API REQUEST
========================================================= */

const getActiveUserEmail = () => {
  try {
    const user = JSON.parse(localStorage.getItem('mam_active_user') || '{}');
    return user.email ? user.email.toLowerCase() : 'default_user';
  } catch {
    return 'default_user';
  }
};

const getDemoFallback = (endpoint, options = {}) => {
  const method = options.method || 'GET';
  const userKey = getActiveUserEmail();
  let body = {};
  if (options.body) {
    try {
      body = JSON.parse(options.body);
    } catch {
      body = {};
    }
  }

  // Auth Profile
  if (endpoint === '/api/auth/profile') {
    if (method === 'PUT') {
      const activeUser = JSON.parse(localStorage.getItem('mam_active_user') || '{}');
      const updated = { ...activeUser, ...body };
      localStorage.setItem('mam_active_user', JSON.stringify(updated));
      return { success: true, data: { user: updated } };
    }
  }

  // Health Profile
  if (endpoint === '/api/health/profile') {
    if (method === 'POST') {
      localStorage.setItem(`mam_health_${userKey}`, JSON.stringify(body));
      return { success: true, data: { healthProfile: body }, message: 'Health profile saved successfully' };
    }
    if (method === 'DELETE') {
      localStorage.removeItem(`mam_health_${userKey}`);
      return { success: true, message: 'Health profile reset successfully' };
    }
    const saved = localStorage.getItem(`mam_health_${userKey}`);
    return { success: true, data: saved ? { healthProfile: JSON.parse(saved) } : null };
  }

  // Health Analysis
  if (endpoint === '/api/health/analysis') {
    const hpStr = localStorage.getItem(`mam_health_${userKey}`);
    if (!hpStr) {
      return { success: false, message: 'Health profile not found. Please set up your health profile first.' };
    }
    const hp = JSON.parse(hpStr);
    const h = Number(hp.height || 170) / 100;
    const w = Number(hp.weight || 70);
    const bmiVal = Number((w / (h * h)).toFixed(1));

    let bmiCat = 'Normal weight';
    let bmiStatus = 'Good';
    if (bmiVal < 18.5) { bmiCat = 'Underweight'; bmiStatus = 'Fair'; }
    else if (bmiVal >= 25 && bmiVal < 30) { bmiCat = 'Overweight'; bmiStatus = 'Fair'; }
    else if (bmiVal >= 30) { bmiCat = 'Obese'; bmiStatus = 'Needs Attention'; }

    let healthScore = 80;
    if (bmiVal >= 18.5 && bmiVal <= 24.9) healthScore += 10;
    else healthScore -= 10;

    return {
      success: true,
      data: {
        healthScore: Math.min(100, Math.max(40, healthScore)),
        category: healthScore >= 80 ? 'Optimal' : healthScore >= 70 ? 'Good' : 'Fair',
        bmi: {
          value: bmiVal,
          category: bmiCat,
          status: bmiStatus,
          message: `Your Body Mass Index is ${bmiVal} (${bmiCat}).`,
        },
        sleep: {
          totalMinutes: 480,
          durationFormatted: '8h 00m',
          quality: 'Good',
          message: 'Ideal target sleep schedule.',
        },
        activity: {
          level: hp.activityLevel || 'Moderate Activity',
          message: hp.exercise || 'Consistent daily movement.',
        },
        summary: `Health profile active for ${hp.age || '25'} year old (${w}kg, ${hp.height}cm).`,
        recommendations: [
          'Maintain hydration (2.5L-3L daily)',
          'Aim for 30 minutes of cardio or brisk walking',
          'Keep bedtime and wakeup timing consistent',
        ],
      },
    };
  }

  // Health Plan
  if (endpoint === '/api/health/plan') {
    if (method === 'POST' || method === 'GET') {
      const hpStr = localStorage.getItem(`mam_health_${userKey}`);
      if (!hpStr && method === 'GET') {
        return { success: false, message: 'No plan found' };
      }

      const planData = {
        title: '12-Month Wellness & Vitality Plan',
        overallProgress: 15,
        currentMonth: 1,
        durationMonths: 12,
        goals: [
          'Maintain ideal body composition',
          'Build strong daily hydration habits',
          'Consistent 7-8 hours quality sleep',
        ],
        monthlyRoadmap: Array.from({ length: 12 }, (_, i) => ({
          month: i + 1,
          title: `Month ${i + 1}`,
          theme: i === 0 ? 'Foundation & Baseline Habits' : i === 1 ? 'Endurance & Mobility' : `Phase ${i + 1} Growth`,
          focus: i === 0 ? 'Hydration, baseline sleep & light walking' : 'Cardio progression & strength core',
          status: i === 0 ? 'In Progress' : 'Pending',
          tasks: [
            { id: `ht-${i}-1`, title: 'Daily 30 min movement', completed: i === 0 },
            { id: `ht-${i}-2`, title: 'Sleep by target time', completed: false },
          ],
        })),
      };

      localStorage.setItem(`mam_health_plan_${userKey}`, JSON.stringify(planData));
      return { success: true, data: planData };
    }
  }

  // Wealth Profile
  if (endpoint === '/api/wealth/profile') {
    if (method === 'POST') {
      localStorage.setItem(`mam_wealth_${userKey}`, JSON.stringify(body));
      return { success: true, data: { wealthProfile: body }, message: 'Wealth profile saved successfully' };
    }
    if (method === 'DELETE') {
      localStorage.removeItem(`mam_wealth_${userKey}`);
      return { success: true, message: 'Wealth profile reset successfully' };
    }
    const saved = localStorage.getItem(`mam_wealth_${userKey}`);
    return { success: true, data: saved ? { wealthProfile: JSON.parse(saved) } : null };
  }

  // Wealth Analysis
  if (endpoint === '/api/wealth/analysis') {
    const wpStr = localStorage.getItem(`mam_wealth_${userKey}`);
    if (!wpStr) {
      return { success: false, message: 'Wealth profile required' };
    }
    const wp = JSON.parse(wpStr);
    const inc = Number(wp.monthlyIncome || 0);
    const fixed = Number(wp.fixedExpenses || 0);
    const variable = Number(wp.variableExpenses || 0);
    const totalExp = fixed + variable;
    const cashFlow = inc - totalExp;
    const savingsRateVal = inc > 0 ? Math.max(0, Math.round((cashFlow / inc) * 100)) : 0;
    const savings = Number(wp.currentSavings || 0);
    const runway = totalExp > 0 ? Number((savings / totalExp).toFixed(1)) : 6;

    let score = 75;
    if (savingsRateVal >= 30) score += 15;
    else if (savingsRateVal >= 20) score += 10;
    if (runway >= 6) score += 10;

    return {
      success: true,
      data: {
        metrics: {
          score: Math.min(100, score),
          category: score >= 85 ? 'Excellent' : score >= 70 ? 'Good' : 'Fair',
          cashFlow,
          savingsRate: `${savingsRateVal}%`,
          emergencyRunwayMonths: runway,
          debtToIncomeRatio: '15%',
          totalExpenses: totalExp,
          monthlyIncome: inc,
          budgetActual: { needs: fixed, wants: variable, savings: Math.max(0, cashFlow) },
          budgetIdeal: { needs: Math.round(inc * 0.5), wants: Math.round(inc * 0.3), savings: Math.round(inc * 0.2) },
        },
        profile: wp,
        recommendations: [
          `Target emergency savings of ₹${totalExp * (wp.targetEmergencyFundMonths || 6)} (${wp.targetEmergencyFundMonths || 6} months expenses).`,
          'Automate monthly investment into diversified index funds.',
          'Review variable expenses to optimize monthly surplus.',
        ],
      },
    };
  }

  // Wealth Plan
  if (endpoint === '/api/wealth/plan') {
    const wpStr = localStorage.getItem(`mam_wealth_${userKey}`);
    const planData = {
      title: '12-Month Financial Independence Plan',
      overallProgress: 20,
      currentMonth: 1,
      durationMonths: 12,
      goals: ['Build Emergency Fund', 'Start Systematic Investments (SIP)', 'Eliminate High-Interest Debt'],
      monthlyRoadmap: Array.from({ length: 12 }, (_, i) => ({
        month: i + 1,
        title: `Month ${i + 1}`,
        theme: i === 0 ? 'Emergency Fund & Cashflow Optimization' : `Investment Phase ${i + 1}`,
        focus: i === 0 ? 'Set up automated savings transfers' : 'Scale monthly investment contributions',
        status: i === 0 ? 'In Progress' : 'Pending',
        tasks: [
          { id: `wt-${i}-1`, title: 'Track daily expenses', completed: i === 0 },
          { id: `wt-${i}-2`, title: 'Transfer surplus to high-yield savings', completed: false },
        ],
      })),
    };
    return { success: true, data: planData };
  }

  // Growth Profile
  if (endpoint === '/api/growth/profile') {
    if (method === 'POST') {
      localStorage.setItem(`mam_growth_${userKey}`, JSON.stringify(body));
      return { success: true, data: { growthProfile: body }, message: 'Growth profile saved successfully' };
    }
    if (method === 'DELETE') {
      localStorage.removeItem(`mam_growth_${userKey}`);
      return { success: true, message: 'Growth profile reset' };
    }
    const saved = localStorage.getItem(`mam_growth_${userKey}`);
    return { success: true, data: saved ? { growthProfile: JSON.parse(saved) } : null };
  }

  // Growth Roadmap
  if (endpoint === '/api/growth/roadmap') {
    return {
      success: true,
      data: {
        milestones: [
          { id: 1, title: 'Learn Modern Web Development & AI Tools', status: 'In Progress' },
          { id: 2, title: 'Build & Launch Fullstack Portfolio Project', status: 'Active' },
          { id: 3, title: 'Master Personal Finance & Health Habits', status: 'Upcoming' },
        ],
      },
    };
  }

  // Day Profile
  if (endpoint === '/api/day-profile') {
    if (method === 'POST') {
      localStorage.setItem(`mam_day_${userKey}`, JSON.stringify(body));
      return { success: true, data: { dayProfile: body } };
    }
    if (method === 'DELETE') {
      localStorage.removeItem(`mam_day_${userKey}`);
      return { success: true, message: 'Day profile deleted' };
    }
    const saved = localStorage.getItem(`mam_day_${userKey}`);
    return { success: true, data: saved ? { dayProfile: JSON.parse(saved) } : null };
  }

  // Daily Plan Today
  if (endpoint === '/api/daily-plan/today') {
    const savedTasks = localStorage.getItem(`mam_tasks_${userKey}`);
    let tasks = [
      { id: 't1', title: 'Morning Walk & Hydration (7:00 AM)', completed: true },
      { id: 't2', title: 'Deep Work & Skill Building (9:00 AM)', completed: false },
      { id: 't3', title: 'Wealth & Expense Tracking (5:00 PM)', completed: false },
      { id: 't4', title: 'Evening Reading & Reflection (10:00 PM)', completed: false },
    ];
    if (savedTasks) {
      try { tasks = JSON.parse(savedTasks); } catch {}
    }
    return {
      success: true,
      data: {
        plan: {
          id: 'demo-plan-1',
          date: new Date().toISOString(),
          tasks,
        },
      },
    };
  }

  // Toggle Daily Task
  if (endpoint.includes('/api/daily-plan/') && endpoint.includes('/tasks/')) {
    const parts = endpoint.split('/tasks/');
    const taskId = parts[1];
    const savedTasksStr = localStorage.getItem(`mam_tasks_${userKey}`);
    let tasks = [
      { id: 't1', title: 'Morning Walk & Hydration (7:00 AM)', completed: true },
      { id: 't2', title: 'Deep Work & Skill Building (9:00 AM)', completed: false },
      { id: 't3', title: 'Wealth & Expense Tracking (5:00 PM)', completed: false },
      { id: 't4', title: 'Evening Reading & Reflection (10:00 PM)', completed: false },
    ];
    if (savedTasksStr) {
      try { tasks = JSON.parse(savedTasksStr); } catch {}
    }
    tasks = tasks.map(t => t.id === taskId ? { ...t, completed: body.completed } : t);
    localStorage.setItem(`mam_tasks_${userKey}`, JSON.stringify(tasks));
    return { success: true, data: { tasks } };
  }

  // Dashboard Metrics
  if (endpoint === '/api/dashboard') {
    const hasHealth = Boolean(localStorage.getItem(`mam_health_${userKey}`));
    const hasWealth = Boolean(localStorage.getItem(`mam_wealth_${userKey}`));
    const hasGrowth = Boolean(localStorage.getItem(`mam_growth_${userKey}`));

    return {
      success: true,
      data: {
        healthScore: hasHealth ? 85 : 0,
        wealthScore: hasWealth ? 78 : 0,
        growthScore: hasGrowth ? 90 : 0,
        overallIndex: hasHealth || hasWealth || hasGrowth ? 84 : 0,
        user: JSON.parse(localStorage.getItem('mam_active_user') || '{}'),
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