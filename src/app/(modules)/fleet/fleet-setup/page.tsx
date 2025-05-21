"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus} from "lucide-react"
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { AddScheduleModal } from "../_components/AddScheduleModal"

interface MaintenanceSchedule {
  id: string
  name: string
  appliedTo: string
  triggerType: "Mileage-based" | "Time-based"
  interval: string
  nextDue: string
  status: "Active" | "Inactive"
}

export default function FleetSetupPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [schedules] = useState<MaintenanceSchedule[]>([
    {
      id: "1",
      name: "Oil Change",
      appliedTo: "Toyota Camry",
      triggerType: "Mileage-based",
      interval: "15,000 km",
      nextDue: "5,200 km",
      status: "Active",
    },
    {
      id: "2",
      name: "Oil Change",
      appliedTo: "Toyota Camry",
      triggerType: "Mileage-based",
      interval: "15,000 km",
      nextDue: "5,200 km",
      status: "Inactive",
    },
    {
      id: "3",
      name: "Oil Change",
      appliedTo: "Toyota Camry",
      triggerType: "Time-based",
      interval: "12 Months",
      nextDue: "15-07-2025",
      status: "Inactive",
    },
    {
      id: "4",
      name: "Oil Change",
      appliedTo: "Toyota Camry",
      triggerType: "Mileage-based",
      interval: "15,000 km",
      nextDue: "5,200 km",
      status: "Active",
    },
    {
      id: "5",
      name: "Oil Change",
      appliedTo: "Toyota Camry",
      triggerType: "Mileage-based",
      interval: "15,000 km",
      nextDue: "5,200 km",
      status: "Inactive",
    },
    {
      id: "6",
      name: "Oil Change",
      appliedTo: "Toyota Camry",
      triggerType: "Time-based",
      interval: "12 Months",
      nextDue: "15-07-2025",
      status: "Inactive",
    },
    {
      id: "7",
      name: "Oil Change",
      appliedTo: "Toyota Camry",
      triggerType: "Mileage-based",
      interval: "15,000 km",
      nextDue: "5,200 km",
      status: "Active",
    },
  ])

  return (
    <div className="container mx-auto py-8  ">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Maintenance Schedules</h1>
        <Button className="bg-zinc-900 hover:bg-zinc-800"
        onClick={() => setIsModalOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" /> Add New Schedule
        </Button>
      </div>
      <AddScheduleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
        {/* Table Header */}
        <div className="bg-black text-white px-4 py-3 grid grid-cols-7 gap-4">
          <div className="flex items-center">
            <span className="ml-8">Schedule Name</span>
          </div>
          <div>Applied To</div>
          <div>Trigger Type</div>
          <div>Interval</div>
          <div>Next Due</div>
          <div>Status</div>
          <div></div>
        </div>

        {/* Table Body */}
        <div>
          {schedules.map((schedule) => (
            <div
              key={schedule.id}
              className="px-4 py-4 grid grid-cols-7 gap-4 items-center border-b border-gray-100 bg-gray-50 hover:bg-gray-100"
            >
              <div className="flex items-center">
                <Checkbox id={`select-${schedule.id}`}  className="mr-4 h-5 w-5 border-2 border-gray-300 rounded data-[state=checked]:bg-black data-[state=checked]:border-black"  />
                <span>{schedule.name}</span>
              </div>
              <div>{schedule.appliedTo}</div>
              <div>{schedule.triggerType}</div>
              <div>{schedule.interval}</div>
              <div>{schedule.nextDue}</div>
              <div>
                <Badge
                  className={
                    schedule.status === "Active"
                      ? "bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800"
                      : "bg-red-100 text-red-800 hover:bg-red-100 hover:text-red-800"
                  }
                >
                  {schedule.status}
                </Badge>
              </div>
              <div className="flex justify-end">
                {/* <DropdownMenu>
                  <DropdownMenuTrigger asChild> 
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Delete</DropdownMenuItem>
                    {schedule.status === "Active" ? (
                      <DropdownMenuItem>Deactivate</DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem>Activate</DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu> */}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" className="h-8 w-8">
            &lt;
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8 bg-black text-white hover:bg-black/90">
            1
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8">
            &gt;
          </Button>
        </div>
      </div>
    </div>
  )
}
