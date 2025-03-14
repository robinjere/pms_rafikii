// Define types for our application entities
export interface Property {
  id: string;
  name: string;
  address: string;
  type: 'residential' | 'commercial';
  utilities?: UtilityBill[];
}

export interface UtilityBill {
  id: string;
  propertyId: string;
  type: 'electricity' | 'water' | 'gas';
  amount: number;
  date: string;
}

// Form data types
export interface PropertyFormData {
  name: string;
  address: string;
  type: 'residential' | 'commercial';
}

export interface UtilityBillFormData {
  propertyId: string;
  type: 'electricity' | 'water' | 'gas';
  amount: string;
  date: string;
}

// Error state types
export interface FormErrors {
  [key: string]: string | null;
}

// Chart data type
export interface ChartDataItem {
  name: string;
  electricity: number;
  water: number;
  gas: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PropertySearchParams extends PaginationParams {
  term?: string;
  type?: 'all' | 'residential' | 'commercial';
}

export interface UtilitySearchParams extends PaginationParams {
  propertyId: string;
}