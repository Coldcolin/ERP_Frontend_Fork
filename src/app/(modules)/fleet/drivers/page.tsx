"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Plus, Filter, MoreVertical } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {useGetAllDriverQuery} from "@/lib/redux/api/driverApi"

// Define a Driver type based on the properties used
type Driver = {
  _id: string;
  photo?: string;
  personalInfo?: {
    name?: string;
    licenseNo?: string;
    licenseExpiry?: string;
    contact?: string;
  };
  assignedVehicle?: {
    plateNumber?: string;
    status?: string;
  };
};

export default function DriverManagement() {
    const router = useRouter();
    const {data: allDrivers, isLoading, isError}= useGetAllDriverQuery({})
    
    function formatToYYYYMMDD(dateString: string) {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.error("Invalid date:", dateString);
        return null;
      }

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');

      return `${year}-${month}-${day}`;
    }
    if (isLoading) {
      return <div>Loading...</div>;
    }
    if (isError) {
      return <div>Error: &quot;Error Loading Drivers&quot; </div>;
    }
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Driver Management - ({allDrivers?.length})</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input type="search" placeholder="Search" className="w-full md:w-[200px] pl-8" />
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Add new driver
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full">
            <thead className="bg-black text-white">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Photo</th>
                
                <th className="px-4 py-3 text-left font-medium">Driver&apos;s name</th>
                <th className="px-4 py-3 text-left font-medium">License No</th>
                <th className="px-4 py-3 text-left font-medium">License Expiry</th>
                <th className="px-4 py-3 text-left font-medium">Phone No</th>
                <th className="px-4 py-3 text-left font-medium">Assigned vehicle</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {allDrivers?.map((driver: Driver) => (
                <tr key={driver._id} className="bg-gray-50">
                  <td className="px-4 py-3">
                    <Avatar>
                      <AvatarImage src={driver.photo || "/placeholder.svg"} alt={driver?.personalInfo?.name} />
                      <AvatarFallback>{driver?.personalInfo?.name?.charAt(0) ?? "-"}</AvatarFallback>
                    </Avatar>
                  </td>
                  <td className="px-4 py-3 font-medium">{driver?.personalInfo?.name}</td>
                  <td className="px-4 py-3">{driver?.personalInfo?.licenseNo}</td>
                  <td className="px-4 py-3">{formatToYYYYMMDD(driver?.personalInfo?.licenseExpiry ?? "")}</td>
                  <td className="px-4 py-3">{driver?.personalInfo?.contact}</td>
                  <td className="px-4 py-3">
                    {driver?.assignedVehicle ? (
                      <Link href="#" className="text-blue-500 hover:underline">
                        {driver?.assignedVehicle?.plateNumber}
                      </Link>
                    ) : (
                      <span className="text-gray-500">{driver?.assignedVehicle?.status}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        driver?.assignedVehicle?.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {driver?.assignedVehicle?.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(`/fleet/drivers/${driver._id}`)}>View details</DropdownMenuItem>
                        <DropdownMenuItem>Edit driver</DropdownMenuItem>
                        <DropdownMenuItem>Delete driver</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
