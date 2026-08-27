const GrowthProfile = require('../models/GrowthProfile');
const ApiError = require('../utils/ApiError');

/* =========================================================
   PRIORITY ENGINE & CALCULATIONS
========================================================= */

const SKILL_MAP = {
  communication: 'Communication',
  confidence: 'Confidence',
  publicSpeaking: 'Public Speaking',
  timeManagement: 'Time Management',
  decisionMaking: 'Decision Making',
  problemSolving: 'Problem Solving',
  leadership: 'Leadership',
  teamwork: 'Teamwork',
  discipline: 'Discipline',
  focus: 'Focus',
  emotionalControl: 'Emotional Control',
  consistency: 'Consistency',
};

// Priority calculation engine: low rating + goal match + challenge match + context
const calculatePriorities = (skillRatings, goals = [], challenges = [], primaryFocus = '') => {
  const scores = Object.keys(skillRatings).map((key) => {
    const name = SKILL_MAP[key] || key;
    const rating = Number(skillRatings[key]) || 5;

    let priorityScore = 10 - rating;

    // Weight by selected goals
    const goalMatch = goals.some((g) => g.toLowerCase().includes(name.toLowerCase()));
    if (goalMatch) priorityScore += 3;

    // Weight by selected challenges
    const challengeMatch = challenges.some((c) => c.toLowerCase().includes(name.toLowerCase()));
    if (challengeMatch) priorityScore += 3;

    // Weight by primary focus
    if (primaryFocus && primaryFocus.toLowerCase().includes(name.toLowerCase())) {
      priorityScore += 4;
    }

    return {
      key,
      name,
      rating,
      priorityScore,
    };
  });

  // Sort by priorityScore descending
  scores.sort((a, b) => b.priorityScore - a.priorityScore);

  return scores.map((item) => ({
    skill: item.name,
    currentLevel: item.rating,
    targetLevel: Math.min(10, item.rating + 3),
    reason: `Building ${item.name} will support your goals and address current challenges.`,
  }));
};

const determineStage = (avgScore) => {
  if (avgScore <= 3) return 'Starting';
  if (avgScore <= 5) return 'Developing';
  if (avgScore <= 7) return 'Building';
  if (avgScore <= 8.5) return 'Growing';
  if (avgScore <= 9.5) return 'Strong';
  return 'Advanced';
};

/* =========================================================
   12-MONTH ROADMAP GENERATOR
========================================================= */

