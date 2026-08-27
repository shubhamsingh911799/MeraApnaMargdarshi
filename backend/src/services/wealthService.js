const WealthProfile = require("../models/WealthProfile");
const WealthPlan = require("../models/WealthPlan");
const ApiError = require("../utils/ApiError");

/* =========================================================
   HELPER — FINANCIAL HEALTH SCORE CALCULATOR
========================================================= */

const calculateFinancialMetrics = (profile) => {
  const income = Number(profile.monthlyIncome) || 0;
  const fixed = Number(profile.fixedExpenses) || 0;
  const variable = Number(profile.variableExpenses) || 0;
  const totalExpenses = fixed + variable;
  const cashFlow = income - totalExpenses;
  const savings = Number(profile.currentSavings) || 0;
  const investments = Number(profile.currentInvestments) || 0;
  const debt = Number(profile.totalDebt) || 0;

  // Savings rate
  const savingsRate = income > 0 ? Math.max(0, Math.round((cashFlow / income) * 100)) : 0;

  // Emergency runway in months
  const emergencyRunwayMonths = totalExpenses > 0 
    ? Number((savings / totalExpenses).toFixed(1)) 
    : (savings > 0 ? 12 : 0);

  // Debt to annual income ratio %
  const annualIncome = income * 12;
  const debtToIncomeRatio = annualIncome > 0 ? Math.round((debt / annualIncome) * 100) : 0;

  // Actual budget percentages
  const needsPercent = income > 0 ? Math.round((fixed / income) * 100) : 0;
  const wantsPercent = income > 0 ? Math.round((variable / income) * 100) : 0;
  const actualSavingsPercent = savingsRate;

  // Scoring algorithm (0-100)
  let score = 0;

  // Cash flow (max 25 pts)
  if (cashFlow > 0) {
    if (savingsRate >= 20) score += 25;
    else if (savingsRate >= 10) score += 18;
    else score += 10;
  } else if (cashFlow === 0) {
    score += 5;
  }

  // Emergency Fund (max 30 pts)
  if (emergencyRunwayMonths >= 6) score += 30;
  else if (emergencyRunwayMonths >= 3) score += 20;
  else if (emergencyRunwayMonths >= 1) score += 10;
  else score += 2;

  // Debt Burden (max 25 pts)
  if (debt === 0) score += 25;
  else if (debtToIncomeRatio < 20) score += 18;
  else if (debtToIncomeRatio < 40) score += 10;
  else score += 5;

  // Wealth Accumulation & Investments (max 20 pts)
  if (investments > 0) {
    const investmentToIncomeRatio = annualIncome > 0 ? (investments / annualIncome) * 100 : 0;
    if (investmentToIncomeRatio >= 50) score += 20;
    else if (investmentToIncomeRatio >= 20) score += 15;
    else score += 10;
  } else if (savings > 0) {
    score += 5;
  }

  score = Math.min(100, Math.max(0, score));

  let category = "Needs Attention";
  if (score >= 80) category = "Excellent";
  else if (score >= 65) category = "Good";
  else if (score >= 50) category = "Fair";

  return {
    monthlyIncome: income,
    fixedExpenses: fixed,
    variableExpenses: variable,
    totalExpenses,
    cashFlow,
    savingsRate,
    emergencyRunwayMonths,
    debtToIncomeRatio,
    currentSavings: savings,
    currentInvestments: investments,
    totalDebt: debt,
    score,
    category,
    budgetActual: {
      needs: needsPercent,
      wants: wantsPercent,
      savings: actualSavingsPercent,
    },
    budgetIdeal: {
      needs: 50,
      wants: 30,
      savings: 20,
    },
  };
};

/* =========================================================
   SAVE WEALTH PROFILE SERVICE
========================================================= */

const saveWealthProfileService = async (userId, body) => {
  const profile = await WealthProfile.findOneAndUpdate(
    { user: userId },
    {
      user: userId,
      ...body,
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
    }
  );

  return profile;
};

