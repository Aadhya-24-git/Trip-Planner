import { apiClient } from './client';
import { BudgetBreakdown } from '../types';

export interface CalculateBudgetPayload {
  destination_name: string;
  starting_city: string;
  duration_days: number;
  travelers_count: number;
  transportation: string;
  accommodation: string;
  trip_pace: string;
}

export const calculateBudget = async (payload: CalculateBudgetPayload): Promise<BudgetBreakdown> => {
  const res = await apiClient.post<BudgetBreakdown>('/api/budget/calculate', payload);
  return res.data;
};
