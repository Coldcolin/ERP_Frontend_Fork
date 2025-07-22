"use client"
// import { MoreHorizontal } from "lucide-react"
import Link from "next/link"
import {useGetAllFleetQuery} from "../../../../lib/redux/api/fleetApi"
import { Spinner } from "@/components/ui/spinner"

// interface MetricCardProps {
//   title: string;
//   value: string;
//   unit?: string;
//   subtext?: string;
//   bgColor?: string;
//   textColor?: string;
// }

// Define FleetVehicle type
type FleetVehicle = {
  _id: string;
  year: string;
  make: string;
  model: string;
  weight: string;
  type: string;
  exempt: string;
  plateNumber?: string;
  location?: string;
  currentDriver?: {
    personalInfo?: {
      name?: string;
    };
  };
  status?: string;
};

export default function VehicleDashboard() {
  const {data: allVehicles, isLoading}= useGetAllFleetQuery({})
  // console.log(allVehicles)
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner size="lg" />
      </div>
    )
  }
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Vehicles</h1>

      {/* Metrics Cards */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <MetricCard title="Fleets" value="1,283" subtext="10%" bgColor="bg-[#0a192f]" textColor="text-white" />
        <MetricCard title="Miles Driven" value="25675k" subtext="15%" />
        <MetricCard title="Fuel consumption" value="10238" unit="/Gal" subtext="13%" />
        <MetricCard title="Avg fuel cost" value="₹998" unit="/Gal" subtext="14%" />
        <MetricCard title="Avg miles" value="138" subtext="7%" />
      </div> */}

      {/* Vehicles Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#0a192f] text-white">
              <th className="p-3 text-left">
                <input type="checkbox" className="rounded" />
              </th>
              <th className="p-3 text-left">Vehicle ID</th>
              <th className="p-3 text-left">Location</th>
              <th className="p-3 text-left">Make</th>
              <th className="p-3 text-left">Model</th>
              <th className="p-3 text-left">Driver</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {allVehicles?.map((vehicle: FleetVehicle, index: number) => (
              <tr key={vehicle._id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="p-3">
                  <input type="checkbox" className="rounded" />
                </td>
                <td className="p-3">
                  <Link href="#" className="text-blue-600 hover:underline">
                    {vehicle?.plateNumber}
                  </Link>
                </td>
                <td className="p-3">{vehicle?.location}</td>
                <td className="p-3">{vehicle?.make}</td>
                <td className="p-3">{vehicle?.model}</td>
                <td className="p-3">{vehicle?.currentDriver?.personalInfo?.name}</td>
                <td className="p-3">{vehicle?.type}</td>
                <td className="p-3">{vehicle?.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// function MetricCard({ title, value, unit = "", subtext, bgColor = "bg-gray-100", textColor = "text-gray-900" }: MetricCardProps) {
//   return (
//     <div className={`${bgColor} rounded-md p-4 relative`}>
//       <div className="flex justify-between items-start">
//         <h3 className={`text-sm font-medium ${textColor === "text-white" ? "text-gray-300" : "text-gray-500"}`}>
//           {title}
//         </h3>
//         <button className="text-gray-400 hover:text-gray-600">
//           <MoreHorizontal size={16} />
//         </button>
//       </div>
//       <div className={`mt-2 flex items-baseline ${textColor}`}>
//         <span className="text-2xl font-semibold">{value}</span>
//         {unit && <span className="ml-1">{unit}</span>}
//       </div>
//       {subtext && <div className="mt-1 text-xs text-gray-500">{subtext}</div>}
//     </div>
//   )
// }