/* =========================================================
   GET WEALTH PROFILE SERVICE
========================================================= */

const getWealthProfileService = async (userId) => {
  const profile = await WealthProfile.findOne({ user: userId });

  if (!profile) {
    throw new ApiError(404, "Wealth profile not found.");
  }

  return profile;
};

/* =========================================================
   GET WEALTH ANALYSIS SERVICE
========================================================= */

const getWealthAnalysisService = async (userId) => {
  const profile = await WealthProfile.findOne({ user: userId });

  if (!profile) {
    throw new ApiError(404, "Wealth profile not found.");
  }

  const metrics = calculateFinancialMetrics(profile);

  // Recommendations generator
  const recommendations = [];

  if (metrics.cashFlow < 0) {
    recommendations.push({
      type: "warning",
      title: "Negative Monthly Cash Flow",
      description: `Your monthly expenses ($${metrics.totalExpenses}) exceed your monthly income ($${metrics.monthlyIncome}). Focus immediately on reducing variable spending.`,
    });
  } else if (metrics.savingsRate < 20) {
    recommendations.push({
      type: "info",
      title: "Boost Your Savings Rate",
      description: `Your current savings rate is ${metrics.savingsRate}%. Target saving at least 20% ($${Math.round(metrics.monthlyIncome * 0.2)}) of your income each month.`,
    });
  } else {
    recommendations.push({
      type: "success",
      title: "Strong Savings Velocity",
      description: `Great job saving ${metrics.savingsRate}% of your income! Keep maintaining this disciplined cash flow.`,
    });
  }

  if (metrics.emergencyRunwayMonths < 3) {
    recommendations.push({
      type: "warning",
      title: "Build Emergency Reserve",
      description: `You have ${metrics.emergencyRunwayMonths} months of liquid emergency coverage. We recommend accumulating 3 to 6 months ($${metrics.totalExpenses * 3} - $${metrics.totalExpenses * 6}) as a safety buffer.`,
    });
  } else {
    recommendations.push({
      type: "success",
      title: "Emergency Safety Net Intact",
      description: `Your liquid emergency fund covers ${metrics.emergencyRunwayMonths} months of living expenses.`,
    });
  }

  if (metrics.totalDebt > 0) {
    recommendations.push({
      type: "warning",
      title: "Active Debt Management",
      description: `You have $${metrics.totalDebt} in active debt. Prioritize high-interest debts using the debt avalanche or snowball method.`,
    });
  }

  if (metrics.currentInvestments === 0 && metrics.emergencyRunwayMonths >= 3) {
    recommendations.push({
      type: "info",
      title: "Start Wealth Compound Growth",
      description: "You have an emergency reserve ready! Consider initiating low-cost index funds or automated SIP investments to grow capital.",
    });
  }

  return {
    profile,
    metrics,
    recommendations,
  };
};

/* =========================================================
   GENERATE 12-MONTH WEALTH PLAN SERVICE
========================================================= */

