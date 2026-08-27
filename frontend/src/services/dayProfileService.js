import { api } from "./api";

/* =========================================================
   DAY PROFILE
========================================================= */

export const saveDayProfile = async (data, token) => {
  const response = await api.saveDayProfile(data, token);
  return response.data;
};

export const getDayProfile = async (token) => {
  const response = await api.getDayProfile(token);
  return response.data;
};

export const deleteDayProfile = async (token) => {
  const response = await api.deleteDayProfile(token);
  return response.data;
};