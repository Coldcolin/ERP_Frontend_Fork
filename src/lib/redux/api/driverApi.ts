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

export const driverApi = createApi({
    reducerPath: 'driverApi',
    baseQuery: baseQuery,
    tagTypes: ['Driver'],
    endpoints: (builder) => ({
        createDriver: builder.mutation({
            query: (userData) => ({
                url: `/drivers`,
                method: 'POST',
                body:userData,
            }), 
            invalidatesTags: ['Driver'],
        }),
        getAllDriver: builder.query({
            // query: () => `/drivers`,
            query: ({ page = 1, limit = 10, query }: PaginationParams = {}) => ({
                url: query ? '/drivers/search' : '/drivers',
                params: { 
                    page, 
                    limit,
                    ...(query && { query })
                },
            }),
            providesTags: ['Driver'],
        }),
        getDriverDetails: builder.query({
            query: (driverId)=> `/drivers/${driverId}`,
            providesTags: ['Driver']
        }),
        updateDriverStatus: builder.mutation({
            query:(driverdata)=>({
                url: `/drivers/${driverdata.id}?status=${driverdata.status}`,
                method: 'PATCH',
                invalidatesTags: ['Driver']
            })
        }),
        deleteDriver: builder.mutation({
            query:(id)=>({
                url: `/drivers/${id}`,
                method: 'DELETE',
                invalidatesTags: ['Driver']
            })
        })
    }),
});

export const {
    useCreateDriverMutation,
    useGetAllDriverQuery,
    useGetDriverDetailsQuery,
    useUpdateDriverStatusMutation,
    useDeleteDriverMutation
} = driverApi;