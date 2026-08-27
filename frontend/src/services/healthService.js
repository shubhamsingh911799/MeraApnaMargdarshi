import { api } from "./api";

/* =========================================================
   HEALTH PROFILE
========================================================= */

export const saveHealthProfile = async (data, token) => {
  return await api.saveHealthProfile(data, token);
};

export const getHealthProfile = async (token) => {
  return await api.getHealthProfile(token);
};

/* =========================================================
   HEALTH ANALYSIS
========================================================= */

export const getHealthAnalysis = async (token) => {
  return await api.getHealthAnalysis(token);
};

/* =========================================================
   HEALTH PLAN
========================================================= */

export const generateHealthPlan = async (token) => {
  return await api.generateHealthPlan(token);
};

export const getHealthPlan = async (token) => {
  return await api.getHealthPlan(token);
};