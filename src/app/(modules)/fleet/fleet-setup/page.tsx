"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, FileSearch } from "lucide-react"
import Link from "next/link"
import { useGetAllFleetQuery } from "@/lib/redux/api/fleetApi"


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


// const recentVehicles: Vehicle[] = [
//   {
//     id: "1",
//     name: "Ford Explorer",
//     year: 2023,
//     code: "ABC 123",
//     image: "/placeholder.svg?height=200&width=300",
//   },
//   {
//     id: "2",
//     name: "Ford F-150",
//     year: 2022,
//     code: "XYZ 456",
//     image: "/placeholder.svg?height=200&width=300",
//   },
//   {
//     id: "3",
//     name: "Toyota Camry",
//     year: 2021,
//     code: "DEF 789",
//     image: "/placeholder.svg?height=200&width=300",
//   },
//   {
//     id: "4",
//     name: "Mack Anthem Diecast",
//     year: 2023,
//     code: "GHI 012",
//     image: "/placeholder.svg?height=200&width=300",
//   },
// ]

export default function FleetSetupPage() {
  const { data: fleet = [], isLoading } = useGetAllFleetQuery({})
  console.log("this is fleet",fleet)


  return (
    <div className="container mx-auto py-8  ">
        <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Fleet Setup & Configurations</h1>
        <div className="flex gap-2">
        <Link href="fleet-setup/assign-vehicle" passHref>
          <Button className="bg-zinc-900 hover:bg-zinc-800">
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

<div className="container mx-auto py-8 space-y-8">
      {/* Metrics Cards */}
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <Card key={index} className="border border-gray-200">
            <CardContent className="p-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div> */}

    
      {/* <div className="space-y-6">
        <div className="border-b border-gray-200 pb-2">
          <h2 className="text-xl font-semibold text-gray-900">Recently Added Vehicles</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentVehicles.map((vehicle) => (
            <Card key={vehicle.id} className="border border-gray-200 overflow-hidden">
              <div className="bg-gray-100 p-4">
                <img
                  src={vehicle.image || "/placeholder.svg"}
                  alt={vehicle.name}
                  className="w-full h-40 object-cover rounded-md"
                />
              </div>
              <CardContent className="p-4">
                <p className="text-sm font-medium text-gray-900">
                  {vehicle.name} - {vehicle.year} - {vehicle.code}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div> */}
    </div>

    <div>
  {isLoading ? (
    // Loading state
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
    </div>
  ) : fleet?.length === 0 ? (
    // Empty state
    <div className="flex flex-col items-center justify-center h-64 text-center">
      <FileSearch className="w-12 h-12 text-gray-400 mb-4" />
      <p className="text-lg font-medium text-gray-600 mb-2">
        You do not have any registered vehicles yet
      </p>
      <p className="text-gray-500 mb-4">
        Click the button to start adding vehicles
      </p>
      <Button className="bg-black text-white hover:bg-gray-800">
        <Plus className="mr-2 h-4 w-4" />
        Add Vehicle
      </Button>
    </div>
  ) : (
    // Data table
    <div className="bg-white rounded-lg overflow-hidden ">
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
        {fleet?.map((vehicle: Vehicle) => {
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

      <div className="flex justify-center mt-4 mb-6">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" className="h-8 w-8">
            &lt;
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8 bg-black text-white hover:bg-black/90">
            1
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8">
            &gt;
          </Button>
        </div>
      </div>
    </div>
  )}
</div>
    

     
    </div>
  )
}
