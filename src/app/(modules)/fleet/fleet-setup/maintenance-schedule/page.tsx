"use client"

import { useState } from "react"
import { ArrowLeft, Plus, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Textarea } from "@/components/ui/textarea"
import { useCreateMaintenanceMutation, useGetAllFleetQuery  } from "@/lib/redux/api/fleetApi"


const maintenanceSchema = z.object({
  scheduleOption: z.enum(["all", "specific"]),
  vehicleId: z.string().optional(),
  type: z.string().min(1, "Maintenance type is required"),
  description: z.string().min(1, "Description is required"),
  scheduledDate: z.string().min(1, "Scheduled date is required"),
  mileage: z.number().min(0, "Mileage must be positive"),
  estimatedCost: z.number().min(0, "Cost must be positive"),
  nextMaintenanceDate: z.string().optional(),
  nextMaintenanceMileage: z.number().optional(),
  cost: z.number().min(0, "Cost must be positive"),
})

type MaintenanceFormValues = z.infer<typeof maintenanceSchema>

export default function MaintenanceSchedule() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const [createMaintenance] = useCreateMaintenanceMutation()
  const { data: vehiclesData, isLoading: isVehiclesLoading, error: vehiclesError } = useGetAllFleetQuery({});

  

  const form = useForm<MaintenanceFormValues>({
    resolver: zodResolver(maintenanceSchema),
    defaultValues: {
      scheduleOption: "specific",
      vehicleId: "",
      type: "",
      description: "",
      scheduledDate: "",
      mileage: 0,
      estimatedCost: 0,
      nextMaintenanceDate: "",
      nextMaintenanceMileage: 0,
      cost: 0,
    },
  })

  const vehicles = vehiclesData?.map((vehicle:any) => ({
    id: vehicle._id, // or vehicle.id depending on your API response
    name: `${vehicle.make} ${vehicle.model} - ${vehicle.plateNumber}`
  })) || []


  const maintenanceTypes = [
    "scheduled",
    "repair",
    // "inspection",
    "emergency",
    // "preventive",
    // "predictive",
    // "corrective"
  ]

  const onSubmit = async (data: MaintenanceFormValues) => {
    try {
      setIsLoading(true)
      const apiData = {
        vehicleId: data.scheduleOption === "specific" ? data.vehicleId : "all",
        type: data.type,
        description: data.description,
        scheduledDate: new Date(data.scheduledDate).toISOString(),
        mileage: data.mileage,
        estimatedCost: data.estimatedCost,
        ...(data.nextMaintenanceDate && { 
          nextMaintenanceDate: new Date(data.nextMaintenanceDate).toISOString() 
        }),
        ...(data.nextMaintenanceMileage && { 
          nextMaintenanceMileage: data.nextMaintenanceMileage 
        }),
        ...(data.cost && { cost: data.cost })
      }

      await createMaintenance(apiData).unwrap()
      toast.success("Maintenance schedule created successfully!")
      form.reset()
      router.push("/fleet/fleet-setup")
    } catch (error: any) {
      console.error("Error creating schedule:", error)
      toast.error(error.data?.message || "Failed to create maintenance schedule")
    } finally {
      setIsLoading(false)
    }
  }

  // Render loading state if vehicles are loading
  if (isVehiclesLoading) {
    return <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">Loading vehicles...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-semibold">Define Maintenance Schedule</h1>
          </div>
        
          <Link href="/fleet/fleet-setup/assign-vehicle" passHref>
          <Button className="bg-zinc-900 hover:bg-zinc-800">
            <Plus className="mr-2 h-4 w-4" /> Assign Vehicle
          </Button>
        </Link>
          
        </div>

        {/* Main Form */}
        <Card className="bg-blue-50/30">
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div className="space-y-7">
                    <h3 className="text-lg font-medium">Standard Schedule Options</h3>

                    {/* Schedule Option */}
                    <FormField
                      control={form.control}
                      name="scheduleOption"
                      render={({ field }) => (
                        <FormItem className="space-y-4">
                          <FormControl>
                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-3">
                              <div
                                key="all"
                                className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50"
                              >
                                <RadioGroupItem value="all" id="all" />
                                <Label htmlFor="all" className="flex-1 cursor-pointer">
                                  Apply to all vehicles
                                </Label>
                              </div>
                              <div
                                key="specific"
                                className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50"
                              >
                                <RadioGroupItem value="specific" id="specific" />
                                <Label htmlFor="specific" className="flex-1 cursor-pointer">
                                  Select specific vehicles
                                </Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Vehicle Selection */}
                    {form.watch("scheduleOption") === "specific" && (
                      <FormField
                        control={form.control}
                        name="vehicleId"
                        render={({ field }) => (
                          <FormItem>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-slate-50 w-full">
                                  <SelectValue placeholder="- select vehicle -" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="w-[var(--radix-select-trigger-width)]">
                                {vehicles.map((vehicle:any) => (
                                  <SelectItem key={vehicle.id} value={vehicle.id}>
                                    {vehicle.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    {/* Maintenance Type */}
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium">Maintenance Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-slate-50 w-full">
                                <SelectValue placeholder="Select maintenance type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="w-[var(--radix-select-trigger-width)]">
                              {maintenanceTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type.charAt(0).toUpperCase() + type.slice(1)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Description */}
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium">Description</FormLabel>
                          <FormControl>
                            <Textarea
                              rows={4} 
                              placeholder="Enter maintenance description" 
                              className="bg-slate-50" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium">Schedule Details</h3>

                    {/* Scheduled Date */}
                    <FormField
                      control={form.control}
                      name="scheduledDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium">Scheduled Date</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                type="date" 
                                className="bg-slate-50 pl-10" 
                                {...field} 
                              />
                              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Mileage */}
                    <FormField
                      control={form.control}
                      name="mileage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium">Current Mileage</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              className="bg-slate-50" 
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                              value={field.value || ''}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Estimated Cost */}
                    <FormField
                      control={form.control}
                      name="estimatedCost"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium">Estimated Cost</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              className="bg-slate-50" 
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                              value={field.value || ''}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Next Maintenance Date */}
                    <FormField
                      control={form.control}
                      name="nextMaintenanceDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium">Next Maintenance Date (Optional)</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                type="date" 
                                className="bg-slate-50 pl-10" 
                                {...field} 
                              />
                              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Next Maintenance Mileage */}
                    <FormField
                      control={form.control}
                      name="nextMaintenanceMileage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium">Next Maintenance Mileage (Optional)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              className="bg-slate-50" 
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                              value={field.value || ''}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Actual Cost */}
                    <FormField
                      control={form.control}
                      name="cost"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium">Actual Cost </FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              className="bg-slate-50" 
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                              value={field.value || ''}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Preview/Summary */}
                <div className="mt-8 p-4 bg-white rounded-lg border">
                  <h3 className="text-lg font-medium mb-3">Preview/Summary</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {form.watch("scheduleOption") === "all" 
                      ? "This maintenance will be applied to all vehicles." 
                      : `This maintenance will be applied to the selected vehicle.`}
                    {form.watch("description") && ` The maintenance type is ${form.watch("type")} for "${form.watch("description")}".`}
                    {form.watch("scheduledDate") && ` Scheduled for ${new Date(form.watch("scheduledDate")).toLocaleDateString()}.`}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex  gap-3 mt-8">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="px-8 bg-transparent"
                    onClick={() => router.back()}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-[#0a1929] hover:bg-[#0a1929]/90 text-white px-8"
                  >
                    {isLoading ? "Saving..." : "Save Schedule"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}