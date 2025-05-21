import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Plus, Filter, MoreVertical } from "lucide-react"
import Link from "next/link"

export default function DriverManagement() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Driver Management - (11)</h1>
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
              {drivers.map((driver) => (
                <tr key={driver.id} className="bg-gray-50">
                  <td className="px-4 py-3">
                    <Avatar>
                      <AvatarImage src={driver.photo || "/placeholder.svg"} alt={driver.name} />
                      <AvatarFallback>{driver.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </td>
                  <td className="px-4 py-3 font-medium">{driver.name}</td>
                  <td className="px-4 py-3">{driver.licenseNo}</td>
                  <td className="px-4 py-3">{driver.licenseExpiry}</td>
                  <td className="px-4 py-3">{driver.phoneNo}</td>
                  <td className="px-4 py-3">
                    {driver.assignedVehicle ? (
                      <Link href="#" className="text-blue-500 hover:underline">
                        {driver.assignedVehicle}
                      </Link>
                    ) : (
                      <span className="text-gray-500">unassigned</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        driver.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {driver.status}
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
                        <DropdownMenuItem>View details</DropdownMenuItem>
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

const drivers = [
  {
    id: 1,
    photo: "/placeholder.svg?height=40&width=40",
    name: "Cassandra Pearl",
    licenseNo: "B1234XYZ",
    licenseExpiry: "Jan 4, 2025",
    phoneNo: "0901418...",
    assignedVehicle: "NWUP01",
    status: "active",
  },
  {
    id: 2,
    photo: "/placeholder.svg?height=40&width=40",
    name: "John Doe",
    licenseNo: "B1234XYZ",
    licenseExpiry: "Jan 4, 2025",
    phoneNo: "0901418...",
    assignedVehicle: "NWUP01",
    status: "active",
  },
  {
    id: 3,
    photo: "/placeholder.svg?height=40&width=40",
    name: "James Aspen",
    licenseNo: "B1234XYZ",
    licenseExpiry: "Jan 4, 2025",
    phoneNo: "0901418...",
    assignedVehicle: null,
    status: "inactive",
  },
  {
    id: 4,
    photo: "/placeholder.svg?height=40&width=40",
    name: "Emmanuel Abel",
    licenseNo: "B1234XYZ",
    licenseExpiry: "Jan 4, 2025",
    phoneNo: "0901418...",
    assignedVehicle: "NWUP01",
    status: "active",
  },
  {
    id: 5,
    photo: "/placeholder.svg?height=40&width=40",
    name: "Leo Chukwu",
    licenseNo: "B1234XYZ",
    licenseExpiry: "Jan 4, 2025",
    phoneNo: "0901418...",
    assignedVehicle: null,
    status: "inactive",
  },
  {
    id: 6,
    photo: "/placeholder.svg?height=40&width=40",
    name: "Alhaji Kamoru",
    licenseNo: "B1234XYZ",
    licenseExpiry: "Jan 4, 2025",
    phoneNo: "0901418...",
    assignedVehicle: "NWUP01",
    status: "inactive",
  },
  {
    id: 7,
    photo: "/placeholder.svg?height=40&width=40",
    name: "Wilberforce Manel",
    licenseNo: "B1234XYZ",
    licenseExpiry: "Jan 4, 2025",
    phoneNo: "0901418...",
    assignedVehicle: "NWUP01",
    status: "inactive",
  },
]
