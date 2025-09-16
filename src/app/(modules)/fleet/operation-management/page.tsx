"use client"

import { useState, useEffect, useMemo } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useGetAllTripQuery, useCreateTripMutation } from "@/lib/redux/api/tripsAPI"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Search, MoreHorizontal, X, ChevronLeft } from "lucide-react"
import { useDebounce } from "@/hooks/use-debounce"
import { Label } from "@/components/ui/label"
import { useGetAllDriverQuery } from "@/lib/redux/api/driverApi"
import { useGetAllFleetQuery } from "@/lib/redux/api/fleetApi"
import { useGetAllClientQuery } from "@/lib/redux/api/clientApi"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
// import { Avatar, AvatarImage } from "@radix-ui/react-avatar"


type Driver = {
  _id: string;
  photo?: string;
  status?: string;
  personalInfo?: {
    name?: string;
    licenseNumber?: string;
    licenseExpiry?: string;
    contact?: string;
  };
  assignedVehicle?: {
    plateNumber?: string;
    status?: string;
  };
};

type Maintenance = {
  nextMaintenanceDate?: string;
  scheduledDate?: string;
};
type Vehicle = {
  maintenanceSchedule?: Maintenance[];
  [key: string]: any;
};


// interface PersonalInfo {
//   name: string
//   licenseNo: string
//   licenseExpiry: string
//   contact: string
// }

interface  Client {
  _id: string
  companyName: string
}

interface Trip {
  _id: string
  shipmentId: string
  client: Client
  startLocation: string
  endLocation: string
  vehicle: Vehicle
  driver: Driver
  status: string
}

// interface TripResponse {
//   data: Trip[]
//   pagination: {
//     total: number
//     totalPages: number
//     currentPage: number
//     hasNextPage: boolean
//     hasPrevPage: boolean
//   }
// }

