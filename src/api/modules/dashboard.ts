import { get } from '../request'

export interface DashboardStats {
  totalUsers: number
  totalOrders: number
  totalVisits: number
  totalMessages: number
}

export function getDashboardStats(): Promise<DashboardStats> {
  return get('/api/dashboard/stats')
}

export function getVisitTrend(): Promise<{ weeks: string[]; visits: number[]; orders: number[] }> {
  return get('/api/dashboard/trend')
}
