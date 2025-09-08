/**
 * Platform Admin API
 * Handles platform administration endpoints
 */

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '../config/constants';

export interface PlatformMetrics {
  totalOrganizations: number;
  totalUsers: number;
  activeUsers: number;
  totalRevenue: number;
  systemHealth: {
    status: 'healthy' | 'degraded' | 'down';
    uptime: number;
    lastChecked: string;
  };
}

export const platformAdminApi = createApi({
  reducerPath: 'platformAdminApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/api/platform-admin`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('access_token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getPlatformMetrics: builder.query<PlatformMetrics, void>({
      query: () => 'metrics',
    }),
    getSystemHealth: builder.query<any, void>({
      query: () => 'health',
    }),
    getOrganizations: builder.query<any[], void>({
      query: () => 'organizations',
      transformResponse: (response: { organizations: any[] }) => response.organizations,
    }),
    getFeatureFlags: builder.query<any[], void>({
      query: () => 'feature-flags',
      transformResponse: (response: { flags: any[] }) => response.flags,
    }),
  }),
});

export const {
  useGetPlatformMetricsQuery,
  useGetSystemHealthQuery,
  useGetOrganizationsQuery,
  useGetFeatureFlagsQuery,
} = platformAdminApi;
