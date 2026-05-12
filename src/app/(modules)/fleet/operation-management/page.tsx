"use client"

import { useState, useEffect } from "react"
import { useGetAllTripQuery } from "@/lib/redux/api/tripsAPI"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Search, MoreHorizontal } from "lucide-react"
import { useDebounce } from "@/hooks/use-debounce"
import { useRouter } from "next/navigation"
import { TripModal } from "@/app/(modules)/fleet/_components/TripModal"
// import { Avatar, AvatarImage } from "@radix-ui/react-avatar"


interface Client {
  _id: string
  companyName: string
}

interface Trip {
  _id: string
  shipmentId: string
  client: Client
  startLocation: string
  endLocation: string
  vehicle: {
    plateNumber?: string;
    [key: string]: any;
  }
  driver: {
    personalInfo?: {
      name?: string;
    };
    [key: string]: any;
  }
  status: string
}


export default function OperationsManagement() {
  const router = useRouter();
  
  // Search states
  const [searchInput, setSearchInput] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const debouncedSearchTerm = useDebounce(searchInput, 500)

  useEffect(() => {
    setSearchQuery(debouncedSearchTerm)
    setCurrentPage(1) // Reset to first page on new search
  }, [debouncedSearchTerm, setSearchQuery, setCurrentPage])

  const { data: tripsData, error: tripsError, isLoading: tripsLoading } = useGetAllTripQuery(
    {
      page: currentPage,
      limit: 10,
      query: searchQuery.trim() || undefined
    },
    {
      refetchOnMountOrArgChange: true,
    }
  )

  // Calculate pagination values
  const totalPages = tripsData?.pagination?.totalPages || 1
  const startIndex = ((currentPage - 1) * 10) + 1
  const endIndex = Math.min(currentPage * 10, tripsData?.pagination?.total || 0)
  const totalItems = tripsData?.pagination?.total || 0

  // Pagination handlers
  const goToPage = (page: number) => {
    setCurrentPage(page)
  }

  const goToPrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  const goToNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }

  // Extract error message from the error object
  const errorMessage = (() => {
    if (!tripsError) return ''

    // Handle FetchBaseQueryError
    if (tripsError && typeof tripsError === 'object' && 'status' in tripsError) {
      const error = tripsError as { status: number; data?: unknown }
      if (error.status === 403) {
        return 'Access denied. You do not have permission to view this resource.'
      }
      
      if (error.data && typeof error.data === 'object' && error.data !== null && 'message' in error.data) {
        return String((error.data as { message: unknown }).message)
      }
      
      return 'An error occurred while fetching trips data'
    }

    // Handle SerializedError
    if (tripsError && typeof tripsError === 'object' && 'message' in tripsError) {
      return (tripsError as { message?: string }).message || 'An unknown error occurred'
    }

    return 'Failed to load trips data. Please try again later.'
  })()

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

  if (tripsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    )
  }

  if (tripsError) {
    return (
      <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        <p>{errorMessage}</p>
        {tripsError && 'status' in tripsError && tripsError.status === 403 && (
          <p className="mt-2 text-sm">You don&apos;t have permission to view this resource. Please contact your administrator.</p>
        )}
      </div>
    )
  }

  // Main component return
  return (
    <div className="min-h-screen p-3">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Operations Management</h1>
        </div>

        {/* Trip Management Section */}
        <Card className="border-0 shadow-none">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium">Trip Management</CardTitle>
              <div className="flex items-center space-x-3">
               
                <Button
                  onClick={() => setIsModalOpen(!isModalOpen)}
                  className="bg-slate-800 hover:bg-slate-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add new trip
                </Button>
              </div>
            </div>
          </CardHeader>
          <Card className="bg-white">
                  <CardContent className="p-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search by shipment ID, client, or status..."
                        className="pl-10 bg-gray-50 border-gray-200 w-full"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>
          <CardContent className="p-2 ">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-800">
                  <TableHead className="text-white font-medium">Shipment ID</TableHead>
                  <TableHead className="text-white font-medium">Client</TableHead>
                  <TableHead className="text-white font-medium">Origin → Destination</TableHead>
                  <TableHead className="text-white font-medium">Vehicle ID</TableHead>
                  <TableHead className="text-white font-medium">Driver</TableHead>
                  {/* <TableHead className="text-white font-medium">Departure → Arrival</TableHead> */}
                  <TableHead className="text-white font-medium">Status</TableHead>
                  <TableHead className="text-white font-medium"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tripsData?.data?.map((trip: Trip) => (
                  <TableRow key={trip._id} className="border-b">
                    <TableCell>
                      <button className="text-blue-600 hover:text-blue-800 font-medium">{trip?.shipmentId}</button>
                    </TableCell>
                    <TableCell className="text-gray-900">{trip?.client?.companyName}</TableCell>
                    <TableCell className="text-gray-900">
                      {trip?.startLocation} → {trip?.endLocation}
                    </TableCell>
                    <TableCell>
                      <button className="text-blue-600 hover:text-blue-800 font-medium">{trip?.vehicle?.plateNumber}</button>
                    </TableCell>
                    <TableCell className="text-gray-900">{trip?.driver?.personalInfo?.name}</TableCell>
                    {/* <TableCell className="text-gray-900">
                      {trip?.startLocation} → {trip?.endLocation}
                    </TableCell> */}
                    <TableCell>
                      <Badge className={getStatusColor(trip?.status)}>{trip?.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => router.push(`/fleet/operation-management/${trip?._id}`)}>View Details</DropdownMenuItem>
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
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-700">
                Showing {startIndex} to {endIndex} of {totalItems} entries
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
                  {(() => {
                    const buttons = [];
                    const maxVisiblePages = 5;
                    let startPage = 1;
                    let endPage = totalPages;

                    if (totalPages > maxVisiblePages) {
                      if (currentPage <= Math.ceil(maxVisiblePages / 2)) {
                        // Near the start
                        endPage = maxVisiblePages - 1;
                        buttons.push(
                          <span key="ellipsis-end" className="px-2">...</span>
                        );
                      } else if (currentPage >= totalPages - Math.floor(maxVisiblePages / 2)) {
                        // Near the end
                        startPage = totalPages - maxVisiblePages + 2;
                        buttons.push(
                          <span key="ellipsis-start" className="px-2">...</span>
                        );
                      } else {
                        // In the middle
                        startPage = currentPage - Math.floor((maxVisiblePages - 2) / 2);
                        endPage = currentPage + Math.ceil((maxVisiblePages - 2) / 2);
                        buttons.push(
                          <span key="ellipsis-start" className="px-2">...</span>
                        );
                      }
                    }

                    // Always show first page
                    if (startPage > 1) {
                      buttons.push(
                        <Button
                          key={1}
                          variant={currentPage === 1 ? "default" : "outline"}
                          size="sm"
                          onClick={() => goToPage(1)}
                          className={`w-8 h-8 p-0 ${
                            currentPage === 1 ? "bg-black text-white hover:bg-gray-800" : "hover:bg-gray-100"
                          }`}
                        >
                          1
                        </Button>
                      );
                    }

                    // Add ellipsis if needed
                    if (startPage > 2) {
                      buttons.push(
                        <span key="ellipsis-start" className="px-2">...</span>
                      );
                    }

                    // Add page numbers
                    for (let i = startPage; i <= endPage; i++) {
                      if (i > 1 && i < totalPages) {
                        buttons.push(
                          <Button
                            key={i}
                            variant={currentPage === i ? "default" : "outline"}
                            size="sm"
                            onClick={() => goToPage(i)}
                            className={`w-8 h-8 p-0 ${
                              currentPage === i ? "bg-black text-white hover:bg-gray-800" : "hover:bg-gray-100"
                            }`}
                          >
                            {i}
                          </Button>
                        );
                      }
                    }

                    // Add ellipsis if needed
                    if (endPage < totalPages - 1) {
                      buttons.push(
                        <span key="ellipsis-end" className="px-2">...</span>
                      );
                    }

                    // Always show last page if there are multiple pages
                    if (totalPages > 1) {
                      buttons.push(
                        <Button
                          key={totalPages}
                          variant={currentPage === totalPages ? "default" : "outline"}
                          size="sm"
                          onClick={() => goToPage(totalPages)}
                          className={`w-8 h-8 p-0 ${
                            currentPage === totalPages ? "bg-black text-white hover:bg-gray-800" : "hover:bg-gray-100"
                          }`}
                        >
                          {totalPages}
                        </Button>
                      );
                    }

                    return buttons;
                  })()}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToNext}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="px-3 bg-transparent"
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Empty state */}
        {tripsData?.data?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 border rounded-lg mt-4">
            <Search className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              {searchQuery ? 'No trips found' : 'No trips available'}
            </h3>
            <p className="text-gray-500 text-center max-w-md mb-4">
              {searchQuery
                ? 'No trips match your search criteria. Try adjusting your search or clear the search to see all trips.'
                : 'Get started by creating a new trip.'}
            </p>
            {searchQuery ? (
              <Button
                variant="outline"
                onClick={() => setSearchInput('')}
                className="mt-2"
              >
                Clear search
              </Button>
            ) : (
              <Button
                className="bg-slate-800 hover:bg-slate-700 text-white"
                onClick={() => setIsModalOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add new trip
              </Button>
            )}
          </div>
        )}
      </div>

      <TripModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={async () => {
          setIsModalOpen(false);
          // Refetch trips data to update the list
          try {
            // await refetch();
          } catch (error) {
            console.error('Error refreshing trips:', error);
          }
        }} 
      />
    </div>
  )
}
