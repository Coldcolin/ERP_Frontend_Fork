"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Search, Upload } from "lucide-react"

interface TripScheduleModalProps {
  isOpen: boolean
  onClose: () => void
}

const steps = [
  { number: 1, title: "Trip Information", active: true },
  { number: 2, title: "Vehicle & Driver Assignment", active: false },
  { number: 3, title: "Load Tracking", active: false },
  { number: 4, title: "Upload Documents", active: false },
]

const drivers = [
  {
    id: 1,
    photo: "/placeholder.svg?height=40&width=40",
    name: "Emeka Agbazie",
    licenseNo: "B12345XYZ",
    licenseExpiry: "Jan 4, 2025",
    phoneNo: "09014184551",
    status: "Inactive",
  },
  {
    id: 2,
    photo: "/placeholder.svg?height=40&width=40",
    name: "Emeka Agbazie",
    licenseNo: "B12345XYZ",
    licenseExpiry: "Jan 4, 2025",
    phoneNo: "09014184551",
    status: "Inactive",
  },
  {
    id: 3,
    photo: "/placeholder.svg?height=40&width=40",
    name: "Emeka Agbazie",
    licenseNo: "B12345XYZ",
    licenseExpiry: "Jan 4, 2025",
    phoneNo: "09014184551",
    status: "active",
  },
]

const vehicles = [
  {
    id: "NWUPD1",
    year: "2019",
    make: "Toyota",
    model: "Camary",
    weight: "<=8,500 pounds",
    energy: "Fuel",
    status: "Unassigned",
  },
  {
    id: "NWUPD1",
    year: "2019",
    make: "Toyota",
    model: "Camary",
    weight: "<=8,500 pounds",
    energy: "Fuel",
    status: "Assigned",
  },
  {
    id: "NWUPD1",
    year: "2019",
    make: "Toyota",
    model: "Camary",
    weight: "<=8,500 pounds",
    energy: "Fuel",
    status: "Unassigned",
  },
]

