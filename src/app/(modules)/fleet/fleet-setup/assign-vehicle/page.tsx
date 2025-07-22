"use client"

import { useState } from "react"
import { ArrowLeft, Plus, Calendar, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { useAssignVehicleMutation, useGetAllFleetQuery } from "@/lib/redux/api/fleetApi"
import { useGetAllDriverQuery } from "@/lib/redux/api/driverApi"
import { useRouter } from 'next/navigation';
import Link from "next/link"

export enum Department {
  CUSTOMER_SERVICE_PRICING = "Customer service & Pricing",
  SALES_FLEET = "Sales Fleet",
  COURIER = "Courier",
  HR_ADMIN = "HR & Admin",
  FINANCE = "Finance",
  AIR_SEA_OPERATIONS = "Air & Sea operations",
}

const assignVehicleSchema = z.object({
  vehicleId: z.string().min(1, "Vehicle selection is required"),
  driverId: z.string().optional(),
  assignTo: z.enum(["department", "project", "client", "location"]),
  departments: z.array(z.string()).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  purpose: z.string().optional(),
})

type AssignVehicleFormValues = z.infer<typeof assignVehicleSchema>

export default function AssignVehicle() {
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { data: fleetData, isLoading: fleetLoading } = useGetAllFleetQuery({})
  const { data: driverData, isLoading: driverLoading } = useGetAllDriverQuery({})
  const [assignVehicle, { isLoading: assignVehicleLoading }] = useAssignVehicleMutation()
  const router = useRouter();

  const form = useForm<AssignVehicleFormValues>({
    resolver: zodResolver(assignVehicleSchema),
    defaultValues: {
      vehicleId: "",
      driverId: "",
      assignTo: "department",
      departments: [],
      startDate: "",
      endDate: "",
      purpose: "",
    },
  })

  // Mock data - replace with actual data from your API
  const vehicles = fleetData?.map((vehicle: any) => ({
    id: vehicle._id,
    name: `${vehicle.make} ${vehicle.model} - ${vehicle.plateNumber}`
  })) || []

  const drivers = driverData?.map((driver: any) => ({
    id: driver._id,
    name: `${driver?.personalInfo?.name}`,
    // license: driver.licenseNumber
  })) || []

  const addDepartment = (deptValue: string) => {
    if (deptValue && !selectedDepartments.includes(deptValue)) {
      const newDepartments = [...selectedDepartments, deptValue]
      setSelectedDepartments(newDepartments)
      form.setValue("departments", newDepartments)
    }
  }

  const removeDepartment = (deptValue: string) => {
    const newDepartments = selectedDepartments.filter((dept) => dept !== deptValue)
    setSelectedDepartments(newDepartments)
    form.setValue("departments", newDepartments)
  }

  const onSubmit = async (data: AssignVehicleFormValues) => {
    try {
      setIsLoading(true)

      const assignmentData = {
        departments: data.assignTo === "department" ? selectedDepartments : [],
        currentDriver: data.driverId || null,
        // Add other fields as needed
      }

      // Use the RTK Query mutation
      await assignVehicle({
        vehicleId: data.vehicleId,
        assignmentData
      }).unwrap()

      toast.success("Vehicle assigned successfully!")
      form.reset()
      router.push('/fleet/fleet-setup');
      setSelectedDepartments([])
    } catch (error: any) {
      console.error("Error assigning vehicle:", error)
      toast.error(error.data?.message || "Failed to assign vehicle")
    } finally {
      setIsLoading(false)
    }}
  

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-semibold">Assign a vehicle</h1>
          </div>
          <Link href="/fleet/fleet-setup/maintenance-schedule" passHref>
          <Button className="bg-slate-800 hover:bg-slate-700">
            <Plus className="h-4 w-4 mr-2" />
            Add New Schedule
          </Button>
          </Link>
         
        </div>

        {/* Main Form */}
        <Card className=" bg-blue-50/30">
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div className="space-y-7">
                    {/* Vehicle Selection */}
                    <FormField
                          control={form.control}
                          name="vehicleId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center">
                                Vehicle
                                <span className="text-red-500 ml-1">*</span>
                              </FormLabel>
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

                    {/* Driver Selection */}
                   

                    {/* Assign To Section */}
                    <FormField
                      control={form.control}
                      name="assignTo"
                      render={({ field }) => (
                        <FormItem className="space-y-4">
                          <FormLabel>Assign To</FormLabel>
                          <FormControl>
                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-3">
                              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                                <RadioGroupItem value="department" id="department" />
                                <Label htmlFor="department" className="flex-1 cursor-pointer">
                                  Department
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                                <RadioGroupItem value="project" id="project" />
                                <Label htmlFor="project" className="flex-1 cursor-pointer">
                                  Project
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                                <RadioGroupItem value="client" id="client" />
                                <Label htmlFor="client" className="flex-1 cursor-pointer">
                                  Client
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                                <RadioGroupItem value="location" id="location" />
                                <Label htmlFor="location" className="flex-1 cursor-pointer">
                                  Location
                                </Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Department Selection */}
                    {form.watch("assignTo") === "department" && (
                      <div className="space-y-3">
                       <Select value="" onValueChange={(value) => addDepartment(value)}>
                                <SelectTrigger className="bg-slate-50 w-full">
                                  <SelectValue placeholder="- Select Department -" />
                                </SelectTrigger>
                                <SelectContent className="w-[var(--radix-select-trigger-width)]">
                                  {Object.values(Department)
                                    .filter((dept) => !selectedDepartments.includes(dept))
                                    .map((dept) => (
                                      <SelectItem key={dept} value={dept}>
                                        {dept}
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>

                        {/* Selected Departments */}
                        {selectedDepartments.length > 0 && (
                          <div className="space-y-2">
                            <Label className="text-xs text-gray-600">Selected Departments:</Label>
                            <div className="flex flex-wrap gap-2">
                              {selectedDepartments.map((dept) => (
                                <div
                                  key={dept}
                                  className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm"
                                >
                                  <span>{dept}</span>
                                  <button
                                    type="button"
                                    onClick={() => removeDepartment(dept)}
                                    className="hover:bg-blue-200 rounded-full p-0.5"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    <h3 className="text-sm font-medium">Assignment Details (Optional)</h3>

                    <FormField
                        control={form.control}
                        name="driverId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Driver</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-slate-50 w-full">  {/* Added w-full */}
                                  <SelectValue placeholder="- select driver -" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="w-[var(--radix-select-trigger-width)]">  {/* Match trigger width */}
                                {drivers.map((driver:any) => (
                                  <SelectItem key={driver.id} value={driver.id}>
                                    {driver.name} 
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                    {/* Start Date */}
                    {/* <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Date</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input type="date" className="bg-slate-50 pl-10" {...field} />
                              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    /> */}

                    {/* End Date */}
                    {/* <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Date</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input type="date" className="bg-slate-50 pl-10" {...field} />
                              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    /> */}

                    {/* Purpose of Assignment */}
                    {/* <FormField
                      control={form.control}
                      name="purpose"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Purpose of Assignment</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Write purpose here..."
                              className="bg-slate-50 min-h-[100px] resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    /> */}
                  </div>
                </div>

                {/* Assign Button */}
                <div className="mt-8">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#0a1929] hover:bg-[#0a1929]/90 text-white py-3"
                  >
                    {isLoading ? "Assigning..." : "Assign Vehicle"}
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
