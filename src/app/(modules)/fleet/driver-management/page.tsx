"use client"
import React from 'react'
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, MoreVertical, Search, FileSearch, UserRoundPen, CloudDownload, Trash2, User } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import AddDriverModal from '../_components/AddDriverModal'
import {useGetAllDriverQuery} from "@/lib/redux/api/driverApi"
import { format } from 'date-fns'
import TableOptions from '@/components/app/TableOptions'

interface Certification {
  type: string
  documentPath: string
  issueDate: string
  expiryDate: string
  _id: string
}

interface Vehicle {
  _id: string
  make: string
  model: string
  registration: string
  plateNumber: string
  status: string
}

interface Driver {
  _id: string
  personalInfo: {
    name: string
    licenseNumber: string
    licenseExpiry: string
    contact: string
    address: string
  }
  performanceMetrics: {
    safetyScore: number
    fuelEfficiency: number
    customerRating: number
  }
  certifications: Certification[]
  status: "available" | "on-trip" | "on-leave" | "inactive"
  assignedVehicle?: Vehicle
  createdAt: string
  updatedAt: string
}



const DriverManagement = () => {
    const [isAddDriverModalOpen, setIsAddDriverModalOpen] = useState(false)  
    const { data: drivers = [], isLoading } = useGetAllDriverQuery({})

    const formatDriverDate = (dateString: string) => {
      try {
        const date = new Date(dateString)
    
        return format(date, 'MMM d, yyyy')
      } catch (error) {
        console.error('Error formatting date:', error)
        return 'Invalid date' 
      }
    }
    
 

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Driver Management - ({drivers?.length})</h1>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search driver" className="pl-8" />
          </div>
          <Button variant="outline">Filters</Button>
          <Button className="bg-[#0a1929] hover:bg-[#0a1929]/90" onClick={() => setIsAddDriverModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add new driver
          </Button>
        </div>
      </div>

       <div>
  {isLoading ? (
    // Loading state
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
    </div>
  ) : drivers?.length === 0 ? (
    // Empty state
    <div className="flex flex-col items-center justify-center h-64 text-center">
      <FileSearch className="w-12 h-12 text-gray-400 mb-4" />
      <p className="text-lg font-medium text-gray-600 mb-2">
        You do not have any registered drivers yet
      </p>
      <p className="text-gray-500 mb-4">
        Click the button to start adding drivers
      </p>
      <Button className="bg-black text-white hover:bg-gray-800" onClick={() => setIsAddDriverModalOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Add Driver
        </Button>
          
    </div>
  ) : (
    // Data table
   
    <div className="bg-white rounded-lg overflow-hidden ">
    <div className="bg-[#0a1929] text-white px-4 py-3 grid grid-cols-7 gap-4">
      <div>Photo</div>
      <div>Driver's name</div>
      <div>License No</div>
      <div>License Expiry</div>
      <div>Phone No</div>
      <div>Assigned vehicle</div>
      <div>Status</div>
    </div>

    <div>
      {drivers.map((driver:Driver) => (

        <div
          key={driver?._id}
          className="px-4 py-3 grid grid-cols-7 gap-4 items-center border-b border-gray-100 hover:bg-gray-50"
        >
          <div>
            <Avatar className="h-8 w-8">
              {/* <AvatarImage src={driver?.photo} /> */}
              <AvatarFallback>{driver?.personalInfo?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
          <div>{driver?.personalInfo?.name}</div>
          <div>{driver?.personalInfo?.licenseNumber}</div>
          <div>{formatDriverDate(driver.personalInfo.licenseExpiry)}</div>
          <div>{driver?.personalInfo?.contact}</div>
          <div>
          
          {driver.assignedVehicle ? (
                      <div className="flex flex-col">
                        <span className="text-blue-600 hover:underline cursor-pointer">
                          {driver.assignedVehicle.plateNumber}
                        </span>
                        <span className="text-xs text-gray-500">
                          {driver.assignedVehicle.make} {driver.assignedVehicle.model}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-500">unassigned</span>
                    )}
          </div>
          <div className="flex justify-between items-center">
            <Badge
              className={
                driver.status === "available"
                  ? "bg-green-100 text-green-800 hover:bg-green-100"
                  : "bg-red-100 text-red-800 hover:bg-red-100"
              }
            >
              {driver.status}
            </Badge>

            <TableOptions 
                       variant="dotsVertical"
                       options={[
                        {
                          label: "View Profile",
                          nextHref: `driver-management/${driver._id}`,
                          icon: <User className="h-4 w-4" />,
                        },
                        {
                          label: "Edit Driver",
                          onClick: () => {
                            // setSelectedUser(user);
                            // setIsModalOpen(true);
                            // setSelectedUser({ ...user, isEditing: true });
                          },
                          icon: <UserRoundPen  className="h-4 w-4" />,
                        },
                      
                        {
                          label: "Export details",
                          onClick: () => {
                          console.log('Eport details');
                          },
                          icon: <CloudDownload  className="h-4 w-4" />,
                        },
                        {
                          label: "Delete Driver",
                          onClick: () => {
                            // setUserToDelete(user) 
                            // setIsDialogOpen(true) 
                          },
                          icon: <Trash2  className="h-4 w-4" />,
                        },
                       ]}
                       />
           
          </div>
        </div>
      ))}
    </div>
  </div>
  )}
</div>


      <div className="flex justify-center mt-4">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" className="h-8 w-8">&lt;</Button>
          <Button variant="outline" size="icon" className="h-8 w-8">1</Button>
          <Button variant="outline" size="icon" className="h-8 w-8">2</Button>
          <Button variant="outline" size="icon" className="h-8 w-8">3</Button>
          <Button variant="outline" size="icon" className="h-8 w-8">4</Button>
          <Button variant="outline" size="icon" className="h-8 w-8">&gt;</Button>
        </div>
      </div>
      <AddDriverModal open={isAddDriverModalOpen} onOpenChange={setIsAddDriverModalOpen} />
    </div>
  )
}

export default DriverManagement