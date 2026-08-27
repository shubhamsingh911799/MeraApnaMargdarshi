import { api } from './api';

export const getGrowthProfile = async (token) => {
  return await api.getGrowthProfile(token);
};

export const saveGrowthProfile = async (payload, token) => {
  return await api.saveGrowthProfile(payload, token);
};

export const getGrowthRoadmap = async (token) => {
  return await api.getGrowthRoadmap(token);
};

export const completeGrowthTask = async (taskId, token) => {
  return await api.completeGrowthTask(taskId, token);
};

export const saveGrowthReflection = async (payload, token) => {
  return await api.saveGrowthReflection(payload, token);
};