const generate12MonthRoadmap = (priorities, availableTimeMinutes, preferences = []) => {
  const topPriorities = priorities.slice(0, 3).map((p) => p.skill);
  const p1 = topPriorities[0] || 'Confidence';
  const p2 = topPriorities[1] || 'Communication';
  const p3 = topPriorities[2] || 'Consistency';

  const monthsTemplate = [
    {
      month: 1,
      title: 'Self-awareness & Baseline',
      objective: 'Understand current habits, triggers, and baseline strengths.',
      primaryGoal: 'Establish daily self-monitoring and baseline clarity.',
      supportingGoals: ['Identify daily distraction patterns', 'Log daily mood & focus window'],
      skills: ['Focus', 'Discipline'],
      target: 'Complete 15 daily reflections this month.',
    },
    {
      month: 2,
      title: `${p1} Foundations`,
      objective: `Build core skills around ${p1} step by step.`,
      primaryGoal: `Increase comfort and frequency in ${p1} exercises.`,
      supportingGoals: [`Complete 3 small ${p1} challenges per week`, `Track confidence score daily`],
      skills: [p1, 'Discipline'],
      target: `Achieve a +2 rating boost in ${p1}.`,
    },
    {
      month: 3,
      title: `${p2} Acceleration`,
      objective: `Expand your ${p2} techniques in real-world scenarios.`,
      primaryGoal: `Practice ${p2} in low-stakes everyday interactions.`,
      supportingGoals: ['Initiate 2 discussions per week', 'Practice active listening'],
      skills: [p2, 'Social'],
      target: `Complete 12 ${p2} real-world tasks.`,
    },
    {
      month: 4,
      title: `${p3} Building`,
      objective: `Strengthen ${p3} habit loops and morning routines.`,
      primaryGoal: 'Maintain a 14-day unbroken daily action streak.',
      supportingGoals: ['Set fixed daily growth time', 'Eliminate primary phone distraction'],
      skills: [p3, 'Time Management'],
      target: '80% weekly habit completion rate.',
    },
    {
      month: 5,
      title: 'Time Management & Focus',
      objective: 'Optimize high-energy focus blocks and daily planning.',
      primaryGoal: 'Implement 60-minute deep work focus blocks.',
      supportingGoals: ['Plan tomorrow each night', 'Track time allocation'],
      skills: ['Time Management', 'Focus'],
      target: 'Complete 20 deep work sessions.',
    },
    {
      month: 6,
      title: 'Discipline & Habits',
      objective: 'Lock in sustainable daily habits without relying on motivation.',
      primaryGoal: 'Build non-negotiable daily growth habits.',
      supportingGoals: ['Morning 15-min growth block', 'Night reflection ritual'],
      skills: ['Discipline', 'Consistency'],
      target: '21-day streak achievement.',
    },
    {
      month: 7,
      title: 'Decision Making & Clarity',
      objective: 'Improve speed and logic when making important choices.',
      primaryGoal: 'Apply structured decision-making frameworks to weekly problems.',
      supportingGoals: ['Write down pros/cons for key choices', 'Reduce overthinking'],
      skills: ['Decision Making', 'Problem Solving'],
      target: 'Log 8 structured decision logs.',
    },
    {
      month: 8,
      title: 'Problem Solving & Critical Thinking',
      objective: 'Break complex challenges into manageable step-by-step solutions.',
      primaryGoal: 'Deconstruct personal and academic/career challenges methodically.',
      supportingGoals: ['Identify root causes before acting', 'Create action steps'],
      skills: ['Problem Solving', 'Focus'],
      target: 'Solve 4 complex personal challenges.',
    },
    {
      month: 9,
      title: 'Leadership & Initiative',
      objective: 'Take responsibility in group settings and model positive action.',
      primaryGoal: 'Take lead on 2 group projects or community initiatives.',
      supportingGoals: ['Volunteer for coordination', 'Support team members'],
      skills: ['Leadership', 'Teamwork'],
      target: 'Complete 2 leadership roles.',
    },
    {
      month: 10,
      title: 'Teamwork & Interpersonal Mastery',
      objective: 'Build empathetic, high-trust relationships with peers and colleagues.',
      primaryGoal: 'Improve collaborative communication and feedback loops.',
      supportingGoals: ['Give constructive encouragement', 'Resolve small conflicts'],
      skills: ['Teamwork', 'Communication'],
      target: 'High 360-degree feedback evaluation.',
    },
    {
      month: 11,
      title: 'Advanced Communication & Presence',
      objective: 'Refine public speaking, body language, and persuasive clarity.',
      primaryGoal: 'Deliver a structured 5-minute talk or presentation.',
      supportingGoals: ['Practice impromptu speaking', 'Record and review speaking style'],
      skills: ['Public Speaking', 'Communication'],
      target: 'Deliver 2 presentations successfully.',
    },
    {
      month: 12,
      title: 'Integration & Life Mastery',
      objective: 'Synthesize all 12 skills into your permanent daily lifestyle.',
      primaryGoal: 'Maintain high self-rated performance across all growth areas.',
      supportingGoals: ['Conduct comprehensive annual reflection', 'Set next-level vision'],
      skills: ['Consistency', 'Leadership', 'Confidence'],
      target: 'Overall Growth Score > 80%.',
    },
  ];

  return monthsTemplate.map((m) => ({
    month: m.month,
    title: m.title,
    objective: m.objective,
    primaryGoal: m.primaryGoal,
    supportingGoals: m.supportingGoals,
    skills: m.skills,
    target: m.target,
    progress: m.month === 1 ? 15 : 0,
    completed: false,
    habits: [
      { title: `Daily 15-min ${m.skills[0]} exercise`, skill: m.skills[0], streak: 0, completedToday: false },
      { title: 'Nightly 5-min Reflection', skill: 'Reflect', streak: 0, completedToday: false },
    ],
    weeks: [1, 2, 3, 4].map((w) => ({
      week: w,
      title: `Week ${w}: ${m.skills[0]} Level ${w}`,
      objective: `Master level ${w} practical applications of ${m.skills[0]}.`,
      tasks: [],
    })),
  }));
};

/* =========================================================
   DAILY TASK GENERATOR
========================================================= */

const GENERATE_TODAY_TASK = (primarySkill, availableTimeMinutes) => {
  const time = Math.min(availableTimeMinutes, 20);
  const tasksBySkill = {
    Confidence: {
      title: 'Speak for 2 Minutes Impromptu',
      description: 'Pick any random topic (e.g. your favorite book, today’s weather) and speak out loud for 2 minutes without pausing or preparing.',
      type: 'Practice',
      difficulty: 'Easy',
    },
    Communication: {
      title: 'Ask One Open-Ended Question Today',
      description: 'During a conversation today with a colleague or classmate, ask a thoughtful open-ended question and practice active listening.',
      type: 'Social',
      difficulty: 'Easy',
    },
    'Public Speaking': {
      title: 'Record a 60-Second Video Intro',
      description: 'Use your phone to record a 60-second self-introduction as if you were speaking on stage. Review your clarity and eye contact.',
      type: 'Challenge',
      difficulty: 'Medium',
    },
    'Time Management': {
      title: 'Time-Block Tomorrow Morning',
      description: 'Spend 5 minutes writing down your exact 3 core focus tasks for tomorrow and assign a fixed 45-minute block to each.',
      type: 'Habit',
      difficulty: 'Easy',
    },
    Discipline: {
      title: 'No Phone First 30 Minutes',
      description: 'Tomorrow morning, do not check your smartphone notifications or social media for the first 30 minutes after waking up.',
      type: 'Challenge',
      difficulty: 'Medium',
    },
  };

  const selected = tasksBySkill[primarySkill] || tasksBySkill['Confidence'];

  return {
    title: selected.title,
    description: selected.description,
    type: selected.type,
    skill: primarySkill,
    durationMinutes: time,
    difficulty: selected.difficulty,
    completed: false,
    completedAt: null,
  };
};

