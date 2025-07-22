'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Car } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {useCreateFleetMutation} from "@/lib/redux/api/fleetApi"
import { useGetAllDriverQuery } from '@/lib/redux/api/driverApi';

export enum Department {
  CUSTOMER_SERVICE_PRICING = 'Customer service & Pricing',
  SALES_FLEET = 'Sales Fleet',
  COURIER = 'Courier',
  HR_ADMIN = 'HR & Admin',
  FINANCE = 'Finance',
  AIR_SEA_OPERATIONS = 'Air & Sea operations'
}

const vehicleSchema = z.object({
    vehicleName: z.string().min(2, "Vehicle name is required"),
    vehicleModel: z.string().min(1, "Vehicle model is required"),
    registration: z.string().min(1, "Registration is required"),
    vehicleType: z.string().min(1, "Vehicle type is required"),
    location: z.string().min(1, "Location is required"),
    plateNumber: z.string().min(1, "Plate number is required"),
    departments: z.string().min(1, "department  is required"),
    // energySource: z.string().min(1, "Energy source is required"),
    insurance_issueDate: z.string().min(1, "Insurance issue date is required"),
    insurance_expiryDate: z.string().min(1, "Insurance expiry date is required"),
    RoadWorthines_issueDate: z.string().min(1, "Road worthiness issue date is required"),
    RoadWorthines_expiryDate: z.string().min(1, "Road worthiness expiry date is required"),
    currentDriver: z.string().min(1, "Current driver is required"),
    insurance: z.instanceof(File).optional(),
    RoadWorthines: z.instanceof(File).optional(),
  });

  type VehicleFormValues = z.infer<typeof vehicleSchema>;


interface AddVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddVehicleModal({ isOpen, onClose }: AddVehicleModalProps) {
    const [createFleet] = useCreateFleetMutation();
    const [isLoading, setIsLoading] = useState(false);
    const { data: driverData } = useGetAllDriverQuery({})

    const drivers = driverData?.map((driver: { _id: string; personalInfo: { name: string } }) => ({
      id: driver._id,
      name: `${driver?.personalInfo?.name}`,
      // license: driver.licenseNumber
    })) || []
    const form = useForm<VehicleFormValues>({
        resolver: zodResolver(vehicleSchema),
        defaultValues: {
          vehicleName: "",
          vehicleModel: "",
          registration: "",
          vehicleType: "",
          location: "",
          plateNumber: "",
          departments: "HR & Admin",
          currentDriver:"67ff51b648674b0b4906a17b",
          // energySource: "",
          insurance_issueDate: "",
          insurance_expiryDate: "",
          RoadWorthines_issueDate: "",
          RoadWorthines_expiryDate: "",
          insurance: undefined,
          RoadWorthines: undefined,
        },
      });

      const onSubmit = async (data: VehicleFormValues) => {
        try {
            setIsLoading(true);
            const formData = new FormData();
            
            // Add all text fields
            formData.append('make', data.vehicleName);
            formData.append('model', data.vehicleModel);
            formData.append('registration', data.registration);
            formData.append('type', data.vehicleType);
            formData.append('location', data.location);
            formData.append('plateNumber', data.plateNumber);
            formData.append('departments',  data.departments);
            formData.append('currentDriver', data.currentDriver);
            if (data.insurance instanceof File) {
              formData.append('insurance', data.insurance);
            }
            if (data.RoadWorthines instanceof File) {
              formData.append('RoadWorthines', data.RoadWorthines);
            }
            formData.append('insurance_issueDate', data.insurance_issueDate);
            formData.append('insurance_expiryDate', data.insurance_expiryDate);
            formData.append('RoadWorthines_issueDate', data.RoadWorthines_issueDate);
            formData.append('RoadWorthines_expiryDate', data.RoadWorthines_expiryDate);

            await createFleet(formData).unwrap();
            toast.success('Vehicle added successfully');
            onClose();
            form.reset();
        } catch (error: any) {
            toast.error(error.data?.message || 'Failed to add vehicle');
        } finally {
            setIsLoading(false);
        }
    };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Car className="h-6 w-6" />
            <DialogTitle className="text-xl font-bold">Register</DialogTitle>
          </div>
          <p className="text-sm text-muted-foreground mt-1">Type in data according to the fields given below</p>
          <p className="text-xs text-muted-foreground mt-1">You can enter the data if required</p>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="vehicleName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      Vehicle Name
                      <span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Toyota Venza" className="bg-slate-50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="vehicleModel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      Vehicle Model
                      <span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="ZL" className="bg-slate-50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="registration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      Registration
                      <span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="123456789" className="bg-slate-50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="vehicleType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      Vehicle Type (e.g bike car, bus, or truck)
                      <span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="2005" className="bg-slate-50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      Location
                      <span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="7,800" className="bg-slate-50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="plateNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      Plate Number
                      <span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="TTY-YYT-267" className="bg-slate-50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

          <FormField
                control={form.control}
                name="departments"
                render={({ field }) => (
                  <FormItem >
                    <FormLabel className="flex items-center">
                      Department
                      <span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-slate-50 w-70">
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(Department).map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

<FormField
                control={form.control}
                name="insurance_issueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      Insurance Issue Date
                      <span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        className="bg-slate-50" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            <FormField
                control={form.control}
                name="insurance_expiryDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      Insurance Expiry Date
                      <span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        className="bg-slate-50" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            <FormField
                control={form.control}
                name="RoadWorthines_issueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      Road Worthiness Issue Date
                      <span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        className="bg-slate-50" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            <FormField
                control={form.control}
                name="RoadWorthines_expiryDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      Road Worthiness Expiry Date
                      <span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        className="bg-slate-50" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
                 <FormField
                        control={form.control}
                        name="currentDriver"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Driver</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-slate-50 w-full">  {/* Added w-full */}
                                  <SelectValue placeholder="- select driver -" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="w-[var(--radix-select-trigger-width)]">  {/* Match trigger width */}
                                {drivers.map((driver: { id: string; name: string }) => (
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


<FormField
                control={form.control}
                name="insurance"
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem className="md:col-span-3">
                    <FormLabel className="flex items-center">
                      Insurance Document
                      <span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*,.pdf"
                        className="bg-slate-50"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) onChange(file);
                        }}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="RoadWorthines"
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem className="md:col-span-3">
                    <FormLabel className="flex items-center">
                      Road Worthiness Document
                      <span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*,.pdf"
                        className="bg-slate-50"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) onChange(file);
                        }}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            
            </div>

            <div className="flex justify-end">
            <Button 
              type="submit" 
              className="w-full md:w-auto bg-[#0a1929] hover:bg-[#0a1929]/90"
              disabled={isLoading}
          >
              {isLoading ? "Adding..." : "Add Vehicle"}
    </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}