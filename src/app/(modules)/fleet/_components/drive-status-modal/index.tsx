"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { useUpdateDriverStatusMutation } from "../../../../../lib/redux/api/driverApi"
export type DriverStatus = "available" | "on-trip" | "off-duty" | "suspended"

// interface Driver {
//     id: string
//     name: string
//     status: DriverStatus
//   }
  
  // interface DriverState {
  //   currentDriver: Driver
  //   isUpdating: boolean
  //   error: string | null
  // }

interface DriverStatusModalProps {
  isOpen: boolean
  onClose: () => void
  id: string
  status: string 
  name: string
}

const statusOptions: DriverStatus[] = ["available", "on-trip", "off-duty", "suspended"]

const getStatusColor = (status: string) => {
  switch (status) {
    case "Available":
      return "bg-emerald-100 text-emerald-800"
    case "On-trip":
      return "bg-blue-100 text-blue-800"
    case "Off-duty":
      return "bg-gray-100 text-gray-800"
    case "Suspended":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export function DriverStatusModal({ isOpen, onClose, id, status, name }: DriverStatusModalProps) {
//   const dispatch = useAppDispatch()
//   const { currentDriver, isUpdating } = useAppSelector((state) => state.driver)
const [updateDriverStatus, { isLoading: isCreating }] = useUpdateDriverStatusMutation()
  const [selectedStatus, setSelectedStatus] = useState<DriverStatus | "">("")
  const [showSuccess, setShowSuccess] = useState(false)

  const handleStatusUpdate = async () => {
    if (!selectedStatus || selectedStatus === status) return

    try {
      await updateDriverStatus(
        {
          id: id,
          status: selectedStatus,
        }
      ).unwrap()

      setShowSuccess(true)
    } catch (error) {
      // Error handling is managed by the slice
      console.error("Failed to update status:", error)
    }
  }

  const handleClose = () => {
    setSelectedStatus("")
    setShowSuccess(false)
    onClose()
  }

  const handleContinue = () => {
    setShowSuccess(false)
    setSelectedStatus("")
    onClose()
  }

  if (showSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center text-center p-6">
            <div className="w-16 h-16 rounded-full border-2 border-gray-900 flex items-center justify-center mb-6">
              <Check className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-semibold mb-2">Success!</h2>
            <p className="text-gray-600 mb-8">
              You have successfully updated this driver status <span className="font-medium">{name}</span>
            </p>

            <Button onClick={handleContinue} className="w-full bg-gray-900 hover:bg-gray-800 text-white">
              Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <div className="flex items-center justify-between p-6 pb-4">
          <h2 className="text-lg font-semibold">Update Driver Status</h2>
          {/* <Button variant="ghost" size="icon" onClick={handleClose} className="h-6 w-6">
            <X className="h-4 w-4" />
          </Button> */}
        </div>

        <div className="px-6 pb-6">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm font-medium">Current Status :</span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                {status}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Change status</label>
              <Select value={selectedStatus} onValueChange={(value: DriverStatus) => setSelectedStatus(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select the new status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleStatusUpdate}
              disabled={!selectedStatus || selectedStatus === status || isCreating}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white disabled:opacity-50"
            >
              {isCreating ? "Updating..." : "Update Status"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
