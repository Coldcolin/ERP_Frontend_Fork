"use client"

import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { useCreateMaintenanceMutation } from "@/lib/redux/api/maintenanceApi"
import { useGetAllFleetQuery } from "@/lib/redux/api/fleetApi"
import { toast } from "sonner"
import * as z from "zod"
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form } from "@/components/ui/form"

export default function MaintenanceSchedule() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [vehicleSelection, setVehicleSelection] = useState<"all" | "specific">("all")
  const [selectedVehicle, setSelectedVehicle] = useState("")

  // Schema matching backend requirements
  const maintenanceSchema = z.object({
    vehicleId: z.string().min(1, "Vehicle is required"),
    type: z.enum(["scheduled", "repair", "emergency"], {
      errorMap: () => ({ message: "Maintenance type must be scheduled, repair, or emergency" })
    }),
    description: z.string().min(10, "Description must be at least 10 characters long").max(500, "Description cannot exceed 500 characters"),
    scheduledDate: z.string().min(1, "Scheduled date is required"),
    mileage: z.number().min(0, "Mileage must be a positive number"),
    cost: z.number().min(0, "Cost must be a positive number"),
    parts: z.array(z.object({
      partId: z.string().min(1, "Part ID is required"),
      quantity: z.number().min(1, "Quantity must be at least 1").int("Quantity must be a whole number"),
      cost: z.number().min(0, "Part cost must be a positive number")
    })),
    nextMaintenanceDate: z.string().optional(),
    nextMaintenanceMileage: z.number().min(0, "Next maintenance mileage must be positive").optional(),
    status: z.string()
  })

  type MaintenanceFormValues = z.infer<typeof maintenanceSchema>

  const form = useForm<MaintenanceFormValues>({
    resolver: zodResolver(maintenanceSchema),
    defaultValues: {
      type: "scheduled",
      description: "",
      scheduledDate: "",
      mileage: 0,
      cost: 0,
      parts: [],
      status: "scheduled"
    },
    mode: "onChange"
  })

  const [createMaintenance] = useCreateMaintenanceMutation()
  const { data: allVehicles } = useGetAllFleetQuery({})

  const onSubmit: SubmitHandler<MaintenanceFormValues> = async (data) => {
    try {
      setIsSubmitting(true)
      console.log("Form submitted!", data)
      
      // Validate scheduled date is in the future
      const scheduledDate = new Date(data.scheduledDate)
      if (scheduledDate <= new Date()) {
        toast.error("Scheduled date must be in the future")
        return
      }

      // Prepare data for backend
      const maintenanceData = {
        ...data,
        scheduledDate: scheduledDate.toISOString(),
        nextMaintenanceDate: data.nextMaintenanceDate ? new Date(data.nextMaintenanceDate).toISOString() : undefined
      }

      await createMaintenance(maintenanceData).unwrap()
      toast.success("Maintenance scheduled successfully")
      router.push("/fleet/maintenace-repair")
    } catch (error) {
      console.error("Error scheduling maintenance:", error)
      toast.error("Failed to schedule maintenance")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Button variant="ghost" size="sm" className="p-1" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-semibold text-gray-900">Maintenance Schedule</h1>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Vehicle Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-medium">Vehicle Selection</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <RadioGroup 
                      value={vehicleSelection} 
                      onValueChange={(value: "all" | "specific") => setVehicleSelection(value)}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                          <RadioGroupItem value="all" id="all" />
                          <Label htmlFor="all" className="flex-1 cursor-pointer">
                            Apply to all vehicles
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                          <RadioGroupItem value="specific" id="specific" />
                          <Label htmlFor="specific" className="flex-1 cursor-pointer">
                            Select specific vehicles
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>

                    {vehicleSelection === 'specific' && (
                      <div className="space-y-2">
                        <Label htmlFor="vehicleId">Select Vehicle</Label>
                        <Select 
                          value={selectedVehicle}
                          onValueChange={(value) => {
                            setSelectedVehicle(value)
                            form.setValue('vehicleId', value)
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a vehicle" />
                          </SelectTrigger>
                          <SelectContent>
                            {allVehicles?.data?.map((vehicle: any) => (
                              <SelectItem key={vehicle._id} value={vehicle._id}>
                                {vehicle.plateNumber} - {vehicle.make} {vehicle.model}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {form.formState.errors.vehicleId && (
                          <p className="text-sm text-red-500">{form.formState.errors.vehicleId.message}</p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Maintenance Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-medium">Maintenance Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="type">Maintenance Type</Label>
                      <Select 
                        value={form.watch('type')} 
                        onValueChange={(value: 'scheduled' | 'repair' | 'emergency') => {
                          form.setValue('type', value)
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select maintenance type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                          <SelectItem value="repair">Repair</SelectItem>
                          <SelectItem value="emergency">Emergency</SelectItem>
                        </SelectContent>
                      </Select>
                      {form.formState.errors.type && (
                        <p className="text-sm text-red-500">{form.formState.errors.type.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <textarea
                        id="description"
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Describe the maintenance work to be done (minimum 10 characters)..."
                        {...form.register('description')}
                      />
                      {form.formState.errors.description && (
                        <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="scheduledDate">Scheduled Date</Label>
                      <Input 
                        id="scheduledDate"
                        type="date" 
                        {...form.register('scheduledDate')}
                        min={new Date().toISOString().split('T')[0]}
                      />
                      {form.formState.errors.scheduledDate && (
                        <p className="text-sm text-red-500">{form.formState.errors.scheduledDate.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mileage">Current Mileage</Label>
                      <Input 
                        id="mileage"
                        type="number" 
                        min="0"
                        placeholder="Enter current mileage"
                        {...form.register('mileage', { valueAsNumber: true })}
                      />
                      {form.formState.errors.mileage && (
                        <p className="text-sm text-red-500">{form.formState.errors.mileage.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cost">Estimated Cost</Label>
                      <Input 
                        id="cost"
                        type="number" 
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        {...form.register('cost', { valueAsNumber: true })}
                      />
                      {form.formState.errors.cost && (
                        <p className="text-sm text-red-500">{form.formState.errors.cost.message}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Next Maintenance Schedule */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-medium">Next Maintenance Schedule</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="nextMaintenanceDate">Next Maintenance Date (Optional)</Label>
                      <Input 
                        id="nextMaintenanceDate"
                        type="date" 
                        {...form.register('nextMaintenanceDate')}
                        min={form.watch('scheduledDate') || new Date().toISOString().split('T')[0]}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="nextMaintenanceMileage">Next Maintenance Mileage (Optional)</Label>
                      <Input 
                        id="nextMaintenanceMileage"
                        type="number" 
                        min="0"
                        placeholder="Enter next maintenance mileage"
                        {...form.register('nextMaintenanceMileage', { valueAsNumber: true })}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isSubmitting ? 'Scheduling...' : 'Schedule Maintenance'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