/* =========================================================
   SERVICES
========================================================= */

const saveGrowthProfileService = async (userId, payload) => {
  const { skillRatings, goals, challenges, customGoal, availableTimeMinutes, learningPreferences, currentContext, primaryFocus } = payload;

  const ratingsArr = Object.values(skillRatings).map(Number);
  const avgRating = ratingsArr.reduce((a, b) => a + b, 0) / ratingsArr.length;
  const overallScore = Math.round(avgRating * 10);
  const growthStage = determineStage(avgRating);

  // Determine top strengths (top 3 highest rated skills)
  const ratedSkillsSorted = Object.keys(skillRatings)
    .map((k) => ({ name: SKILL_MAP[k], score: Number(skillRatings[k]) }))
    .sort((a, b) => b.score - a.score);

  const strengths = ratedSkillsSorted.slice(0, 3).map((s) => s.name);

  // Calculate calculated priorities using engine
  const priorities = calculatePriorities(skillRatings, goals, challenges, primaryFocus);

  // Generate 12-month roadmap
  const roadmap = generate12MonthRoadmap(priorities, availableTimeMinutes, learningPreferences);

  // Generate initial today's task
  const initialTask = GENERATE_TODAY_TASK(priorities[0].skill, availableTimeMinutes);

  const profileData = {
    user: userId,
    skillRatings,
    goals,
    challenges: challenges || [],
    customGoal: customGoal || '',
    availableTimeMinutes,
    learningPreferences,
    currentContext,
    primaryFocus: primaryFocus || priorities[0].skill,
    growthStage,
    overallScore,
    strengths,
    priorities,
    roadmap,
    dailyTasks: [initialTask],
    activeStreak: 1,
    daysActive: 1,
    lastActiveDate: new Date(),
  };

  const profile = await GrowthProfile.findOneAndUpdate(
    { user: userId },
    profileData,
    { new: true, upsert: true, runValidators: true }
  );

  return profile;
};

const getGrowthProfileService = async (userId) => {
  let profile = await GrowthProfile.findOne({ user: userId });
  if (!profile) {
    throw new ApiError(404, 'Growth profile not found.');
  }

  // Ensure daily task is present for today
  if (!profile.dailyTasks || profile.dailyTasks.length === 0) {
    const topSkill = profile.priorities?.[0]?.skill || 'Confidence';
    const newTask = GENERATE_TODAY_TASK(topSkill, profile.availableTimeMinutes);
    profile.dailyTasks.push(newTask);
    await profile.save();
  }

  return profile;
};

const completeGrowthTaskService = async (userId, taskId) => {
  const profile = await GrowthProfile.findOne({ user: userId });
  if (!profile) {
    throw new ApiError(404, 'Growth profile not found.');
  }

  const task = profile.dailyTasks.id(taskId) || profile.dailyTasks[profile.dailyTasks.length - 1];
  if (task) {
    task.completed = true;
    task.completedAt = new Date();
  }

  // Update streak if completed today
  profile.activeStreak += 1;
  profile.overallScore = Math.min(100, profile.overallScore + 1);

  await profile.save();
  return profile;
};

const saveGrowthReflectionService = async (userId, payload) => {
  const profile = await GrowthProfile.findOne({ user: userId });
  if (!profile) {
    throw new ApiError(404, 'Growth profile not found.');
  }

  profile.weeklyReflections.push(payload);

  // Adaptive adjustment logic: If consistency is low (<5), reduce time commitment slightly
  if (payload.consistencyRating < 5 && profile.availableTimeMinutes > 15) {
    profile.availableTimeMinutes = Math.max(15, profile.availableTimeMinutes - 15);
  } else if (payload.consistencyRating >= 8) {
    profile.overallScore = Math.min(100, profile.overallScore + 3);
  }

  await profile.save();
  return profile;
};

module.exports = {
  saveGrowthProfileService,
  getGrowthProfileService,
  completeGrowthTaskService,
  saveGrowthReflectionService,
};
