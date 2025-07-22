"use client"

import { useState } from "react"
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ArrowLeft, Search, Filter, Plus, MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react"

const tripData = [
  {
    id: "TRIP-1094",
    client: "FreshFoods Ltd",
    origin: "Lagos",
    destination: "Onitsha",
    vehicleId: "NWUPDI",
    driver: "DRV-78220 Jo...",
    departure: "Mar 14",
    arrival: "Mar 15",
    status: "Completed",
  },
  {
    id: "TRIP-1094",
    client: "FreshFoods Ltd",
    origin: "Lagos",
    destination: "Onitsha",
    vehicleId: "NWUPDI",
    driver: "DRV-78240 Le...",
    departure: "Mar 14",
    arrival: "Mar 15",
    status: "Ongoing",
  },
  {
    id: "TRIP-1094",
    client: "FreshFoods Ltd",
    origin: "Lagos",
    destination: "Onitsha",
    vehicleId: "NWUPDI",
    driver: "DRV-78240 Al...",
    departure: "Mar 14",
    arrival: "Mar 15",
    status: "Completed",
  },
  {
    id: "TRIP-1094",
    client: "FreshFoods Ltd",
    origin: "Lagos",
    destination: "Onitsha",
    vehicleId: "NWUPDI",
    driver: "DRV-78240 D...",
    departure: "Mar 14",
    arrival: "Mar 15",
    status: "Scheduled",
  },
  {
    id: "TRIP-1094",
    client: "FreshFoods Ltd",
    origin: "Lagos",
    destination: "Onitsha",
    vehicleId: "NWUPDI",
    driver: "DRV-78240 K...",
    departure: "Mar 14",
    arrival: "Mar 15",
    status: "Scheduled",
  },
  {
    id: "TRIP-1094",
    client: "FreshFoods Ltd",
    origin: "Lagos",
    destination: "Onitsha",
    vehicleId: "NWUPDI",
    driver: "DRV-78240 All...",
    departure: "Mar 14",
    arrival: "Mar 15",
    status: "Completed",
  },
  {
    id: "TRIP-1094",
    client: "FreshFoods Ltd",
    origin: "Lagos",
    destination: "Onitsha",
    vehicleId: "NWUPDI",
    driver: "DRV-78240 A...",
    departure: "Mar 14",
    arrival: "Mar 15",
    status: "Ongoing",
  },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Completed":
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{status}</Badge>
    case "Ongoing":
      return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">{status}</Badge>
    case "Scheduled":
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">{status}</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

export default function OperationsManagement() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1)

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">Operations Management</h1>
        </div>

        {/* Trip Management Section */}
        <div className="bg-white rounded-lg shadow-sm">
          {/* Section Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Trip Management</h2>
              <div className="flex items-center gap-3">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input placeholder="Search Trip" className="pl-10 w-64" />
                </div>

                {/* Filters Button */}
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>

                {/* Add New Trip Button */}
                <Button className="gap-2 bg-gray-900 hover:bg-gray-900">
                  <Plus className="h-4 w-4" />
                  Add New Trip
                </Button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-900 hover:bg-gray-900">
                  <TableHead className="text-white font-medium">Trip ID</TableHead>
                  <TableHead className="text-white font-medium">Client</TableHead>
                  <TableHead className="text-white font-medium">Origin → Destination</TableHead>
                  <TableHead className="text-white font-medium">Vehicle ID</TableHead>
                  <TableHead className="text-white font-medium">Driver</TableHead>
                  <TableHead className="text-white font-medium">Departure → Arrival</TableHead>
                  <TableHead className="text-white font-medium">Status</TableHead>
                  <TableHead className="text-white font-medium w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tripData.map((trip, index) => (
                  <TableRow
                    key={index}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => router.push(`/fleet/operations/${trip.id}`)}
                    >
                    <TableCell>
                      <Button variant="link" className="p-0 h-auto text-blue-600 font-normal">
                        {trip.id}
                      </Button>
                    </TableCell>
                    <TableCell className="text-gray-900">{trip.client}</TableCell>
                    <TableCell className="text-gray-600">
                      {trip.origin} → {trip.destination}
                    </TableCell>
                    <TableCell>
                      <Button variant="link" className="p-0 h-auto text-blue-600 font-normal">
                        {trip.vehicleId}
                      </Button>
                    </TableCell>
                    <TableCell className="text-gray-600">{trip.driver}</TableCell>
                    <TableCell className="text-gray-600">
                      {trip.departure} → {trip.arrival}
                    </TableCell>
                    <TableCell>{getStatusBadge(trip.status)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit Trip</DropdownMenuItem>
                          <DropdownMenuItem>Cancel Trip</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2 p-6 border-t border-gray-200">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {[1, 2, 3, 4].map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={currentPage === 4}
              onClick={() => setCurrentPage(Math.min(4, currentPage + 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