export default function TripScheduleModal({ isOpen, onClose }: TripScheduleModalProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    shipmentId: "SHIP-1....",
    client: "Fashola and co.",
    origin: "e.g. Lagos",
    destination: "e.g. Onitsha",
    arrivalDate: "2025-05-24",
    departureDate: "2025-05-21",
    cargoDescription: "e.g. 50 crates of beverages",
    cargoWeight: "e.g. 200kg",
    packages: "e.g. 50",
    handlingInstructions: "e.g. Keep upright, no stacking",
    fuelLtr: "e.g. 180L",
    fuelCost: "e.g. ₦40,000",
    maintenanceFee: "e.g. ₦50,000",
    tollFee: "e.g. ₦14,000",
    expectedRevenue: "e.g. ₦64,000",
  })

  const updateSteps = (stepNumber: number) => {
    return steps.map((step) => ({
      ...step,
      active: step.number <= stepNumber,
    }))
  }

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    } else {
      onClose()
    }
  }

  const renderStepIndicator = () => (
    <div className="flex items-center space-x-4 mb-8">
      {updateSteps(currentStep).map((step, index) => (
        <div key={step.number} className="flex items-center">
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
              step.active
                ? step.number === currentStep
                  ? "bg-teal-600 text-white"
                  : "bg-teal-600 text-white"
                : "bg-gray-300 text-gray-600"
            }`}
          >
            {step.number}
          </div>
          <span className={`ml-2 text-sm font-medium ${step.active ? "text-teal-600" : "text-gray-400"}`}>
            {step.title}
          </span>
          {index < steps.length - 1 && <div className="w-8 h-px bg-gray-300 ml-4" />}
        </div>
      ))}
    </div>
  )

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="shipmentId">Shipment ID</Label>
          <div className="relative">
            <Input id="shipmentId" value={formData.shipmentId} className="bg-gray-50" readOnly />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-red-500">
              auto-generated
            </span>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="client">
            Client <span className="text-red-500">*</span>
          </Label>
          <Input
            id="client"
            value={formData.client}
            onChange={(e) => setFormData({ ...formData, client: e.target.value })}
            className="bg-gray-50"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="origin">
            Origin <span className="text-red-500">*</span>
          </Label>
          <Input id="origin" placeholder={formData.origin} className="bg-gray-50" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="destination">
            Destination <span className="text-red-500">*</span>
          </Label>
          <Input id="destination" placeholder={formData.destination} className="bg-gray-50" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="arrivalDate">
            Arrival date <span className="text-red-500">*</span>
          </Label>
          <Input
            id="arrivalDate"
            type="date"
            value={formData.arrivalDate}
            onChange={(e) => setFormData({ ...formData, arrivalDate: e.target.value })}
            className="bg-gray-50"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="departureDate">
            Departure date <span className="text-red-500">*</span>
          </Label>
          <Input
            id="departureDate"
            type="date"
            value={formData.departureDate}
            onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })}
            className="bg-gray-50"
          />
        </div>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-8">
      {/* Driver Assignment Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Driver Assignment</h3>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input placeholder="Search driver" className="pl-10 w-64" />
            </div>
          </div>
        </div>

        <div className="bg-slate-900 text-white rounded-t-lg">
          <div className="grid grid-cols-7 gap-4 p-4 text-sm font-medium">
            <div>Photo</div>
            <div>Driver name</div>
            <div>License No</div>
            <div>License Expiry</div>
            <div>Phone No</div>
            <div>Status</div>
            <div></div>
          </div>
        </div>

        <div className="border border-t-0 rounded-b-lg">
          {drivers.map((driver, index) => (
            <div key={index} className="grid grid-cols-7 gap-4 p-4 border-b last:border-b-0 items-center">
              <Avatar className="w-10 h-10">
                <AvatarImage src={driver.photo || "/placeholder.svg"} />
                <AvatarFallback>EA</AvatarFallback>
              </Avatar>
              <div>{driver.name}</div>
              <div>{driver.licenseNo}</div>
              <div>{driver.licenseExpiry}</div>
              <div>{driver.phoneNo}</div>
              <div>
                <Badge
                  variant={driver.status === "active" ? "default" : "destructive"}
                  className={
                    driver.status === "active"
                      ? "bg-teal-100 text-teal-800 hover:bg-teal-100"
                      : "bg-red-100 text-red-800 hover:bg-red-100"
                  }
                >
                  {driver.status === "active" ? "active" : "Inactive"}
                </Badge>
              </div>
              <div>
                <Button size="sm" className={driver.status === "assigned" ? "bg-gray-400" : "bg-slate-900"}>
                  assign
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Vehicle Assignment Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Vehicle Assignment</h3>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input placeholder="Search vehicle" className="pl-10 w-64" />
            </div>
            <Button className="bg-slate-900">+ Assign Vehicle</Button>
          </div>
        </div>

        <div className="bg-slate-900 text-white rounded-t-lg">
          <div className="grid grid-cols-8 gap-4 p-4 text-sm font-medium">
            <div>Vehicle ID</div>
            <div>Year</div>
            <div>Make</div>
            <div>Model</div>
            <div>Weight</div>
            <div>Energy</div>
            <div>Status</div>
            <div></div>
          </div>
        </div>

        <div className="border border-t-0 rounded-b-lg">
          {vehicles.map((vehicle, index) => (
            <div key={index} className="grid grid-cols-8 gap-4 p-4 border-b last:border-b-0 items-center">
              <div className="text-blue-600 underline">{vehicle.id}</div>
              <div>{vehicle.year}</div>
              <div>{vehicle.make}</div>
              <div>{vehicle.model}</div>
              <div>{vehicle.weight}</div>
              <div>{vehicle.energy}</div>
              <div>
                <Badge
                  variant={vehicle.status === "Assigned" ? "default" : "destructive"}
                  className={
                    vehicle.status === "Assigned"
                      ? "bg-teal-100 text-teal-800 hover:bg-teal-100"
                      : "bg-red-100 text-red-800 hover:bg-red-100"
                  }
                >
                  {vehicle.status}
                </Badge>
              </div>
              <div>
                <Button size="sm" className={vehicle.status === "assigned" ? "bg-gray-400" : "bg-slate-900"}>
                  assign
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="cargoDescription">
            Cargo Description <span className="text-red-500">*</span>
          </Label>
          <Input id="cargoDescription" placeholder={formData.cargoDescription} className="bg-gray-50" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cargoWeight">
            Cargo Weight <span className="text-red-500">*</span>
          </Label>
          <Input id="cargoWeight" placeholder={formData.cargoWeight} className="bg-gray-50" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="packages">
            No. of Packages <span className="text-red-500">*</span>
          </Label>
          <Input id="packages" placeholder={formData.packages} className="bg-gray-50" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="handlingInstructions">
            Handling Instructions <span className="text-red-500">*</span>
          </Label>
          <Input id="handlingInstructions" placeholder={formData.handlingInstructions} className="bg-gray-50" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="fuelLtr">
            Fuel / Ltr <span className="text-red-500">*</span>
          </Label>
          <Input id="fuelLtr" placeholder={formData.fuelLtr} className="bg-gray-50" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fuelCost">
            Fuel Cost <span className="text-red-500">*</span>
          </Label>
          <Input id="fuelCost" placeholder={formData.fuelCost} className="bg-gray-50" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="maintenanceFee">
            Maintenance Fee <span className="text-red-500">*</span>
          </Label>
          <Input id="maintenanceFee" placeholder={formData.maintenanceFee} className="bg-gray-50" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tollFee">
            Toll Fee <span className="text-red-500">*</span>
          </Label>
          <Input id="tollFee" placeholder={formData.tollFee} className="bg-gray-50" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-2">
          <Label htmlFor="expectedRevenue">Expected Revenue</Label>
          <Input id="expectedRevenue" placeholder={formData.expectedRevenue} className="bg-gray-50" />
        </div>
      </div>
    </div>
  )

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>
            Vehicle Permit <span className="text-red-500">*</span>
          </Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
            <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <span className="text-gray-600">upload document</span>
          </div>
        </div>
        <div className="space-y-2">
          <Label>
            Road Manifest <span className="text-red-500">*</span>
          </Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
            <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <span className="text-gray-600">upload document</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>
            Fuel Receipt <span className="text-red-500">*</span>
          </Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
            <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <span className="text-gray-600">upload document</span>
          </div>
        </div>
        <div className="space-y-2">
          <Label>
            Maintenance fee receipt <span className="text-red-500">*</span>
          </Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
            <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <span className="text-gray-600">upload document</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-2">
          <Label>
            Toll Fee Receipt <span className="text-red-500">*</span>
          </Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50 max-w-md">
            <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <span className="text-gray-600">upload document</span>
          </div>
        </div>
      </div>
    </div>
  )

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1()
      case 2:
        return renderStep2()
      case 3:
        return renderStep3()
      case 4:
        return renderStep4()
      default:
        return renderStep1()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[80vw] max-h-[90vh] overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              back
            </Button>
          </div>
          <DialogTitle className="text-2xl font-bold">Trip Schedule</DialogTitle>
        </DialogHeader>

        <div className="space-y-8">
          {renderStepIndicator()}
          {renderCurrentStep()}

          <div className="flex justify-start pt-6">
            <Button onClick={currentStep === 4 ? onClose : handleNext} className="bg-slate-900 hover:bg-slate-800 px-8">
              {currentStep === 4 ? "Schedule Trip" : "Next"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
