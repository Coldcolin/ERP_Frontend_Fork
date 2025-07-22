"use client"

import { useState } from "react"
import { Plus, Search, Filter, MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Image from "next/image"

export default function MaintenanceDashboard() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 5, 1)) // June 2025
  const [searchFleet, setSearchFleet] = useState("")
  const [searchParts, setSearchParts] = useState("")

  // Mock data
  const maintenanceData = [
    {
      id: "NWUF01",
      lastService: "04-06-2025",
      nextDue: "22-06-2025",
      taskType: "Brake fix",
      status: "Scheduled",
      downtime: "0hrs",
    },
    {
      id: "NWUF01",
      lastService: "09-06-2025",
      nextDue: "18-06-2025",
      taskType: "Oil Change",
      status: "Completed",
      downtime: "2hrs",
    },
    {
      id: "NWUF01",
      lastService: "18-05-2025",
      nextDue: "09-06-2025",
      taskType: "Brake fix",
      status: "Overdue",
      downtime: "12days",
    },
    {
      id: "NWUF01",
      lastService: "14-06-2025",
      nextDue: "14-06-2025",
      taskType: "Brake fix",
      status: "In progress",
      downtime: "3hrs",
    },
    {
      id: "NWUF01",
      lastService: "18-05-2025",
      nextDue: "09-06-2025",
      taskType: "Brake fix",
      status: "Overdue",
      downtime: "12days",
    },
  ]

  const sparePartsData = [
    {
      name: "Oil Filter",
      status: "Sufficient",
      qtyInStock: 26,
      lastUsed: "02-05-25",
    },
    {
      name: "Engine Belt",
      status: "Out of stock",
      qtyInStock: 3,
      lastUsed: "31-05-25",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "overdue":
        return "bg-red-100 text-red-800"
      case "in progress":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPartsStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "sufficient":
        return "bg-green-100 text-green-800"
      case "out of stock":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Calendar generation
  const generateCalendar = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())

    const days = []
    const current = new Date(startDate)

    for (let i = 0; i < 42; i++) {
      days.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }

    return days
  }

  const scheduledDates = [10, 14, 17, 25, 26] // Mock scheduled dates

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const navigateMonth = (direction: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1))
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Maintenance & Repairs</h1>
          <Button className="bg-slate-800 hover:bg-slate-700">
            <Plus className="h-4 w-4 mr-2" />
            Add new schedule
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card  className="border-b-2 border-t-0 border-r-0 border-l-0 rounded-none border-[#4759FF]" >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2  / bg-blue-100 rounded-lg">
                  
                <Image
                   src="/assets/images/repair.png"
                    alt="Driver photo"
                    width={35}
                    height={35}
                    className="object-cover"  // This ensures proper cropping
                    sizes="(max-width: 768px) 100vw, 33vw"  // Optional: helps with responsive sizing
                  />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Vehicles Under Maintenance</p>
                      <p className="text-2xl font-bold text-blue-600">12</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-b-2 border-t-0 border-r-0 border-l-0 rounded-none border-[#EEA403]">
                <CardContent className="p-4 ">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 
                    // bg-orange-100
                     rounded-lg">
                    <Image
                   src="/assets/images/total.png"
                    alt="Driver photo"
                    width={35}
                    height={35}
                    className="object-cover"  // This ensures proper cropping
                    sizes="(max-width: 768px) 100vw, 33vw"  // Optional: helps with responsive sizing
                  />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Downtime This Month</p>
                      <p className="text-2xl font-bold text-orange-600">24hrs</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card  className="border-b-2 border-t-0 border-r-0 border-l-0 rounded-none border-orange-600">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 
                    // bg-red-100
                     rounded-lg">
                    <Image
                   src="/assets/images/money.png"
                    alt="Driver photo"
                    width={35}
                    height={35}
                    className="object-cover"  // This ensures proper cropping
                    sizes="(max-width: 768px) 100vw, 33vw"  // Optional: helps with responsive sizing
                  />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Maintenance Costs (June)</p>
                      <p className="text-2xl font-bold text-red-600">₦320,000</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Fleet Maintenance List */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Fleet maintenance list</CardTitle>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search Fleet"
                        value={searchFleet}
                        onChange={(e) => setSearchFleet(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-800">
                      <TableHead className="text-white">Vehicle ID</TableHead>
                      <TableHead className="text-white">Last service date</TableHead>
                      <TableHead className="text-white">Next due</TableHead>
                      <TableHead className="text-white">Task Type</TableHead>
                      <TableHead className="text-white">Status</TableHead>
                      <TableHead className="text-white">Downtime</TableHead>
                      <TableHead className="text-white"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {maintenanceData.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="text-blue-600 font-medium">{item.id}</TableCell>
                        <TableCell>{item.lastService}</TableCell>
                        <TableCell>{item.nextDue}</TableCell>
                        <TableCell>{item.taskType}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                        </TableCell>
                        <TableCell>{item.downtime}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Edit Schedule</DropdownMenuItem>
                              <DropdownMenuItem>Mark Complete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination */}
                <div className="flex items-center justify-center space-x-2 mt-4">
                  <Button variant="outline" size="sm">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="bg-slate-800 text-white">
                    1
                  </Button>
                  <Button variant="outline" size="sm">
                    2
                  </Button>
                  <Button variant="outline" size="sm">
                    3
                  </Button>
                  <Button variant="outline" size="sm">
                    4...
                  </Button>
                  <Button variant="outline" size="sm">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Scheduled Tasks */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Upcoming Scheduled Tasks</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => navigateMonth(-1)}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-medium">
                      {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </span>
                    <Button variant="ghost" size="sm" onClick={() => navigateMonth(1)}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
                    <div key={day} className="text-center text-xs font-medium text-gray-500 p-2">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {generateCalendar().map((date, index) => {
                    const isCurrentMonth = date.getMonth() === currentDate.getMonth()
                    const isScheduled = scheduledDates.includes(date.getDate()) && isCurrentMonth
                    const isToday = date.toDateString() === new Date().toDateString()

                    return (
                      <div
                        key={index}
                        className={`
                          text-center p-2 text-sm cursor-pointer rounded
                          ${!isCurrentMonth ? "text-gray-300" : "text-gray-700"}
                          ${isScheduled ? "bg-blue-100 text-blue-800 font-medium" : ""}
                          ${isToday ? "bg-slate-800 text-white" : ""}
                          hover:bg-gray-100
                        `}
                      >
                        {date.getDate()}
                      </div>
                    )
                  })}
                </div>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span>Ends</span>
                  <div className="flex items-center space-x-2">
                    <span>8:00</span>
                    <Select defaultValue="AM">
                      <SelectTrigger className="w-16 h-6">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AM">AM</SelectItem>
                        <SelectItem value="PM">PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Spare Parts Stock */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Spare Parts Stock</CardTitle>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search spare parts"
                    value={searchParts}
                    onChange={(e) => setSearchParts(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {sparePartsData.map((part, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{part.name}</span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Update Stock</DropdownMenuItem>
                          <DropdownMenuItem>Order More</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <Badge className={getPartsStatusColor(part.status)}>{part.status}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Qty in Stock</span>
                      <span>{part.qtyInStock}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Last Used :</span>
                      <span>{part.lastUsed}</span>
                    </div>
                    {index < sparePartsData.length - 1 && <hr className="my-4" />}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
