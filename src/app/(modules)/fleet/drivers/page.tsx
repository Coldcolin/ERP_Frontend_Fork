"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Plus, MoreVertical, FileSearch } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useGetAllDriverQuery, useDeleteDriverMutation } from "@/lib/redux/api/driverApi"
import { useState, useEffect } from "react"
import { useDebounce } from "@/hooks/use-debounce"
import { Card, CardContent } from "@/components/ui/card"
import AddDriverModal from "../_components/AddDriverModal"
import { toast } from "sonner"

// Define a Driver type based on the properties used
type Driver = {
  _id: string;
  photo?: string;
  status: string;
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
    const [currentPage, setCurrentPage] = useState(1);
    const [searchInput, setSearchInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const pageSize = 10;
    const [isOpen, setIsOpen] = useState(false);
    const debouncedSearchTerm = useDebounce(searchInput, 500);
    const [deleteDriver] = useDeleteDriverMutation();
    
    // Update search query when debounced value changes
    useEffect(() => {
        setSearchQuery(debouncedSearchTerm);
        setCurrentPage(1); // Reset to first page on new search
    }, [debouncedSearchTerm]);

    const { data: allDrivers, isLoading, isError, error, refetch } = useGetAllDriverQuery({
        page: currentPage,
        limit: pageSize,
        query: searchQuery.trim() || undefined
    }, {
        refetchOnMountOrArgChange: true,
    });

    const totalPages = allDrivers?.pagination?.totalPages || 1;
    const startIndex = ((currentPage - 1) * pageSize) + 1;
    const endIndex = Math.min(currentPage * pageSize, allDrivers?.pagination?.total || 0);

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

 
  const handleDelete = (id: string) => {
    
    // console.log(id)
    const confirmDelete = () => {
      const deleteToast = toast.loading('Deleting driver...');
      deleteDriver(id)
        .unwrap()
        .then(() => {
          toast.success('Driver deleted successfully');
          refetch();
        })
        .catch((error) => {
          toast.error(error.data?.message || 'Failed to delete driver');
        })
        .finally(() => {
          toast.dismiss(deleteToast);
        });
    };

    const confirmationToast = toast(
      <div className="flex flex-col gap-2">
        <p>Are you sure you want to delete this driver?</p>
        <div className="flex gap-2 justify-end mt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              toast.dismiss(confirmationToast);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              toast.dismiss(confirmationToast);
              confirmDelete();
            }}
          >
            Delete
          </Button>
        </div>
      </div>,
      {
        duration: 10000, // 10 seconds
        // onDismiss: () => {
        //   // This will be called when the toast is dismissed by clicking the X or auto-dismiss
        //   toast.dismiss(deleteToast);
        // }
      }
    );
  }


    
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
    // Extract error message from the error object
    const errorMessage = (() => {
        if (!error) return '';
        
        // Handle FetchBaseQueryError
        if ('status' in error) {
            if (error.status === 403) {
                return 'Access denied. You do not have permission to view this resource.';
            }
            return typeof error.data === 'object' && error.data && 'message' in error.data
                ? String(error.data.message)
                : 'An error occurred while fetching drivers data';
        }
        
        // Handle SerializedError
        if ('message' in error) {
            return error.message || 'An unknown error occurred';
        }
        
        return 'Failed to load drivers data. Please try again later.';
    })();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            </div>
        );
    }
    
    if (isError) {
        return (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                <p>{errorMessage}</p>
                {error && ('status' in error) && error.status === 403 && (
                    <p className="mt-2 text-sm">You don&apos;t have permission to view this resource. Please contact your administrator.</p>
                )}
            </div>
        );
    }
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Driver Management - ({allDrivers?.pagination?.total})</h1>
          <div className="flex items-center gap-4">
            {/* <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input 
                type="search" 
                placeholder="Search by name, license, or contact..." 
                className="w-full md:w-[250px] pl-8"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div> */}
            {/* <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button> */}
            <Button size="sm" className="gap-2" onClick={() => setIsOpen(true)}>
              <Plus className="h-4 w-4" />
              Add new driver
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border">
           <Card className="bg-white col-span-2">
                    <CardContent className="p-6 space-y-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input 
                          placeholder="Search by name, email, or company..." 
                          className="pl-10 bg-gray-50 border-gray-200"
                          value={searchInput}
                          onChange={(e) => setSearchInput(e.target.value)}
                        />
                      </div>
                    </CardContent>
                  </Card>
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
              {allDrivers?.data?.map((driver: Driver) => (
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
                        driver?.status === "available" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {driver?.status}
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
                        {/* <DropdownMenuItem>Edit driver</DropdownMenuItem> */}
                        <DropdownMenuItem onClick={() => handleDelete(driver._id)}>Delete driver</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        

        {allDrivers?.data?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <FileSearch className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-600 mb-2">
              {searchQuery 
                ? `No drivers found matching "${searchQuery}"`
                : "You do not have any registered drivers yet"
              }
            </p>
            <p className="text-gray-500 mb-4">
              {searchQuery 
                ? "Try adjusting your search or clear the search to see all drivers"
                : "Click the button to start adding drivers"
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
              <Button className="bg-black text-white hover:bg-gray-800">
                <Plus className="mr-2 h-4 w-4" />
                Add Driver
              </Button>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-700">
              Showing {startIndex} to {endIndex} of {allDrivers?.pagination?.total || 0} entries
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
      )}
      <AddDriverModal open={isOpen} onOpenChange={setIsOpen} />
      </div>
    </div>
  )
}
