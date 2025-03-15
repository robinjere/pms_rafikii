import { Property } from '../types/types';

const API_BASE_URL = process.env.REACT_APP_BACKEND_API_BASE_URL;

export const fetchProperties = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const response = await fetch(`${API_BASE_URL}/properties?${queryString}`);
  if (!response.ok) {
    throw new Error('Failed to fetch properties');
  }
  return response.json();
};
