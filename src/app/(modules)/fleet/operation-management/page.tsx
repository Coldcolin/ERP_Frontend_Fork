"use client"

import { useState } from "react"
import { Search, Filter, Plus, MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import TripScheduleModal from "@/components/app/addTrip/trip-shedule-modal"

export default function OperationsManagement() {
  const [searchTrip, setSearchTrip] = useState("")
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Mock data for trips
  const tripsData = [
    {
      shipmentId: "SHIP-1094",
      client: "FreshFoods Ltd",
      origin: "Lagos",
      destination: "Onitsha",
      vehicleId: "NWUF01",
      driver: "DRV-78220 Jo...",
      departure: "Mar 14",
      arrival: "Mar 15",
      status: "Completed",
    },
    {
      shipmentId: "SHIP-1094",
      client: "FreshFoods Ltd",
      origin: "Lagos",
      destination: "Onitsha",
      vehicleId: "NWUF01",
      driver: "DRV-78240 Le...",
      departure: "Mar 14",
      arrival: "Mar 15",
      status: "Ongoing",
    },
    {
      shipmentId: "SHIP-1094",
      client: "FreshFoods Ltd",
      origin: "Lagos",
      destination: "Onitsha",
      vehicleId: "NWUF01",
      driver: "DRV-78240 Al...",
      departure: "Mar 14",
      arrival: "Mar 15",
      status: "Completed",
    },
    {
      shipmentId: "SHIP-1094",
      client: "FreshFoods Ltd",
      origin: "Lagos",
      destination: "Onitsha",
      vehicleId: "NWUF01",
      driver: "DRV-78240 O...",
      departure: "Mar 14",
      arrival: "Mar 15",
      status: "Scheduled",
    },
    {
      shipmentId: "SHIP-1094",
      client: "FreshFoods Ltd",
      origin: "Lagos",
      destination: "Onitsha",
      vehicleId: "NWUF01",
      driver: "DRV-78240 K...",
      departure: "Mar 14",
      arrival: "Mar 15",
      status: "Scheduled",
    },
    {
      shipmentId: "SHIP-1094",
      client: "FreshFoods Ltd",
      origin: "Lagos",
      destination: "Onitsha",
      vehicleId: "NWUF01",
      driver: "DRV-78240 Al...",
      departure: "Mar 14",
      arrival: "Mar 15",
      status: "Completed",
    },
    {
      shipmentId: "SHIP-1094",
      client: "FreshFoods Ltd",
      origin: "Lagos",
      destination: "Onitsha",
      vehicleId: "NWUF01",
      driver: "DRV-78240 A...",
      departure: "Mar 14",
      arrival: "Mar 15",
      status: "Ongoing",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "ongoing":
        return "bg-orange-100 text-orange-800"
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const totalPages = 4
  const pageNumbers = [1, 2, 3, 4]

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Operations Management</h1>
          {/* <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button> */}
        </div>

        {/* Trip Management Section */}
        <Card className=" border-0 shadow-none">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium">Trip Management</CardTitle>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search Trip"
                    value={searchTrip}
                    onChange={(e) => setSearchTrip(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
                <Button onClick={() => setIsModalOpen(true)} className="bg-slate-800 hover:bg-slate-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add new trip
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-2 ">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-800">
                  <TableHead className="text-white font-medium">Shipment ID</TableHead>
                  <TableHead className="text-white font-medium">Client</TableHead>
                  <TableHead className="text-white font-medium">Origin → Destination</TableHead>
                  <TableHead className="text-white font-medium">Vehicle ID</TableHead>
                  <TableHead className="text-white font-medium">Driver</TableHead>
                  <TableHead className="text-white font-medium">Departure → Arrival</TableHead>
                  <TableHead className="text-white font-medium">Status</TableHead>
                  <TableHead className="text-white font-medium"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tripsData.map((trip, index) => (
                  <TableRow key={index} className="border-b">
                    <TableCell>
                      <button className="text-blue-600 hover:text-blue-800 font-medium">{trip.shipmentId}</button>
                    </TableCell>
                    <TableCell className="text-gray-900">{trip.client}</TableCell>
                    <TableCell className="text-gray-900">
                      {trip.origin} → {trip.destination}
                    </TableCell>
                    <TableCell>
                      <button className="text-blue-600 hover:text-blue-800 font-medium">{trip.vehicleId}</button>
                    </TableCell>
                    <TableCell className="text-gray-900">{trip.driver}</TableCell>
                    <TableCell className="text-gray-900">
                      {trip.departure} → {trip.arrival}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(trip.status)}>{trip.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit Trip</DropdownMenuItem>
                          <DropdownMenuItem>Update Status</DropdownMenuItem>
                          <DropdownMenuItem>Cancel Trip</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex items-center justify-center space-x-2 py-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="bg-black text-white hover:bg-gray-800"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {pageNumbers.map((pageNum) => (
                <Button
                  key={pageNum}
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(pageNum)}
                  className={currentPage === pageNum ? "bg-black text-white hover:bg-gray-800" : "hover:bg-gray-100"}
                >
                  {pageNum}
                </Button>
              ))}

              <span className="text-sm text-gray-500">...</span>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="bg-black text-white hover:bg-gray-800"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
        <TripScheduleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </div>
  )
}
