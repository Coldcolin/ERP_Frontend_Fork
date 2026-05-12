"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Upload, Check, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

const orderSchema = z.object({
  shipmentType: z.string().min(1, "Shipment type is required"),
  shipmentNumber: z.string().min(1, "Shipment number is required"),
  clientName: z.string().min(1, "Client name is required"),
  weight: z.string().min(1, "Weight is required"),
  pickupOrigin: z.string().min(1, "Pickup origin is required"),
  deliveryLocation: z.string().min(1, "Delivery location is required"),
  pickupDate: z.string().min(1, "Pickup date is required"),
  deliveryDate: z.string().min(1, "Delivery date is required"),
  packageQuantity: z.string().min(1, "Package quantity is required"),
  dimensionL: z.string().min(1, "Length is required"),
  dimensionW: z.string().min(1, "Width is required"),
  dimensionH: z.string().min(1, "Height is required"),
  packageType: z.string().min(1, "Package type is required"),
  customPackageType: z.string().optional(),
  transportSource: z.enum(["vendor", "dgl_vehicle"]),
  vendorDetails: z.string().optional(),
  permit: z.instanceof(File).optional(),
  manifest: z.instanceof(File).optional(),
})

type OrderFormValues = z.infer<typeof orderSchema>

interface CreateOrderModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const packageTypes = [
  { value: "carton", label: "Carton" },
  { value: "sack", label: "Sack" },
  { value: "crate", label: "Crate" },
  { value: "drum", label: "Drum" },
  { value: "palette", label: "Palette" },
  { value: "container", label: "Container" },
]

const vendors = [
  { value: "vendor1", label: "Vendor 1" },
  { value: "vendor2", label: "Vendor 2" },
  { value: "vendor3", label: "Vendor 3" },
]

