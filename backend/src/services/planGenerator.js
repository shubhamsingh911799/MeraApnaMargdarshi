const generateDailyPlan = ({
  user,
  healthProfile = null,
  growthProfile = null,
  wealthProfile = null,
}) => {
  const tasks = [
    {
      title: "Drink 3L Water",
      category: "Health",
      priority: "High",
      estimatedMinutes: 10,
      completed: false,
    },
    {
      title: "Walk at least 8000 Steps",
      category: "Health",
      priority: "Medium",
      estimatedMinutes: 60,
      completed: false,
    },
    {
      title: "Complete Today's Workout",
      category: "Health",
      priority: "High",
      estimatedMinutes: 60,
      completed: false,
    },
    {
      title: "Practice Coding for 1 Hour",
      category: "Growth",
      priority: "High",
      estimatedMinutes: 60,
      completed: false,
    },
    {
      title: "Read 10 Pages",
      category: "Growth",
      priority: "Medium",
      estimatedMinutes: 20,
      completed: false,
    },
    {
      title: "Track Today's Expenses",
      category: "Wealth",
      priority: "Medium",
      estimatedMinutes: 10,
      completed: false,
    },
    {
      title: "Sleep Before 11 PM",
      category: "Lifestyle",
      priority: "High",
      estimatedMinutes: 0,
      completed: false,
    },
  ];

  return tasks;
};

module.exports = {
  generateDailyPlan,
};