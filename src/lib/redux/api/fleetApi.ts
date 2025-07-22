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

export const fleetApi = createApi({
    reducerPath: 'fleetApi',
    baseQuery: baseQuery,
    tagTypes: ['Fleet','Maintenance'],
    endpoints: (builder) => ({
        createFleet: builder.mutation({
            query: (userData) => ({
                url: `/vehicles`,   
                method: 'POST',
                body:userData,
            }), 
            invalidatesTags: ['Fleet'],
        }),
        getAllFleet: builder.query({
            query: () => `/vehicles`,
            providesTags: ['Fleet'],
        }),
        assignVehicle: builder.mutation({
            query: ({ vehicleId, assignmentData }) => ({
                url: `/vehicles/${vehicleId}/assign`,
                method: 'PATCH',
                body: assignmentData,
            }),
            invalidatesTags: ['Fleet'],
        }),
        createMaintenance: builder.mutation({
            query: (maintenanceData) => ({
                url: `/maintenance`,
                method: 'POST',
                body: maintenanceData,
            }),
            invalidatesTags: ['Maintenance'],
        }),
        getMaintenanceByVehicle: builder.query({
            query: (vehicleId) => `/maintenance/vehicle/${vehicleId}`,
            providesTags: ['Maintenance'],
        }),
        updateMaintenance: builder.mutation({
            query: ({ maintenanceId, maintenanceData }) => ({
                url: `/maintenance/${maintenanceId}`,
                method: 'PUT',
                body: maintenanceData,
            }),
            invalidatesTags: ['Maintenance'],
        }),
        deleteMaintenance: builder.mutation({
            query: (maintenanceId) => ({
                url: `/maintenance/${maintenanceId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Maintenance'],
        }),
    }),
});

export const {
    useCreateFleetMutation,
    useGetAllFleetQuery,
    useAssignVehicleMutation,
    useCreateMaintenanceMutation,
    useGetMaintenanceByVehicleQuery,
    useUpdateMaintenanceMutation,
    useDeleteMaintenanceMutation,
} = fleetApi;