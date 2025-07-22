"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import {useCreateDriverMutation} from "@/lib/redux/api/driverApi"

const driverSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  contact: z.string().min(1, "please enter a phone number"),
  licenseNumber: z.string().min(1, "License number is required"),
  licenseExpiry: z.string().min(1, "License expiry date is required"),
  address: z.string().min(2,"Invalid email address"),
  DefensiveDriving_issueDate: z.string().min(1, "Defensive driving issue date is required"),
  DefensiveDriving_expiryDate: z.string().min(1, "Defensive driving expire date is required"),
  FirstAid_issueDate: z.string().min(1, "First aid issue date is required"),
  FirstAid_expiryDate: z.string().min(1, "First aid expire date is required"),
  DefensiveDriving: z.instanceof(File).optional(),
  FirstAid: z.instanceof(File).optional(),
//   passportPhoto: z.instanceof(File).optional(),
//   otherDocuments: z.instanceof(File).optional(),
})

type DriverFormValues = z.infer<typeof driverSchema>

interface AddDriverModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const AddDriverModal = ({ open, onOpenChange }: AddDriverModalProps) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [createDriver] = useCreateDriverMutation();

  const form = useForm<DriverFormValues>({
    resolver: zodResolver(driverSchema),
    defaultValues: {
      fullName: "",
      contact: "",
      licenseNumber: "",
      licenseExpiry: "",
      address: "",
      DefensiveDriving_issueDate: "",
      DefensiveDriving_expiryDate: "",
      FirstAid_issueDate: "",
      FirstAid_expiryDate: "",
      DefensiveDriving: undefined,
      FirstAid: undefined,
    //   passportPhoto: undefined,
    //   otherDocuments: undefined,
    },
  })

  const handleNextStep = async () => {
    if (currentStep === 1) {
    
      const isValid = await form.trigger([
        'fullName', 
        'contact', 
        'licenseNumber', 
        'licenseExpiry', 
        'address', 
        'DefensiveDriving_issueDate',
        'DefensiveDriving_expiryDate',
        'FirstAid_expiryDate',
        'FirstAid_issueDate',
      ]);
      
      if (isValid) {
        setCurrentStep(2);
      }
    }
  };

  const handlePrevStep = () => {
    if (currentStep === 2) {
      setCurrentStep(1)
    }
  }

  const onSubmit = async (data: DriverFormValues) => {
    try {
        setIsLoading(true);
        const formData = new FormData();
        formData.append('name', data.fullName);
        formData.append('contact', data.contact);
        formData.append('licenseNumber', data.licenseNumber);
        formData.append('licenseExpiry', data.licenseExpiry);
        formData.append('address', data.address);
        formData.append('DefensiveDriving_issueDate', data.DefensiveDriving_issueDate);
        formData.append('DefensiveDriving_expiryDate', data.DefensiveDriving_expiryDate);
        formData.append('FirstAid_issueDate', data.FirstAid_issueDate);
        formData.append('FirstAid_expiryDate', data.FirstAid_expiryDate);
        if (data.DefensiveDriving) {
          formData.append('DefensiveDriving', data.DefensiveDriving); 
        }
        if (data.FirstAid) {
          formData.append('FirstAid', data.FirstAid); 
        }
      // Handle form submission here

      console.log("Saving driver:", data)
      await createDriver(formData).unwrap();
      toast.success("Driver added successfully")
      onOpenChange(false)
      form.reset()
      setCurrentStep(1)
    } catch (error:any) {
        if (error?.data?.message) {
            toast.error(error.data.message);
          } else if (error?.message) {
            toast.error(error.message);
          } else {
            toast.error("Failed to add driver");
          }
    } finally {
      setIsLoading(false)
    }
  }

  const FileUploadField = ({
    name,
    label,
  }: {
    name: keyof DriverFormValues
    label: string
  }) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field: { value, onChange, ...field } }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <input
                type="file"
                id={name}
                className="hidden"
                accept="image/*,.pdf"
                onChange={(e) => onChange(e.target.files?.[0])}
                {...field}
              />
              <label htmlFor={name} className="cursor-pointer">
                <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">
                  {value instanceof File ? value.name : "Upload document"}
                </p>
              </label>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Add New Driver</DialogTitle>
        </DialogHeader>

        {/* Progress Indicator */}
        <div className="flex items-center  mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                  currentStep >= 1 ? "bg-green-500 text-white" : "bg-gray-200 text-gray-600",
                )}
              >
                {currentStep > 1 ? <Check className="w-4 h-4" /> : "1"}
              </div>
              <span className="ml-2 text-sm font-medium text-green-600">Personal Information</span>
            </div>
            <div className="w-8 h-px bg-gray-300"></div>
            <div className="flex items-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                  currentStep === 2 ? "bg-green-500 text-white" : "bg-gray-200 text-gray-600",
                )}
              >
                2
              </div>
              <span className="ml-2 text-sm font-medium text-green-600">Essential Documents</span>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                 <FormField
                    control={form.control}
                    name="licenseNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>License Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter license number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                 
                  <FormField
                    control={form.control}
                    name="licenseExpiry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>License Expiry Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="contact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Number</FormLabel>
                        <FormControl>
                          <Input type="phone" placeholder="Enter phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
           
                <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="DefensiveDriving_issueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Driving Issue Date</FormLabel>
                      <FormControl>
                        <Input type="date"   {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="DefensiveDriving_expiryDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Driving Expire Date</FormLabel>
                      <FormControl>
                        <Input type="date"  {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                </div>
                <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="FirstAid_issueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>FirstAid Issue Date</FormLabel>
                      <FormControl>
                        <Input type="date"   {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="FirstAid_expiryDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>FirstAid Expire Date</FormLabel>
                      <FormControl>
                        <Input type="date"  {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                </div>
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input  placeholder="Enter email address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

               

                <Button 
                  onClick={handleNextStep} 
                  type="button"
                  className=" bg-[#0a1929] hover:bg-[#0a1929]/90 mt-6"
                >
                  Next Step
                </Button>
              </div>
            )}

            {/* Step 2: Essential Documents */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FileUploadField 
                    name="DefensiveDriving" 
                    label="defensiveDriving" 
                  />
                  <FileUploadField
                    name="FirstAid"
                    label="FirstAid"/>
                </div>

                {/* <div className="grid grid-cols-2 gap-4">
                  <FileUploadField 
                    name="passportPhoto" 
                    label="Passport Photo" 
                  />
                  <FileUploadField 
                    name="otherDocuments" 
                    label="Other Documents" 
                  />
                </div> */}

                <div className="flex gap-3 mt-6">
                  <Button 
                    variant="outline" 
                    onClick={handlePrevStep} 
                    type="button"
                    className="flex-1"
                  >
                    Previous
                  </Button>
                  <Button 
                    type="submit"
                    className="flex-1 bg-[#0a1929] hover:bg-[#0a1929]/90"
                    disabled={isLoading}
                  >
                    {isLoading ? "Saving..." : "Save Driver"}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default AddDriverModal