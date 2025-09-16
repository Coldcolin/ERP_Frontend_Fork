import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

type PaginationParams = {
    page?: number;
    limit?: number;
    query?: string;
  };

const baseQuery = fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}`,
    prepareHeaders: (headers) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const apiKey = process.env.NEXT_PUBLIC_API_KEY;
    
        if (token) {
          headers.set('Authorization', `Bearer ${token}`);
        }
        if (apiKey) {
          headers.set('x-api-key', apiKey);
        }
        return headers;
      },
});

export const maintenanceApi = createApi({
    reducerPath: 'maintenanceApi',
    baseQuery: baseQuery,
    tagTypes: ['Maintenance'],
    endpoints: (builder) => ({
        createMaintenance: builder.mutation({
            query: (data) => ({
                url: `/maintenance`,
                method: 'POST',
                body: data,
            }), 
            invalidatesTags: ['Maintenance'],
        }),
        getAllMaintenance: builder.query({
            // query: () => `/clients`,
            query: ({ page = 1, limit = 10, query }: PaginationParams = {}) => ({
                url: query ? '/maintenance/search' : '/maintenance',
                params: { 
                    page, 
                    limit,
                    ...(query && { query })
                },
            }),
            providesTags: ['Maintenance'],
        }),
        getSingleMaintenance: builder.query({
            query: (id) => `/maintenance/${id}`,
            providesTags: ['Maintenance'],
        }),
        deleteMaintenance: builder.mutation({
            query: (id) => ({
                url: `/maintenance/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Maintenance'],
        }),
        
    }),
});



export const {
    useCreateMaintenanceMutation,
    useGetAllMaintenanceQuery,
    useGetSingleMaintenanceQuery,
    useDeleteMaintenanceMutation,
    } = maintenanceApi;