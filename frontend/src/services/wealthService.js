import { api } from './api';

export const saveWealthProfile = async (data, token) => {
  return await api.saveWealthProfile(data, token);
};

export const getWealthProfile = async (token) => {
  return await api.getWealthProfile(token);
};

export const getWealthAnalysis = async (token) => {
  return await api.getWealthAnalysis(token);
};

export const generateWealthPlan = async (token) => {
  return await api.generateWealthPlan(token);
};

export const getWealthPlan = async (token) => {
  return await api.getWealthPlan(token);
};