interface VehicleResponse {
  data: Vehicle[]
  pagination: {
    total: number
    totalPages: number
    currentPage: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

interface DriverResponse {
  data: Driver[]
  pagination: {
    total: number
    totalPages: number
    currentPage: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}


export default function OperationsManagement() {
  // Toast implementation
  const router = useRouter();
  const [createTrip, { isLoading: isCreating }] = useCreateTripMutation()
  // Search states
  const [searchInput, setSearchInput] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [clientSearch, setClientSearch] = useState<string>("")
  const [driverSearch, setDriverSearch] = useState<string>("")
  const [vehicleSearch, setVehicleSearch] = useState<string>("")
  const debouncedClientSearch = useDebounce(clientSearch, 500)
  const debouncedDriverSearch = useDebounce(driverSearch, 500)
  const debouncedVehicleSearch = useDebounce(vehicleSearch, 500)
  const [currentPage, setCurrentPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [currentStep, setCurrentStep] = useState(1)
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null)
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  // const formRef = useRef<HTMLFormElement>(null)
  
  // Form schema validation
    const tripFormSchema = z.object({
    shipmentId: z.string().min(1, "Shipment ID is required"),
    client: z.string().min(1, "Client is required"),
    startLocation: z.string().min(1, "Origin is required"),
    endLocation: z.string().min(1, "Destination is required"),
    startTime: z.string().min(1, "Departure date is required"),
    endTime: z.string().min(1, "Arrival date is required"),
    distance: z.number().min(0, "Distance must be a positive number"),
    driver: z.string().min(1, "Driver selection is required"),
    vehicle: z.string().min(1, "Vehicle selection is required"),
    cargo: z.object({
      description: z.string().max(200, "Description is too long").optional(),
      numberOfPackages: z.number().min(0, "Number of packages must be positive"),
      fuelLiters: z.number().min(0, "Fuel liters must be positive"),
      fuelCost: z.number().min(0, "Fuel cost must be positive"),
      maintanceCost: z.number().min(0, "Maintenance cost must be positive"),
      tollFees: z.number().min(0, "Toll fees must be positive"),
      expectedRevenue: z.number().min(0, "Revenue must be positive"),
      handlingInstructions: z.string().max(500, "Handling instructions are too long").optional()
    })
  })

  type TripFormValues = z.infer<typeof tripFormSchema>

  // Memoize form default values to prevent unnecessary re-renders
  const formDefaultValues = useMemo(() => ({
    shipmentId: "",
    client: "",
    startLocation: "",
    endLocation: "",
    startTime: "",
    endTime: "",
    distance: 0,
    driver: "",
    vehicle: "",
    cargo: {
      type: "",
      weight: 0,
      description: "",
      numberOfPackages: 0,
      fuelLiters: 0,
      fuelCost: 0,
      maintanceCost: 0,
      tollFees: 0,
      expectedRevenue: 0,
      handlingInstructions: ""
    }
  }), []);

  const form = useForm<TripFormValues>({
    resolver: zodResolver(tripFormSchema),
    defaultValues: formDefaultValues
  });

  // Form submission handler with proper error handling
  const handleSubmitTrip =async(data: TripFormValues, onSuccessCallback?: () => Promise<void> | void): Promise<boolean> => {
    console.log("handling submit trip")
    if (isCreating) {
      toast.error("Please wait, another trip is being created")
      return false
    }
    
    if (!selectedDriver || !selectedVehicle) {
      toast.error("Please select both a driver and a vehicle")
      return false
    }

    try {
      // setIsCreating(true);
      
      const tripData = {
        clientId: data.client,
        driverId: selectedDriver._id,
        vehicleId: selectedVehicle._id,
        startLocation: data.startLocation,
        endLocation: data.endLocation,
        startTime: new Date(data.startTime).toISOString(),
        endTime: new Date(data.endTime).toISOString(),
        distance: Number(data.distance),
        // status: "scheduled",
        expectedRevenue: Number(data.cargo.expectedRevenue),
        handlingInstructions: data.cargo.handlingInstructions,
        numberOfPackages: Number(data.cargo.numberOfPackages),
        maintenanceCost: Number(data.cargo.maintanceCost),
        tollFees: Number(data.cargo.tollFees),
        fuelLiters: Number(data.cargo.fuelLiters),
        fuelCost: Number(data.cargo.fuelCost),
        // cargo: {
        //   type: data.cargo.type,
        //   weight: Number(data.cargo.weight),
        //   description: data.cargo.description,  
        // },
        // Add any additional required fields here
        shipmentId: data.shipmentId // Use the generated shipment ID from form
      };

      // Call the API to create trip
      const response = await createTrip(tripData).unwrap();
      
      // Show success message
      toast.success(`Trip ${response.data.shipmentId} created successfully!`);
      
      // Reset form state
      setCurrentStep(1);
      form.reset({
        shipmentId: "",
        client: "",
        startLocation: "",
        endLocation: "",
        startTime: "",
        endTime: "",
        distance: 0,
        driver: "",
        vehicle: "",
        cargo: {
          numberOfPackages: 0,
          fuelLiters: 0,
          fuelCost: 0,
          maintanceCost: 0,
          tollFees: 0,
          expectedRevenue: 0,
          handlingInstructions: ""
        }
      });
      setSelectedDriver(null);
      setSelectedVehicle(null);
      // setSearchDriver("");
      // setSearchVehicle("");
      
      // Call the success callback if provided
      if (onSuccessCallback) {
        await onSuccessCallback();
      }
      
      return true;
    } catch (error: any) {
      console.error("Error creating trip:", error);
      const errorMessage = error?.data?.message || error?.message || "An unknown error occurred";
      toast.error(`Failed to create trip: ${errorMessage}`);
      return false;
    } 
  }

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

  const { data: driversData, isLoading: isLoadingDrivers } = useGetAllDriverQuery(
    {
      page: 1,
      limit: 10,
      query: debouncedDriverSearch
    },
    { skip: !isModalOpen }
  ) as { data: DriverResponse; error: unknown; isLoading: boolean }

  const { data: vehiclesData, isLoading: isLoadingVehicles } = useGetAllFleetQuery(
    {
      page: 1,
      limit: 10,
      query: debouncedVehicleSearch
    },
    { skip: !isModalOpen }
  ) as { data: VehicleResponse; error: unknown; isLoading: boolean }

  interface ClientResponse {
    data: Client[];
    pagination: {
      total: number;
      totalPages: number;
      currentPage: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  }

  const { data: clientsData, isLoading: clientsLoading } = useGetAllClientQuery(
    {
      page: 1,
      limit: 10,
      query: debouncedClientSearch
    },
    { skip: !isModalOpen }
  ) as { data: ClientResponse; error: unknown; isLoading: boolean }

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

  // interface TripScheduleModalProps {
  //   open: boolean
  //   onOpenChange: (open: boolean) => void
  // }

  // Memoize steps calculation to prevent recreation on every render
  const steps =[
    { 
      number: 1, 
      title: "Trip Information", 
      active: currentStep >= 1,
      disabled: false 
    },
    { 
      number: 2, 
      title: "Vehicle & Driver Assignment", 
      active: currentStep >= 2,
      disabled: currentStep < 1 
    },
    { 
      number: 3, 
      title: "Load Tracking", 
      active: currentStep >= 3,
      disabled: currentStep < 2 
    },]
 

  const handleNext = async () => {
    if (currentStep < 3) {
      let fieldsToValidate: string[] = [];
      
      // Determine which fields to validate based on current step
      if (currentStep === 1) {
        fieldsToValidate = ['shipmentId', 'client', 'startLocation', 'endLocation', 'startTime', 'endTime', 'distance'];
      } else if (currentStep === 2) {
        fieldsToValidate = ['driver', 'vehicle'];
      } else if (currentStep === 3) {
        // On the final step, validate all cargo fields and submit
        fieldsToValidate = [
          // 'cargo.type',
          // 'cargo.weight', 
          // 'cargo.description',
          'cargo.numberOfPackages',
          'cargo.fuelLiters',
          'cargo.fuelCost',
          'cargo.maintanceCost',
          'cargo.tollFees',
          'cargo.expectedRevenue',
          'cargo.handlingInstructions'
        ];
        
        // Validate all fields first
        const result = await form.trigger(fieldsToValidate as any);
        if (!result) return; // Don't proceed if validation fails
        
        // If validation passes, submit the form data directly
        const formData = form.getValues();
        const success = await handleSubmitTrip(formData);
        if (success) {
          setIsModalOpen(false);
        }
        return;
      }

      // Validate fields for current step
      if (fieldsToValidate.length > 0) {
        const result = await form.trigger(fieldsToValidate as any);
        if (!result) {
          return; // Don't proceed if validation fails
        }
      }
      
      // Move to next step
      setCurrentStep(currentStep + 1);
    }
  };

  // Form submission handler
  // const onSubmit = async (data: TripFormValues) => {
  //   // Only handle form submission for steps 1 and 2
    
  //   if (currentStep < 3) {
  //     console.log("onSubmit", data)
  //     await handleNext();
  //   }else{
  //     console.log("onSubmit", data)
  //     await handleSubmitTrip(data);
  //   }
  // };
  const onSubmitNow = async (data: TripFormValues) => {
    console.log("onSubmitNow", data)
    await handleSubmitTrip(data);
  }

  const handleBack =() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      setIsModalOpen(false)
    }
  }

  // const getStatusBadge = (status: Driver["status"]) => {
  //   switch (status) {
  //     case "active":
  //       return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">active</Badge>
  //     case "inactive":
  //       return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Inactive</Badge>
  //     case "assigned":
  //       return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">assigned</Badge>
  //     default:
  //       return null
  //   }
  // }

  // const getActionButton = (status: Driver["status"]) => {
  //   if (status === "assigned") {
  //     return (
  //       <Button size="sm" className="bg-gray-600 hover:bg-gray-700">
  //         assigned
  //       </Button>
  //     )
  //   }
  //   return (
  //     <Button size="sm" className="bg-gray-800 hover:bg-gray-900">
  //       assign
  //     </Button>
  //   )
  // }

  // const getVehicleStatusBadge = (status: Vehicle["status"]) => {
  //   switch (status) {
  //     case "available":
  //       return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">available</Badge>
  //     case "active":
  //       return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">active</Badge>
  //     case "maintenance":
  //       return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">maintenance</Badge>
  //     default:
  //       return null
  //   }
  // }

  // const getVehicleActionButton = (status: Vehicle["status"]) => {
  //   if (status === "active") {
  //     return (
  //       <Button size="sm" className="bg-gray-600 hover:bg-gray-700" disabled>
  //         assigned
  //       </Button>
  //     )
  //   }
  //   if (status === "maintenance") {
  //     return (
  //       <Button size="sm" variant="outline" disabled>
  //         unavailable
  //       </Button>
  //     )
  //   }
  //   return (
  //     <Button size="sm" className="bg-gray-800 hover:bg-gray-900">
  //       assign
  //     </Button>
  //   )
  // }

  // function formatToYYYYMMDD(dateString: string) {
  //   const date = new Date(dateString);
  //   if (isNaN(date.getTime())) {
  //     console.error("Invalid date:", dateString);
  //     return null;
  //   }

  //   const year = date.getFullYear();
  //   const month = String(date.getMonth() + 1).padStart(2, '0');
  //   const day = String(date.getDate()).padStart(2, '0');

  //   return `${year}-${month}-${day}`;
  // }


  

  // Trip Modal Component - Memoized to prevent unnecessary re-renders
  const TripModal = ({
    isOpen,
    onClose,
    // onSuccess,
  }: {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => Promise<void> | void;
  }) => {
    
    // Handle form submission
    // const handleFormSubmit = async (formData: TripFormValues) => {
    //   try {
    //     const success = await handleSubmitTrip(formData, onSuccess);
    //     if (success) {
    //       handleClose();
    //     }
    //   } catch (error) {
    //     console.error("Form submission error:", error);
    //   }
    // };
    
    // Handle modal close
    const handleClose = () => {
      setCurrentStep(1);
      form.reset(formDefaultValues);
      setSelectedDriver(null);
      setSelectedVehicle(null);
      onClose();
    };

    
    return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        handleClose();
      }
    }}>
      <DialogContent
        className="w-[95vw] min-w-[95vw] max-w-[95vw] max-h-[90vh] overflow-y-auto overflow-x-hidden p-8"
        style={{ width: "95vw", minWidth: "95vw", maxWidth: "95vw" }}
      >
        <form onSubmit={form.handleSubmit(onSubmitNow)}>
        <DialogHeader>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              back
            </Button>
            <DialogTitle className="text-2xl font-bold">Trip Schedule</DialogTitle>
          </div>
          <DialogDescription>
            Create a new trip by filling out the required information in each step.
          </DialogDescription>
        </DialogHeader>

