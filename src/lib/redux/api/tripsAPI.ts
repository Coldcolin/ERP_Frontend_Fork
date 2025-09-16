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

export const tripApi = createApi({
    reducerPath: 'tripApi',
    baseQuery: baseQuery,
    tagTypes: ['Trip'],
    endpoints: (builder) => ({
        createTrip: builder.mutation({
            query: (userData) => ({
                url: `/trips`,
                method: 'POST',
                body: userData,
            }), 
            invalidatesTags: ['Trip'],
        }),
        getAllTrip: builder.query({
            // query: () => `/clients`,
            query: ({ page = 1, limit = 10, query }: PaginationParams = {}) => ({
                url: query ? '/trips/search' : '/trips',
                params: { 
                    page, 
                    limit,
                    ...(query && { query })
                },
            }),
            providesTags: ['Trip'],
        }),
        getSingleTrip: builder.query({
            query: (id) => `/trips/${id}`,
            providesTags: ['Trip'],
        }),
        
    }),
});



export const {
    useCreateTripMutation,
    useGetAllTripQuery,
    useGetSingleTripQuery,
} = tripApi;