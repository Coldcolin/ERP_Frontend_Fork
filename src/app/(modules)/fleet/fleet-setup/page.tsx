"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, FileSearch, Search } from "lucide-react"
import { useDebounce } from "@/hooks/use-debounce"
import { useEffect } from "react"
import Link from "next/link"
import { useGetAllFleetQuery } from "@/lib/redux/api/fleetApi"
import { AddVehicleModal } from "../_components/AddVechicleModal"
import { useState } from "react"
// import { SelectContent, SelectValue } from "@/components/ui/select"
// import { SelectTrigger } from "@/components/ui/select"
// import { Select } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
// import { SelectItem } from "@/components/ui/select"
import { Input } from "@/components/ui/input"


// interface VehicleMetric {
//   title: string
//   value: number
// }

// Define types for vehicle and maintenance
type Maintenance = {
  nextMaintenanceDate?: string;
  scheduledDate?: string;
};
type Vehicle = {
  maintenanceSchedule?: Maintenance[];
  [key: string]: any;
};




export default function FleetSetupPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // Number of items per page
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchTerm = useDebounce(searchInput, 500); // 500ms delay
  
  // Update search query when debounced value changes
  useEffect(() => {
    setSearchQuery(debouncedSearchTerm);
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  const { data: fleet = { data: [], pagination: { total: 0, totalPages: 1 } }, isLoading, error } = useGetAllFleetQuery({
    page: currentPage,
    limit: pageSize,
    query: searchQuery.trim() || undefined
  }, {
    refetchOnMountOrArgChange: true,
  })

  // console.log(fleet)

  const totalPages = fleet?.pagination?.totalPages || 1

  // Pagination handlers
  const goToPage = (page: number) => {
    setCurrentPage(page)
  }

  const goToPrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  const goToNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
      // The API will automatically refetch when currentPage changes
    }
  }
  
  // Extract error message from the error object
  const errorMessage = (() => {
    if (!error) return '';
    
    // Handle FetchBaseQueryError
    if ('status' in error) {
      if (error.status === 403) {
        // console.log(error)
        return 'Access denied. You do not have permission to view this resource.';
      }
      return typeof error.data === 'object' && error.data && 'message' in error.data
        ? String(error.data.message)
        : 'An error occurred while fetching fleet data';
    }
    
    // Handle SerializedError
    if ('message' in error) {
      return error.message || 'An unknown error occurred';
    }
    
    return 'Failed to load fleet data. Please try again later.';
  })();


  return (
    <div className="container mx-auto py-8">
      {/* Error Alert */}
      {errorMessage && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <p>{errorMessage}</p>
          {error && ('status' in error) && error.status === 403 && (
            <p className="mt-2 text-sm">You don&apos;t have permission to view this resource. Please contact your administrator.</p>
          )}
        </div>
      )}
      
      <div className="flex justify-between items-center mb-1">
        <h1 className="text-2xl font-bold">Fleet Setup & Configurations</h1>
        <div className="flex gap-2">
          <Link href="fleet-setup/assign-vehicle" passHref>
            <Button className="bg-zinc-900 hover:bg-zinc-800" >
              <Plus className="mr-2 h-4 w-4" /> Assign Vehicle
            </Button>
          </Link>
          
          <Link href="fleet-setup/maintenance-schedule" passHref>
            <Button className="bg-zinc-900 hover:bg-zinc-800">
              <Plus className="mr-2 h-4 w-4" /> Add New Schedule
            </Button>
          </Link>
      
        
        </div>
        
      </div>

