import { api } from "./api";

export const getDashboard = async (token) => {
  const response = await api.getDashboard(token);
  return response.data;
};