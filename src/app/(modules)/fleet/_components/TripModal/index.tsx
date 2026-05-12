"use client"

import { useMemo } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useCreateTripMutation } from "@/lib/redux/api/tripsAPI"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { ChevronLeft, X } from "lucide-react"
import { useDebounce } from "@/hooks/use-debounce"
import { Label } from "@/components/ui/label"
import { useGetAllDriverQuery } from "@/lib/redux/api/driverApi"
import { useGetAllFleetQuery } from "@/lib/redux/api/fleetApi"
import { useGetAllClientQuery } from "@/lib/redux/api/clientApi"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

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
  _id: string;
  plateNumber?: string;
  make?: string;
  model?: string;
  status?: string;
  maintenanceSchedule?: Maintenance[];
  [key: string]: any;
};

interface Client {
  _id: string
  companyName: string
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

interface TripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => Promise<void> | void;
}

export function TripModal({ isOpen, onClose, onSuccess }: TripModalProps) {
  const [createTrip, { isLoading: isCreating }] = useCreateTripMutation()
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null)
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  
  // Search states
  const [clientSearch, setClientSearch] = useState<string>("")
  const [driverSearch, setDriverSearch] = useState<string>("")
  const [vehicleSearch, setVehicleSearch] = useState<string>("")
  const debouncedClientSearch = useDebounce(clientSearch, 500)
  const debouncedDriverSearch = useDebounce(driverSearch, 500)
  const debouncedVehicleSearch = useDebounce(vehicleSearch, 500)

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

  const { data: driversData, isLoading: isLoadingDrivers } = useGetAllDriverQuery(
    {
      page: 1,
      limit: 10,
      query: debouncedDriverSearch
    },
    { skip: !isOpen }
  ) as { data: DriverResponse; error: unknown; isLoading: boolean }

  const { data: vehiclesData, isLoading: isLoadingVehicles } = useGetAllFleetQuery(
    {
      page: 1,
      limit: 10,
      query: debouncedVehicleSearch
    },
    { skip: !isOpen }
  ) as { data: VehicleResponse; error: unknown; isLoading: boolean }

  const { data: clientsData, isLoading: clientsLoading } = useGetAllClientQuery(
    {
      page: 1,
      limit: 10,
      query: debouncedClientSearch
    },
    { skip: !isOpen }
  ) as { data: ClientResponse; error: unknown; isLoading: boolean }

  // Form submission handler with proper error handling
  const handleSubmitTrip = async (data: TripFormValues): Promise<boolean> => {
    if (isCreating) {
      toast.error("Please wait, another trip is being created")
      return false
    }
    
    if (!selectedDriver || !selectedVehicle) {
      toast.error("Please select both a driver and a vehicle")
      return false
    }

    try {
      const tripData = {
        clientId: data.client,
        driverId: selectedDriver._id,
        vehicleId: selectedVehicle._id,
        startLocation: data.startLocation,
        endLocation: data.endLocation,
        startTime: new Date(data.startTime).toISOString(),
        endTime: new Date(data.endTime).toISOString(),
        distance: Number(data.distance),
        expectedRevenue: Number(data.cargo.expectedRevenue),
        handlingInstructions: data.cargo.handlingInstructions,
        numberOfPackages: Number(data.cargo.numberOfPackages),
        maintenanceCost: Number(data.cargo.maintanceCost),
        tollFees: Number(data.cargo.tollFees),
        fuelLiters: Number(data.cargo.fuelLiters),
        fuelCost: Number(data.cargo.fuelCost),
        shipmentId: data.shipmentId
      };

      const response = await createTrip(tripData).unwrap();
      
      toast.success(`Trip ${response.data.shipmentId} created successfully!`);
      
      // Reset form state
      setCurrentStep(1);
      form.reset(formDefaultValues);
      setSelectedDriver(null);
      setSelectedVehicle(null);
      
      if (onSuccess) {
        await onSuccess();
      }
      
      return true;
    } catch (error: any) {
      console.error("Error creating trip:", error);
      const errorMessage = error?.data?.message || error?.message || "An unknown error occurred";
      toast.error(`Failed to create trip: ${errorMessage}`);
      return false;
    }
  }

  // Memoize steps calculation to prevent recreation on every render
  const steps = [
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
    },
  ]

  const handleNext = async () => {
    if (currentStep < 3) {
      let fieldsToValidate: string[] = [];
      
      if (currentStep === 1) {
        fieldsToValidate = ['shipmentId', 'client', 'startLocation', 'endLocation', 'startTime', 'endTime', 'distance'];
      } else if (currentStep === 2) {
        fieldsToValidate = ['driver', 'vehicle'];
      } else if (currentStep === 3) {
        fieldsToValidate = [
          'cargo.numberOfPackages',
          'cargo.fuelLiters',
          'cargo.fuelCost',
          'cargo.maintanceCost',
          'cargo.tollFees',
          'cargo.expectedRevenue',
          'cargo.handlingInstructions'
        ];
        
        const result = await form.trigger(fieldsToValidate as any);
        if (!result) return;
        
        const formData = form.getValues();
        const success = await handleSubmitTrip(formData);
        if (success) {
          handleClose();
        }
        return;
      }

      if (fieldsToValidate.length > 0) {
        const result = await form.trigger(fieldsToValidate as any);
        if (!result) {
          return;
        }
      }
      
      setCurrentStep(currentStep + 1);
    }
  };

  const onSubmitNow = async (data: TripFormValues) => {
    await handleSubmitTrip(data);
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      handleClose();
    }
  }

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
}