const CreateOrderModal = ({ open, onOpenChange }: CreateOrderModalProps) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      shipmentType: "",
      shipmentNumber: `SHP-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-*****`,
      clientName: "",
      weight: "",
      pickupOrigin: "",
      deliveryLocation: "",
      pickupDate: "",
      deliveryDate: "",
      packageQuantity: "",
      dimensionL: "",
      dimensionW: "",
      dimensionH: "",
      packageType: "",
      customPackageType: "",
      transportSource: "vendor",
      vendorDetails: "",
      permit: undefined,
      manifest: undefined,
    },
  })

  const transportSource = form.watch("transportSource")
  const orderId = `ORDER-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(100000 + Math.random() * 900000)}`

  const handleValidateOrder = async () => {
    const isValid = await form.trigger([
      'shipmentType',
      'clientName',
      'weight',
      'pickupOrigin',
      'deliveryLocation',
      'pickupDate',
      'deliveryDate',
      'packageQuantity',
      'dimensionL',
      'dimensionW',
      'dimensionH',
      'packageType',
      'transportSource',
    ])

    if (isValid) {
      if (transportSource === "vendor" && !form.getValues("vendorDetails")) {
        toast.error("Please select vendor details")
        return
      }
      setCurrentStep(2)
    }
  }

  const handleSubmitOrder = async () => {
    try {
      setIsLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast.success("Order created successfully")
      setCurrentStep(3)
    } catch {
      toast.error("Failed to create order")
    } finally {
      setIsLoading(false)
    }
  }

  const handleContinue = () => {
    onOpenChange(false)
    setCurrentStep(1)
    form.reset()
  }

  const FileUploadField = ({
    name,
    label,
    icon: Icon,
  }: {
    name: "permit" | "manifest"
    label: string
    icon: React.ComponentType<{ className?: string }>
  }) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field: { value, onChange, ...field } }) => (
        <FormItem>
          <FormControl>
            <div className="border border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors bg-white">
              <input
                type="file"
                id={name}
                className="hidden"
                accept=".pdf,.doc,.docx,image/*"
                onChange={(e) => onChange(e.target.files?.[0])}
                {...field}
              />
              <label htmlFor={name} className="cursor-pointer flex items-center justify-center gap-2">
                <Icon className="h-4 w-4 text-gray-600" />
                <span className="text-sm text-gray-700 font-medium">
                  {value instanceof File ? value.name : label}
                </span>
              </label>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen) {
        setCurrentStep(1)
        form.reset()
      }
      onOpenChange(newOpen)
    }}>
      <DialogContent className={cn(
        "p-0 gap-0 overflow-hidden",
        currentStep === 3 ? "sm:max-w-[400px]" : "sm:max-w-[800px]",
        currentStep !== 3 && "max-h-[95vh] overflow-y-auto"
      )}>
        {currentStep === 1 && (
          <>
            <DialogHeader className="px-8 pt-8 pb-4">
              <DialogTitle className="text-2xl font-semibold text-gray-900">Create New Order</DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form className="px-8 pb-8 space-y-5">
                {/* Row 1: Shipment Type & Shipment Number */}
                <div className="grid grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="shipmentType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-gray-700 flex items-center gap-1">
                          Shipment Type <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g. Frozen Foods, Industrial Equipment" 
                            className="bg-gray-100 border-0 text-sm h-10"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="shipmentNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-gray-700 flex items-center gap-1 justify-between">
                          <span>Shipment Number</span>
                          <span className="text-red-500 text-[10px]">auto-generated</span>
                        </FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            readOnly
                            className="bg-gray-100 border-0 text-sm h-10 text-gray-500"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Row 2: Client Name & Weight */}
                <div className="grid grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="clientName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-gray-700 flex items-center gap-1">
                          Client Name <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Fasnola and co." 
                            className="bg-gray-100 border-0 text-sm h-10"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-gray-700 flex items-center gap-1">
                          Weight (kg) <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g. 50" 
                            className="bg-gray-100 border-0 text-sm h-10"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Row 3: Pickup Origin & Delivery Location */}
                <div className="grid grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="pickupOrigin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-gray-700 flex items-center gap-1">
                          Pickup Origin / Location <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g. Apapa Wharf, Lagos" 
                            className="bg-gray-100 border-0 text-sm h-10"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="deliveryLocation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-gray-700 flex items-center gap-1">
                          Delivery Location / Destination <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g. Apapa Wharf, Lagos" 
                            className="bg-gray-100 border-0 text-sm h-10"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Row 4: Pickup Date & Delivery Date */}
                <div className="grid grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="pickupDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-gray-700 flex items-center gap-1">
                          Pickup Date <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="datetime-local"
                            placeholder="e.g. 2025-05-15 14:00" 
                            className="bg-gray-100 border-0 text-sm h-10"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="deliveryDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-gray-700 flex items-center gap-1">
                          Delivery Date / ETA <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="datetime-local"
                            placeholder="e.g. 2025-05-25 14:00" 
                            className="bg-gray-100 border-0 text-sm h-10"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Row 5: Package Quantity & Dimensions */}
                <div className="grid grid-cols-4 gap-4">
                  <FormField
                    control={form.control}
                    name="packageQuantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-gray-700 flex items-center gap-1">
                          Package Quantity <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              placeholder="e.g. 500" 
                              className="bg-gray-100 border-0 text-sm h-10 pr-8"
                              {...field} 
                            />
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dimensionL"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-gray-700 flex items-center gap-1">
                          Dimension (L) <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g. 50cm" 
                            className="bg-gray-100 border-0 text-sm h-10"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dimensionW"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-gray-700 flex items-center gap-1">
                          Dimension (W) <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g. 80cm" 
                            className="bg-gray-100 border-0 text-sm h-10"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dimensionH"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-gray-700 flex items-center gap-1">
                          Dimension (H) <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g. 30cm" 
                            className="bg-gray-100 border-0 text-sm h-10"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Package Type */}
                <FormField
                  control={form.control}
                  name="packageType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-gray-700 flex items-center gap-1">
                        Package type <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-gray-100 border-0 text-sm h-10 w-full">
                            <SelectValue placeholder="-select package type-" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {packageTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Custom Package Type Input */}
                <div className="bg-gray-100 rounded-md p-4 space-y-3">
                  <p className="text-xs text-gray-500">Enter custom package type</p>
                  <div className="flex flex-wrap gap-2">
                    {packageTypes.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => form.setValue("packageType", type.value)}
                        className={cn(
                          "text-sm font-medium px-3 py-1 rounded transition-colors",
                          form.watch("packageType") === type.value
                            ? "text-black font-bold"
                            : "text-gray-700 hover:text-black"
                        )}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Container label */}
                <div>
                  <p className="text-xs font-semibold text-gray-900">Container</p>
                </div>

                {/* Transport Source */}
                <FormField
                  control={form.control}
                  name="transportSource"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-gray-700 flex items-center gap-1">
                        Transport Source <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="grid grid-cols-2 gap-4"
                        >
                          <div className={cn(
                            "flex items-center gap-3 p-3 rounded-md border transition-colors cursor-pointer",
                            field.value === "vendor" ? "border-gray-400 bg-gray-50" : "border-gray-200 bg-gray-100"
                          )}>
                            <RadioGroupItem value="vendor" id="vendor" className="border-gray-400" />
                            <Label htmlFor="vendor" className="text-sm font-medium cursor-pointer m-0">Vendor</Label>
                          </div>
                          <div className={cn(
                            "flex items-center gap-3 p-3 rounded-md border transition-colors cursor-pointer",
                            field.value === "dgl_vehicle" ? "border-gray-400 bg-gray-50" : "border-gray-200 bg-gray-100"
                          )}>
                            <RadioGroupItem value="dgl_vehicle" id="dgl_vehicle" className="border-gray-400" />
                            <Label htmlFor="dgl_vehicle" className="text-sm font-medium cursor-pointer m-0">DGL Vehicle</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Vendor Details - conditional */}
                {transportSource === "vendor" && (
                  <FormField
                    control={form.control}
                    name="vendorDetails"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-gray-700">
                          Vendor Details
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-gray-100 border-0 text-sm h-10 w-full">
                              <SelectValue placeholder="-select vendor-" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {vendors.map((vendor) => (
                              <SelectItem key={vendor.value} value={vendor.value}>
                                {vendor.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <Button 
                  onClick={handleValidateOrder}
                  type="button"
                  className="w-full h-11 bg-[#0F172A] hover:bg-[#1e293b] text-white font-medium rounded-md"
                >
                  Validate order
                </Button>
              </form>
            </Form>
          </>
        )}

        {currentStep === 2 && (
          <>
            <DialogHeader className="px-8 pt-8 pb-4">
              <DialogTitle className="text-xl font-semibold text-gray-900">Confirm order details</DialogTitle>
            </DialogHeader>

            <div className="px-8 pb-8 space-y-5">
              {/* Order ID */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-900">Order ID:</span>
                <span className="text-sm font-semibold text-red-700">{orderId}</span>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700">Cargo Type -</span>
                  <span className="text-sm font-semibold text-black">{form.getValues("shipmentType") || "Frozen Food"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700">Shipment Number -</span>
                  <span className="text-sm font-semibold text-black">{form.getValues("shipmentNumber")}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700">Client Name -</span>
                  <span className="text-sm font-semibold text-black">{form.getValues("clientName") || "Happy Ltd"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700">Volume/Weight -</span>
                  <span className="text-sm font-semibold text-black">{form.getValues("weight") ? `${form.getValues("weight")} tons` : "50 tons"}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700">Pickup Origin / Location -</span>
                  <span className="text-sm font-semibold text-black">{form.getValues("pickupOrigin") || "Apapa Wharf, Lagos"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700">Delivery Location / Destination -</span>
                  <span className="text-sm font-semibold text-black">{form.getValues("deliveryLocation") || "Apapa Wharf, Lagos"}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700">Pickup Date -</span>
                  <span className="text-sm font-semibold text-black">{form.getValues("pickupDate")?.slice(0, 10) || "2025-05-15"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700">Delivery Date / ETA -</span>
                  <span className="text-sm font-semibold text-black">{form.getValues("deliveryDate")?.slice(0, 10) || "2025-05-15"}</span>
                </div>

                <div className="flex items-center gap-2 col-span-2">
                  <span className="text-sm text-gray-700">DGL Office -</span>
                  <span className="text-sm font-semibold text-black">Apapa Wharf, Lagos</span>
                </div>
              </div>

              {/* File Uploads */}
              <Form {...form}>
                <div className="space-y-3 pt-2">
                  <FileUploadField name="permit" label="Upload Permit" icon={Upload} />
                  <FileUploadField name="manifest" label="Upload Manifest" icon={Upload} />
                </div>
              </Form>

              <Button 
                onClick={handleSubmitOrder}
                disabled={isLoading}
                className="w-full h-11 bg-[#0F172A] hover:bg-[#1e293b] text-white font-medium rounded-md"
              >
                {isLoading ? "Submitting..." : "Submit Order"}
              </Button>
            </div>
          </>
        )}

        {currentStep === 3 && (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Success!</h2>
            <p className="text-sm text-gray-500 mb-8">Congratulations! You have successfully created an order</p>
            
            <div className="w-16 h-16 rounded-full border-2 border-gray-800 flex items-center justify-center mb-8">
              <Check className="h-8 w-8 text-gray-800" strokeWidth={2} />
            </div>

            <Button 
              onClick={handleContinue}
              className="w-full h-11 bg-[#0F172A] hover:bg-[#1e293b] text-white font-medium rounded-md"
            >
              Continue
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default CreateOrderModal
