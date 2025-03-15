import { Property, UtilityBill } from '../types/types';

const API_BASE_URL = process.env.REACT_APP_BACKEND_API_BASE_URL;

export const fetchProperties = async (params?: {
  term?: string;
  type?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}) => {
  const queryParams = new URLSearchParams();
  
  if (params?.term) queryParams.append('term', params.term);
  if (params?.type && params.type !== 'all') queryParams.append('type', params.type);
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

  const response = await fetch(`${API_BASE_URL}/properties/search?${queryParams}`);
  if (!response.ok) throw new Error('Failed to fetch properties');
  return response.json();
};

export const fetchPropertyDetails = async (id: string) => {
  const response = await fetch(`${API_BASE_URL}/properties/${id}`);
  if (!response.ok) throw new Error('Failed to fetch property details');
  return response.json();
};

export const createProperty = async (property: Omit<Property, 'id' | 'utilities'>) => {
  const response = await fetch(`${API_BASE_URL}/properties`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(property)
  });
  if (!response.ok) throw new Error('Failed to create property');
  return response.json();
};

export const createUtilityBill = async (utility: Omit<UtilityBill, 'id'>) => {
  const response = await fetch(`${API_BASE_URL}/utilities`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(utility)
  });
  if (!response.ok) throw new Error('Failed to create utility bill');
  return response.json();
};