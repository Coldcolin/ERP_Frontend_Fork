import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

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
            query: () => `/drivers`,
            providesTags: ['Driver'],
        }),
        getDriverDetails: builder.query({
            query: (driverId)=> `/drivers/${driverId}`,
            providesTags: ['Driver']
        })
    }),
});

export const {
    useCreateDriverMutation,
    useGetAllDriverQuery,
    useGetDriverDetailsQuery
} = driverApi;