<div className="container mx-auto py-3 space-y-8">
      
    </div>

    <div>
  {isLoading ? (
    // Loading state
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
    </div>
  ) : fleet?.data?.length === 0 ? (
    // Empty state
    <div className="flex flex-col items-center justify-center h-64 text-center">
      <FileSearch className="w-12 h-12 text-gray-400 mb-4" />
      <p className="text-lg font-medium text-gray-600 mb-2">
        {searchQuery 
          ? `No vehicles found matching "${searchQuery}"`
          : "You do not have any registered vehicles yet"
        }
      </p>
      <p className="text-gray-500 mb-4">
        {searchQuery 
          ? "Try adjusting your search or clear the search to see all vehicles"
          : "Click the button to start adding vehicles"
        }
      </p>
      {searchQuery ? (
        <Button 
          variant="outline" 
          onClick={() => {
            setSearchInput('');
            setSearchQuery('');
          }}
        >
          Clear search
        </Button>
      ) : (
        <Button 
          className="bg-black text-white hover:bg-gray-800" 
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Vehicle
        </Button>
      )}
    </div>
  ) : (
    // Data table
    
    <div className="bg-white rounded-lg overflow-hidden ">
      <div className="mb-6">
      <Card className="bg-white">
        <CardContent className="p-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input 
              placeholder="Search by make, model, or registration..." 
              className="pl-10 bg-gray-50 border-gray-200"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
{/* 
          <div className="flex gap-4">
            <Select>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
                
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Customer Type" />
                
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="logistics">Logistics</SelectItem>
                <SelectItem value="transport">Transport</SelectItem>
                <SelectItem value="distributor">Distributor</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Location" />
                
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lagos">Lagos</SelectItem>
                <SelectItem value="abuja">Abuja</SelectItem>
                <SelectItem value="kano">Kano</SelectItem>
              </SelectContent>
            </Select>
          </div> */}
        </CardContent>
      </Card>
      </div>
      {/* Table Header */}
      <div className="bg-black text-white px-4 py-3 grid grid-cols-6 gap-4">
        <div className="flex items-center">
          <span className="ml-8">Vehicle Name</span>

        </div>
        <div>Type</div>
        <div>Registration</div>
        <div>Current Location</div>
        <div>Next Maintenance Due</div>
        <div>Assignment Status</div>
      </div>

      {/* Table Body */}
      <div>
        {fleet?.data?.map((vehicle: Vehicle) => {
          const getNextMaintenanceDate = () => {
            if (!vehicle.maintenanceSchedule?.length) return null;

            const nextMaintenance = vehicle.maintenanceSchedule.find(
              (maint: Maintenance) =>
                maint.nextMaintenanceDate &&
                new Date(maint.nextMaintenanceDate) > new Date()
            );

            if (nextMaintenance) return nextMaintenance.nextMaintenanceDate;

            const futureMaintenance = vehicle.maintenanceSchedule
              .filter((maint: Maintenance) => new Date(maint.scheduledDate ?? '') > new Date())
              .sort(
                (a: Maintenance, b: Maintenance) =>
                  new Date(a.scheduledDate ?? '').getTime() - new Date(b.scheduledDate ?? '').getTime()
              )[0];

            return futureMaintenance?.scheduledDate;
          };

          const nextDue = getNextMaintenanceDate();
          const formattedDueDate = nextDue
            ? new Date(nextDue).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "No upcoming maintenance";

          return (
            <div
              key={vehicle._id}
              className="px-4 py-4 grid grid-cols-6 gap-4 items-center border-b border-gray-100 bg-gray-50 hover:bg-gray-100"
            >
              {/* Vehicle cells */}
              <div className="flex items-center">
                <Checkbox
                  id={`select-${vehicle._id}`}
                  className="mr-4 h-5 w-5 border-2 border-gray-300 rounded data-[state=checked]:bg-black data-[state=checked]:border-black"
                />
                <span>{vehicle.make} {vehicle.model}</span>
              </div>
              <div>{vehicle.type}</div>
              <div>{vehicle.registration}</div>
              <div>{vehicle.location || "N/A"}</div>
              <div>{formattedDueDate}</div>
              <div
                className={
                  vehicle.currentDriver || vehicle.departments?.length > 0
                    ? "text-green-600 font-medium"
                    : "text-red-600 font-medium"
                }
              >
                {vehicle.currentDriver || vehicle.departments?.length > 0
                  ? "Assigned"
                  : "Unassigned"}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-700">
          Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, fleet?.pagination?.total || 0)} of {fleet?.pagination?.total || 0} entries
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPrevious}
            disabled={currentPage === 1}
            className="px-3 bg-transparent"
          >
            Previous
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => goToPage(page)}
                className={`w-8 h-8 p-0 ${
                  currentPage === page ? "bg-black text-white hover:bg-gray-800" : "hover:bg-gray-100"
                }`}
              >
                {page}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={goToNext}
            disabled={currentPage === totalPages}
            className="px-3 bg-transparent"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )}
</div>
    
<AddVehicleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}