const generateWealthPlanService = async (userId) => {
  const profile = await WealthProfile.findOne({ user: userId });

  if (!profile) {
    throw new ApiError(404, "Wealth profile not found. Complete your wealth profile first.");
  }

  const metrics = calculateFinancialMetrics(profile);
  const monthlyExpenses = metrics.totalExpenses;
  const emergencyTarget = monthlyExpenses * (profile.targetEmergencyFundMonths || 6);
  const targetMonthlySavings = Math.max(0, Math.round(metrics.monthlyIncome * 0.2));

  // Risk profile investment allocation strategy
  let investmentAllocation = { lowRiskPercent: 50, moderateRiskPercent: 40, highRiskPercent: 10 };
  if (profile.riskTolerance === "Low") {
    investmentAllocation = { lowRiskPercent: 70, moderateRiskPercent: 25, highRiskPercent: 5 };
  } else if (profile.riskTolerance === "High") {
    investmentAllocation = { lowRiskPercent: 25, moderateRiskPercent: 45, highRiskPercent: 30 };
  }

  const goals = [
    {
      title: "Build 6-Month Emergency Safety Buffer",
      description: `Accumulate $${emergencyTarget} in liquid high-yield savings to withstand unexpected events.`,
      priority: metrics.emergencyRunwayMonths < 3 ? "high" : "medium",
    },
    {
      title: "Optimize Monthly Cash Flow (50/30/20 Rule)",
      description: `Cap essential living costs to 50% ($${Math.round(metrics.monthlyIncome * 0.5)}) and allocate at least 20% ($${targetMonthlySavings}) to savings/investments.`,
      priority: "high",
    },
  ];

  if (metrics.totalDebt > 0) {
    goals.push({
      title: "Systematic Debt Elimination",
      description: `Pay off $${metrics.totalDebt} outstanding liabilities systematically using dedicated monthly surpluses.`,
      priority: "high",
    });
  }

  goals.push({
    title: "Long-Term Wealth Compounding Strategy",
    description: `Deploy systematic monthly investment (SIP) aligned with your ${profile.riskTolerance} risk profile.`,
    priority: "medium",
  });

  // Generate 12 monthly roadmap blocks
  const monthlyRoadmap = [
    {
      month: 1,
      title: "Financial Audit & Expense Tracking",
      focus: "Foundation",
      objective: "Establish absolute clarity over fixed and variable spending habits.",
      milestones: [
        { title: "Audit Bank Statements", description: "Categorize all spending from the last 30 days into Needs vs Wants." },
        { title: "Automate Savings Transfer", description: `Set up an automated monthly transfer of $${targetMonthlySavings} on payday.` },
      ],
      completed: false,
    },
    {
      month: 2,
      title: "Budget Optimization & Waste Reduction",
      focus: "Cash Flow",
      objective: "Identify and eliminate unused subscriptions and high variable expenses.",
      milestones: [
        { title: "Cancel Unused Subscriptions", description: "Audit recurring charges and recurring memberships." },
        { title: "Negotiate Bills", description: "Review internet, mobile, and utility rates for discount opportunities." },
      ],
      completed: false,
    },
    {
      month: 3,
      title: "Emergency Reserve Acceleration",
      focus: "Liquidity",
      objective: "Strengthen liquid cash reserves to cover urgent surprises.",
      milestones: [
        { title: "High-Yield Savings Setup", description: "Move emergency savings into a high-interest liquid account." },
        { title: "First Reserve Milestone", description: `Reach at least 2 months of emergency expense coverage ($${monthlyExpenses * 2}).` },
      ],
      completed: false,
    },
    {
      month: 4,
      title: "High-Interest Debt Strategy",
      focus: "Liability Reduction",
      objective: "Accelerate payoff of high-cost credit debts or loans.",
      milestones: [
        { title: "List Liabilities", description: "Rank all debts by APR interest rate (Avalanche Method)." },
        { title: "Apply Surplus Payments", description: "Direct an extra 10% cash flow toward top-priority debt." },
      ],
      completed: false,
    },
    {
      month: 5,
      title: "Investment Readiness & Knowledge",
      focus: "Education",
      objective: "Understand investment vehicles suited to your risk tolerance.",
      milestones: [
        { title: "Index Fund Basics", description: "Study total market index funds, ETFs, and SIP mechanisms." },
        { title: "Investment Account Verification", description: "Open/verify low-cost brokerage or mutual fund accounts." },
      ],
      completed: false,
    },
    {
      month: 6,
      title: "Mid-Year Wealth Checkpoint",
      focus: "Review & Adjust",
      objective: "Measure 6-month progress against target savings and debt payoff.",
      milestones: [
        { title: "Net Worth Check", description: "Calculate Net Worth (Assets minus Liabilities) and compare with Day 1." },
        { title: "Rebalance Budget", description: "Adjust budget allocations according to income/cost changes." },
      ],
      completed: false,
    },
    {
      month: 7,
      title: "Systematic Investment Launch (SIP)",
      focus: "Asset Growth",
      objective: "Initiate automated recurring monthly investments.",
      milestones: [
        { title: "Set Up SIP", description: `Allocate recurring monthly investments based on your ${profile.riskTolerance} profile.` },
        { title: "Diversify Assets", description: "Spread capital across equities, index funds, and safe liquid funds." },
      ],
      completed: false,
    },
    {
      month: 8,
      title: "Tax Planning & Efficiency",
      focus: "Protection",
      objective: "Maximize legal tax-deductible accounts and savings vehicles.",
      milestones: [
        { title: "Tax-Saving Investments", description: "Utilize tax-deferred retirement accounts or tax-saving funds." },
        { title: "Document Organization", description: "Create a centralized repository for financial and tax documents." },
      ],
      completed: false,
    },
    {
      month: 9,
      title: "Side Income & Skill Monetization",
      focus: "Income Expansion",
      objective: "Explore secondary income streams or career growth opportunities.",
      milestones: [
        { title: "Identify Skills", description: "Pinpoint 1 monetizable skill for freelancing or side projects." },
        { title: "Primary Career Growth", description: "Review raise/promotion targets or certification opportunities." },
      ],
      completed: false,
    },
    {
      month: 10,
      title: "Insurance & Risk Protection",
      focus: "Asset Safeguard",
      objective: "Ensure adequate health, term life, and property coverage.",
      milestones: [
        { title: "Insurance Review", description: "Verify active health insurance and emergency policies." },
        { title: "Nominee Update", description: "Ensure beneficiary details are up to date on all financial accounts." },
      ],
      completed: false,
    },
    {
      month: 11,
      title: "Portfolio Optimization",
      focus: "Compound Growth",
      objective: "Review investment yields and optimize asset allocation.",
      milestones: [
        { title: "Asset Allocation Audit", description: `Verify portfolio matches target (${investmentAllocation.lowRiskPercent}% Low / ${investmentAllocation.moderateRiskPercent}% Mid / ${investmentAllocation.highRiskPercent}% High).` },
        { title: "Reinvest Dividends", description: "Ensure automated dividend reinvestment is enabled." },
      ],
      completed: false,
    },
    {
      month: 12,
      title: "Annual Wealth Review & Future Blueprint",
      focus: "Mastery",
      objective: "Celebrate 1-year progress and plan the next year's wealth milestones.",
      milestones: [
        { title: "Annual Net Worth Audit", description: "Measure total wealth accumulated over the past 12 months." },
        { title: "Set Year 2 Targets", description: "Establish long-term financial freedom goals." },
      ],
      completed: false,
    },
  ];

  const plan = await WealthPlan.findOneAndUpdate(
    { user: userId },
    {
      user: userId,
      planTitle: "12-Month Financial Mastery Roadmap",
      durationMonths: 12,
      financialHealthScore: metrics.score,
      monthlySavingsTarget: targetMonthlySavings,
      emergencyFundTarget: emergencyTarget,
      budgetRule: metrics.budgetIdeal,
      investmentAllocation,
      goals,
      monthlyRoadmap,
      overallProgress: 0,
      status: "active",
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
    }
  );

  return plan;
};

/* =========================================================
   GET WEALTH PLAN SERVICE
========================================================= */

const getWealthPlanService = async (userId) => {
  let plan = await WealthPlan.findOne({ user: userId });

  if (!plan) {
    // Attempt auto-generation if profile exists
    try {
      plan = await generateWealthPlanService(userId);
    } catch {
      throw new ApiError(404, "Wealth plan not found. Please create a wealth profile first.");
    }
  }

  return plan;
};

module.exports = {
  calculateFinancialMetrics,
  saveWealthProfileService,
  getWealthProfileService,
  getWealthAnalysisService,
  generateWealthPlanService,
  getWealthPlanService,
};
