import { api } from "./api";

/* =========================================================
   GET TODAY PLAN
========================================================= */

export const getTodayPlan = async (token) => {
  const response = await api.getTodayPlan(token);
  return response.data;
};

/* =========================================================
   TOGGLE TASK
========================================================= */

export const toggleTask = async (
  planId,
  taskId,
  completed,
  token
) => {
  const response = await api.toggleTask(
    planId,
    taskId,
    completed,
    token
  );

  return response.data;
};