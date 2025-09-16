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

export const clientApi = createApi({
    reducerPath: 'clientApi',
    baseQuery: baseQuery,
    tagTypes: ['Client'],
    endpoints: (builder) => ({
        createClient: builder.mutation({
            query: (userData) => ({
                url: `/clients`,
                method: 'POST',
                body: userData,
            }), 
            invalidatesTags: ['Client'],
        }),
        getAllClient: builder.query({
            // query: () => `/clients`,
            query: ({ page = 1, limit = 10, query }: PaginationParams = {}) => ({
                url: query ? '/clients/search' : '/clients',
                params: { 
                    page, 
                    limit,
                    ...(query && { query })
                },
            }),
            providesTags: ['Client'],
        }),
        getSingleClient: builder.query({
            query: (id) => `/clients/${id}`,
            providesTags: ['Client'],
        }),
        deleteClient: builder.mutation({
            query: (id) => ({
                url: `/clients/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Client'],
        }),
        
    }),
});



export const {
    useCreateClientMutation,
    useGetAllClientQuery,
    useGetSingleClientQuery,
    useDeleteClientMutation,
} = clientApi;