        {/* Step Indicator */}
        <div className="flex items-center gap-4 mb-8">
          {steps.map((step: any, index: any) => (
            <div key={step.number} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step.active && !step.disabled
                    ? "bg-teal-600 text-white"
                    : step.disabled
                      ? "bg-gray-300 text-gray-500"
                      : "bg-gray-200 text-gray-600"
                }`}
              >
                {step.number}
              </div>
              <span
                className={`text-sm font-medium ${
                  step.active && !step.disabled ? "text-teal-600" : step.disabled ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {step.title}
              </span>
              {index < steps.length - 1 && <div className="w-8 h-px bg-gray-200 ml-2" />}
            </div>
          ))}
        </div>

        {/* Step Content */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="shipmentId">
                  Shipment ID <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input 
                    id="shipmentId" 
                    placeholder="Click to generate..." 
                    className="bg-gray-50 cursor-pointer" 
                    readOnly 
                    value={form.watch('shipmentId')}
                    onClick={() => {
                      const now = new Date();
                      const year = now.getFullYear();
                      const month = String(now.getMonth() + 1).padStart(2, '0');
                      const day = String(now.getDate()).padStart(2, '0');
                      const hours = String(now.getHours()).padStart(2, '0');
                      const minutes = String(now.getMinutes()).padStart(2, '0');
                      const seconds = String(now.getSeconds()).padStart(2, '0');
                      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
                      
                      const shipmentId = `SHIP-${year}${month}${day}-${hours}${minutes}${seconds}-${random}`;
                      form.setValue('shipmentId', shipmentId);
                    }}
                  />
                  {/* <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-red-500">Click to generate</span> */}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="client">
                  Client <span className="text-red-500">*</span>
                </Label>
                <Select
                  onValueChange={(value) => form.setValue('client', value)}
                  value={form.watch('client')}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Search for a client..." />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="px-3 py-2">
                      <Input
                        placeholder="Search clients..."
                        value={clientSearch}
                        onChange={(e) => setClientSearch(e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {clientsLoading ? (
                        <div className="flex items-center justify-center p-4">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
                        </div>
                      ) : clientsData?.data?.length ? (
                        clientsData.data.map((client) => (
                          <SelectItem key={client._id} value={client._id}>
                            {client.companyName}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="px-3 py-2 text-sm text-gray-500">
                          {clientSearch ? 'No clients found' : 'Start typing to search clients'}
                        </div>
                      )}
                    </div>
                  </SelectContent>
                </Select>
                {form.formState.errors.client && (
                  <p className="text-sm font-medium text-red-500">
                    {form.formState.errors.client.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="origin">
                  Origin <span className="text-red-500">*</span>
                </Label>
                <Input id="origin" placeholder="e.g. Lagos" {...form.register('startLocation')} />
                {form.formState.errors.startLocation && (
                  <p className="text-sm font-medium text-red-500">
                    {form.formState.errors.startLocation.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="destination">
                  Destination <span className="text-red-500">*</span>
                </Label>
                <Input id="destination" placeholder="e.g. Onitsha" {...form.register('endLocation')} />
                {form.formState.errors.endLocation && (
                  <p className="text-sm font-medium text-red-500">
                    {form.formState.errors.endLocation.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="startTime">
                  Start Time <span className="text-red-500">*</span>
                </Label>
                <Input id="startTime" type="datetime-local" {...form.register('startTime')} />
                {form.formState.errors.startTime && (
                  <p className="text-sm font-medium text-red-500">
                    {form.formState.errors.startTime.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">
                  End Time <span className="text-red-500">*</span>
                </Label>
                <Input id="endTime" type="datetime-local" {...form.register('endTime')} />
                {form.formState.errors.endTime && (
                  <p className="text-sm font-medium text-red-500">
                    {form.formState.errors.endTime.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="distance">
                Distance (km) <span className="text-red-500">*</span>
              </Label>
              <Input 
                id="distance" 
                type="number" 
                placeholder="e.g. 150" 
                {...form.register('distance', { valueAsNumber: true })} 
              />
              {form.formState.errors.distance && (
                <p className="text-sm font-medium text-red-500">
                  {form.formState.errors.distance.message}
                </p>
              )}
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-8">
            {/* Driver Assignment Section */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="driver">
                  Select Driver <span className="text-red-500">*</span>
                </Label>
                <Select
                  onValueChange={(value) => {
                    const driver = driversData?.data?.find(d => d._id === value);
                    if (driver) {
                      setSelectedDriver(driver);
                      form.setValue('driver', driver._id);
                      toast.success(`Driver ${driver.personalInfo?.name} selected`);
                    }
                  }}
                  value={selectedDriver?._id || ""}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Search for a driver..." />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="px-3 py-2">
                      <Input
                        placeholder="Search drivers..."
                        value={driverSearch}
                        onChange={(e) => setDriverSearch(e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {isLoadingDrivers ? (
                        <div className="flex items-center justify-center p-4">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
                        </div>
                      ) : driversData?.data?.length ? (
                        driversData.data.map((driver) => (
                          <SelectItem 
                            key={driver._id} 
                            value={driver._id}
                            className="flex flex-col items-start"
                          >
                            <div className="font-medium">{driver.personalInfo?.name}</div>
                            <div className="text-xs text-gray-500">
                              {driver.personalInfo?.licenseNumber} • {driver.personalInfo?.contact} • {driver.status}
                            </div>
                          </SelectItem>
                        ))
                      ) : (
                        <div className="px-3 py-2 text-sm text-gray-500">
                          {driverSearch ? 'No drivers found' : 'Start typing to search drivers'}
                        </div>
                      )}
                    </div>
                  </SelectContent>
                </Select>
                {!selectedDriver && form.formState.errors.driver && (
                  <p className="text-sm font-medium text-red-500">
                    {form.formState.errors.driver?.message}
                  </p>
                )}
              </div>

              {selectedDriver && (
                <div className="p-4 border rounded-lg bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{selectedDriver.personalInfo?.name}</h4>
                      <div className="text-sm text-gray-600">
                        <p>License: {selectedDriver.personalInfo?.licenseNumber}</p>
                        <p>Contact: {selectedDriver.personalInfo?.contact}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedDriver(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Vehicle Assignment Section */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="vehicle">
                  Select Vehicle <span className="text-red-500">*</span>
                </Label>
                <Select
                  onValueChange={(value) => {
                    const vehicle = vehiclesData?.data?.find(v => v._id === value);
                    if (vehicle) {
                      setSelectedVehicle(vehicle);
                      form.setValue('vehicle', vehicle._id);
                      toast.success(`Vehicle ${vehicle.plateNumber} selected`);
                    }
                  }}
                  value={selectedVehicle?._id || ""}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Search for a vehicle..." />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="px-3 py-2">
                      <Input
                        placeholder="Search vehicles..."
                        value={vehicleSearch}
                        onChange={(e) => setVehicleSearch(e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {isLoadingVehicles ? (
                        <div className="flex items-center justify-center p-4">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
                        </div>
                      ) : vehiclesData?.data?.length ? (
                        vehiclesData.data.map((vehicle) => (
                          <SelectItem 
                            key={vehicle._id} 
                            value={vehicle._id}
                            className="flex flex-col items-start"
                          >
                            <div className="font-medium">{vehicle.plateNumber}</div>
                            <div className="text-xs text-gray-500">
                              {vehicle.make} {vehicle.model} • {vehicle.status}
                            </div>
                          </SelectItem>
                        ))
                      ) : (
                        <div className="px-3 py-2 text-sm text-gray-500">
                          {vehicleSearch ? 'No vehicles found' : 'Start typing to search vehicles'}
                        </div>
                      )}
                    </div>
                  </SelectContent>
                </Select>
                {!selectedVehicle && form.formState.errors.vehicle && (
                  <p className="text-sm font-medium text-red-500">
                    {form.formState.errors.vehicle.message}
                  </p>
                )}
              </div>

              {selectedVehicle && (
                <div className="p-4 border rounded-lg bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{selectedVehicle.plateNumber}</h4>
                      <div className="text-sm text-gray-600">
                        <p>{selectedVehicle.make} {selectedVehicle.model}</p>
                        <p>Status: {selectedVehicle.status}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedVehicle(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            

            

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fuel">
                  Fuel / Ltr <span className="text-red-500">*</span>
                </Label>
                <Input 
                  id="fuel" 
                  type="number"
                  placeholder="e.g. 180" 
                  {...form.register('cargo.fuelLiters', { valueAsNumber: true })}
                />
                {form.formState.errors.cargo?.fuelLiters && (
                  <p className="text-sm font-medium text-red-500">
                    {form.formState.errors.cargo.fuelLiters.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="fuelCost">
                  Fuel Cost <span className="text-red-500">*</span>
                </Label>
                <Input 
                  id="fuelCost" 
                  type="number"
                  placeholder="e.g. 140000" 
                  {...form.register('cargo.fuelCost', { valueAsNumber: true })}
                />
                {form.formState.errors.cargo?.fuelCost && (
                  <p className="text-sm font-medium text-red-500">
                    {form.formState.errors.cargo.fuelCost.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="maintenanceFee">
                  Maintenance Fee <span className="text-red-500">*</span>
                </Label>
                <Input 
                  id="maintenanceFee" 
                  type="number"
                  placeholder="e.g. 20000" 
                  {...form.register('cargo.maintanceCost', { valueAsNumber: true })}
                />
                {form.formState.errors.cargo?.maintanceCost && (
                  <p className="text-sm font-medium text-red-500">
                    {form.formState.errors.cargo.maintanceCost.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="tollFee">
                  Toll Fee <span className="text-red-500">*</span>
                </Label>
                <Input 
                  id="tollFee" 
                  type="number"
                  placeholder="e.g. 14000" 
                  {...form.register('cargo.tollFees', { valueAsNumber: true })}
                />
                {form.formState.errors.cargo?.tollFees && (
                  <p className="text-sm font-medium text-red-500">
                    {form.formState.errors.cargo.tollFees.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expectedRevenue">Expected Revenue</Label>
              <Input 
                id="expectedRevenue" 
                type="number"
                placeholder="e.g. 140000" 
                {...form.register('cargo.expectedRevenue', { valueAsNumber: true })}
              />
              {form.formState.errors.cargo?.expectedRevenue && (
                <p className="text-sm font-medium text-red-500">
                  {form.formState.errors.cargo.expectedRevenue.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
                <Label htmlFor="handlingInstructions">
                  Handling Instructions <span className="text-red-500">*</span>
                </Label>
                <Input id="handlingInstructions" placeholder="e.g. Keep upright, no stacking" {...form.register('cargo.handlingInstructions')}/>
                {form.formState.errors.cargo?.handlingInstructions && (
                  <p className="text-sm font-medium text-red-500">
                    {form.formState.errors.cargo.handlingInstructions.message}
                  </p>
                )}
              </div>
            </div>
          </div>
          
        )}
        
        <div className="flex justify-between pt-6">
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    disabled={currentStep === 1}
                  >
                    Back
                  </Button>
                  {currentStep < 3 ? (
                    <Button 
                      type="button"
                      onClick={handleNext} 
                      className="bg-gray-800 hover:bg-gray-900 px-8"
                      disabled={currentStep >= 3}
                    >
                      Next
                    </Button>
                  ) : (
                    <Button 
                      type="submit" 
                      className="bg-green-600 hover:bg-green-700 px-8"
                      disabled={isCreating}
                    >
                      {isCreating ? 'Creating...' : 'Create Trip'}
                    </Button>
                  )}
                </div>
        </form>
      </DialogContent>
    </Dialog>
  );
  };

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
