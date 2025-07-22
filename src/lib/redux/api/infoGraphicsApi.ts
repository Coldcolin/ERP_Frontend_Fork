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

export const infoGraphicsApi = createApi({
    reducerPath: 'infoGraphicsApi',
    baseQuery: baseQuery,
    tagTypes: ['Info'],
    endpoints:(builder)=>({
      getOverview: builder.query({
        query: ()=> '/info/overview',
        providesTags: ['Info'] 
      }),
      getMileageInfo: builder.query({
        query:()=> '/info/mileage/info',
        providesTags: ['Info']
      }),
      getFuelUsageInfo: builder.query({
        query:()=> '/info/fuel/usage',
        providesTags: ['Info']
      }),
      getFuelExpensesInfo: builder.query({
        query:()=> '/info/fuel/expenses',
        providesTags: ['Info']
      })

    })
})


export const {useGetOverviewQuery, useGetMileageInfoQuery, useGetFuelUsageInfoQuery, useGetFuelExpensesInfoQuery}= infoGraphicsApi



