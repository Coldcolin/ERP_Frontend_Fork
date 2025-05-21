'use client';

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


const vehicleSchema = z.object({
    vehicleName: z.string().min(2, "Vehicle name is required"),
    vehicleModel: z.string().min(1, "Vehicle model is required"),
    registration: z.string().min(1, "Registration is required"),
    vehicleType: z.string().min(1, "Vehicle type is required"),
    location: z.string().min(1, "Location is required"),
    plateNumber: z.string().min(1, "Plate number is required"),
    vehicleDescription: z.string().min(1, "Description is required"),
    energySource: z.string().min(1, "Energy source is required"),
    photo: z.string().optional(),
  });

  type VehicleFormValues = z.infer<typeof vehicleSchema>;


interface AddVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddVehicleModal({ isOpen, onClose }: AddVehicleModalProps) {
    const form = useForm<VehicleFormValues>({
        resolver: zodResolver(vehicleSchema),
        defaultValues: {
          vehicleName: "",
          vehicleModel: "",
          registration: "",
          vehicleType: "",
          location: "",
          plateNumber: "",
          vehicleDescription: "",
          energySource: "",
          photo: "",
        },
      });

      const onSubmit = (data: VehicleFormValues) => {
        console.log(data);
    
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
                name="vehicleDescription"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="flex items-center">
                      Vehicle Description
                      <span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Description" className="bg-slate-50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="energySource"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      Vehicle source of energy
                      <span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-slate-50">
                          <SelectValue placeholder="- select -" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="petrol">Petrol</SelectItem>
                        <SelectItem value="diesel">Diesel</SelectItem>
                        <SelectItem value="electric">Electric</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                        <SelectItem value="cng">CNG</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="photo"
                render={({ field }) => (
                  <FormItem className="md:col-span-3">
                    <FormLabel className="flex items-center">
                      Add Photo
                      <span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <div
                        className="border rounded-md p-2 bg-slate-50 text-center text-sm text-muted-foreground cursor-pointer hover:bg-slate-100 transition-colors"
                        onClick={() => {
                          // This would typically open a file picker
                          // For now, we'll just set a placeholder value
                          field.onChange("photo-uploaded")
                        }}
                      >
                        {field.value ? "Photo selected" : "Click here"}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="w-full md:w-auto bg-[#0a1929] hover:bg-[#0a1929]/90">
                Add Vehicle
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}