"use client"

import { useState } from "react"
import { Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
// import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

interface AddVehicleModalProps {
    isOpen: boolean;
    onClose: () => void;
  }

export function AddScheduleModal({ isOpen, onClose }: AddVehicleModalProps) {
  const [activeTab, setActiveTab] = useState("maintenance")
  const [showDatePicker, setShowDatePicker] = useState(false)

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4 gap-4">
//       {/* Maintenance Schedules Modal */}
//       <Card className="w-full max-w-md bg-white rounded-md shadow-md relative">
//         <div className="absolute top-4 right-4 cursor-pointer">
//           <span className="text-gray-500 text-xl">×</span>
//         </div>

//         <Tabs defaultValue="maintenance" className="w-full">
//           <TabsList className="grid w-full grid-cols-2 mb-4 border-b">
//             <TabsTrigger
//               value="maintenance"
//               className={`pb-2 ${activeTab === "maintenance" ? "border-b-2 border-black" : ""}`}
//               onClick={() => setActiveTab("maintenance")}
//             >
//               Maintenance Schedules
//             </TabsTrigger>
//             <TabsTrigger
//               value="assign"
//               className={`pb-2 ${activeTab === "assign" ? "border-b-2 border-black" : ""}`}
//               onClick={() => setActiveTab("assign")}
//             >
//               Assign Fleet
//             </TabsTrigger>
//           </TabsList>

//           <TabsContent value="maintenance" className="p-6">
//             <div className="space-y-6">
//               <div className="space-y-2">
//                 <div className="flex justify-between">
//                   <Label htmlFor="scheduleName" className="text-sm">
//                     Schedule Name
//                   </Label>
//                   <span className="text-red-500">*</span>
//                 </div>
//                 <Input id="scheduleName" placeholder="Oil Change - Car fleet" className="w-full" />
//               </div>

//               <div className="space-y-2">
//                 <div className="flex justify-between">
//                   <Label className="text-sm">Apply To</Label>
//                   <span className="text-red-500">*</span>
//                 </div>
//                 <div className="flex gap-8">
//                   <div className="flex items-center space-x-2">
//                     <input type="radio" id="specificVehicle" name="applyTo" className="h-4 w-4" />
//                     <Label htmlFor="specificVehicle" className="text-sm">
//                       Specific Vehicle
//                     </Label>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <input type="radio" id="vehicleType" name="applyTo" className="h-4 w-4" />
//                     <Label htmlFor="vehicleType" className="text-sm">
//                       Vehicle Type
//                     </Label>
//                   </div>
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <div className="flex justify-between">
//                   <Label className="text-sm">Trigger Type</Label>
//                   <span className="text-red-500">*</span>
//                 </div>
//                 <div className="flex gap-8">
//                   <div className="flex items-center space-x-2">
//                     <input type="radio" id="mileageBased" name="triggerType" className="h-4 w-4" />
//                     <Label htmlFor="mileageBased" className="text-sm">
//                       Mileage-Based
//                     </Label>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <input type="radio" id="timeBased" name="triggerType" className="h-4 w-4" />
//                     <Label htmlFor="timeBased" className="text-sm">
//                       Time-Based
//                     </Label>
//                   </div>
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <div className="flex justify-between">
//                   <Label htmlFor="maintenanceTasks" className="text-sm">
//                     Maintenance Tasks
//                   </Label>
//                   <span className="text-red-500">*</span>
//                 </div>
//                 <Input
//                   id="maintenanceTasks"
//                   placeholder="Oil Change, Tire Rotation, Brake Inspection, Fluid Checks"
//                   className="w-full"
//                 />
//               </div>

//               <div className="grid grid-cols-2 gap-4 mt-6">
//                 <Button variant="outline" className="w-full bg-gray-100 hover:bg-gray-200 text-black">
//                   Cancel
//                 </Button>
//                 <Button className="w-full bg-[#0a1929] hover:bg-[#152a3b]">Save Schedule</Button>
//               </div>
//             </div>
//           </TabsContent>
//         </Tabs>
//       </Card>

//       {/* Assign Fleet Modal */}
//       <Card className="w-full max-w-md bg-white rounded-md shadow-md relative">
//         <div className="absolute top-4 right-4 cursor-pointer">
//           <span className="text-gray-500 text-xl">×</span>
//         </div>

//         <Tabs defaultValue="assign" className="w-full">
//           <TabsList className="grid w-full grid-cols-2 mb-4 border-b">
//             <TabsTrigger value="maintenance" className="pb-2">
//               Maintenance Schedules
//             </TabsTrigger>
//             <TabsTrigger value="assign" className="pb-2 border-b-2 border-black">
//               Assign Fleet
//             </TabsTrigger>
//           </TabsList>

//           <TabsContent value="assign" className="p-6">
//             <div className="space-y-6">
//               <div className="space-y-2">
//                 <div className="flex justify-between">
//                   <Label htmlFor="selectVehicle" className="text-sm">
//                     Select Vehicle
//                   </Label>
//                   <span className="text-red-500">*</span>
//                 </div>
//                 <select
//                   id="selectVehicle"
//                   className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
//                 >
//                   <option>- select vehicle -</option>
//                 </select>
//               </div>

//               <div className="space-y-2">
//                 <div className="flex justify-between">
//                   <Label className="text-sm">Assigned to</Label>
//                   <span className="text-red-500">*</span>
//                 </div>
//                 <div className="flex gap-4">
//                   <div className="flex items-center space-x-2">
//                     <input type="radio" id="department" name="assignedTo" className="h-4 w-4" checked />
//                     <Label htmlFor="department" className="text-sm">
//                       Department
//                     </Label>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <input type="radio" id="project" name="assignedTo" className="h-4 w-4" />
//                     <Label htmlFor="project" className="text-sm">
//                       Project
//                     </Label>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <input type="radio" id="client" name="assignedTo" className="h-4 w-4" />
//                     <Label htmlFor="client" className="text-sm">
//                       Client
//                     </Label>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <input type="radio" id="location" name="assignedTo" className="h-4 w-4" />
//                     <Label htmlFor="location" className="text-sm">
//                       Location
//                     </Label>
//                   </div>
//                 </div>

//                 <select className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm mt-2">
//                   <option>- select a Department -</option>
//                 </select>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="purpose" className="text-sm">
//                   Purpose of Assignment
//                 </Label>
//                 <Textarea id="purpose" placeholder="text area" className="w-full h-20" />
//               </div>

//               <div className="space-y-2">
//                 <Label className="text-sm">Select date</Label>
//                 <div className="relative">
//                   <div
//                     className="flex justify-between items-center cursor-pointer"
//                     onClick={() => setShowDatePicker(!showDatePicker)}
//                   >
//                     <h3 className="text-lg font-medium">Enter dates</h3>
//                     <Calendar className="h-5 w-5" />
//                   </div>

//                   {showDatePicker && (
//                     <div className="mt-4 space-y-4">
//                       <div className="flex flex-col">
//                         <Label htmlFor="startDate" className="text-xs mb-1">
//                           Date
//                         </Label>
//                         <Input id="startDate" placeholder="mm/dd/yyyy" className="w-full" />
//                       </div>
//                       <div className="flex flex-col">
//                         <Label htmlFor="endDate" className="text-xs mb-1">
//                           End date
//                         </Label>
//                         <Input id="endDate" placeholder="mm/dd/yyyy" className="w-full" />
//                       </div>
//                       <div className="flex justify-between mt-4">
//                         <Button variant="ghost" size="sm">
//                           Close
//                         </Button>
//                         <div className="space-x-2">
//                           <Button variant="ghost" size="sm">
//                             Cancel
//                           </Button>
//                           <Button variant="ghost" size="sm">
//                             OK
//                           </Button>
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <Button className="w-full bg-[#0a1929] hover:bg-[#152a3b] mt-4">Save Schedule</Button>
//             </div>
//           </TabsContent>
//         </Tabs>
//       </Card>
//     </div>
//   )
return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[80%]">
        <DialogHeader>
          <DialogTitle>Add New Schedule</DialogTitle>
        </DialogHeader>
  
        <Tabs defaultValue="maintenance" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger
            value="maintenance"
            className={`pb-2 text-sm font-normal ${activeTab === "maintenance" ? "border-b-2 border-black font-bold" : ""}`}
            onClick={() => setActiveTab("maintenance")}
            >
            Maintenance Schedules
            </TabsTrigger>
            <TabsTrigger
            value="assign"
            className={`pb-2 text-sm font-normal ${activeTab === "assign" ? "border-b-2 border-black font-bold" : ""}`}
            onClick={() => setActiveTab("assign")}
            >
            Assign Fleet
            </TabsTrigger>
          </TabsList>
  
          <TabsContent value="maintenance" className="p-6">
          <div className="space-y-6 flex w-full justify-between gap-4">
            <div className="w-1/2 flex flex-col gap-6">
            
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="scheduleName" className="text-sm">
                    Schedule Name
                  </Label>
                  <span className="text-red-500">*</span>
                </div>
                <Input id="scheduleName" placeholder="Oil Change - Car fleet" className="w-full" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label className="text-sm">Trigger Type</Label>
                  <span className="text-red-500">*</span>
                </div>
                <div className="flex gap-8">
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="mileageBased" name="triggerType" className="h-4 w-4" />
                    <Label htmlFor="mileageBased" className="text-sm">
                      Mileage-Based
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="timeBased" name="triggerType" className="h-4 w-4" />
                    <Label htmlFor="timeBased" className="text-sm">
                      Time-Based
                    </Label>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-1/2 flex flex-col gap-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label className="text-sm">Apply To</Label>
                  <span className="text-red-500">*</span>
                </div>
                <div className="flex gap-8">
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="specificVehicle" name="applyTo" className="h-4 w-4" />
                    <Label htmlFor="specificVehicle" className="text-sm">
                      Specific Vehicle
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="vehicleType" name="applyTo" className="h-4 w-4" />
                    <Label htmlFor="vehicleType" className="text-sm">
                      Vehicle Type
                    </Label>
                  </div>
                </div>
            
                <div className="w-full flex flex-col gap-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="maintenanceTasks" className="text-sm">
                    Maintenance Tasks
                  </Label>
                  <span className="text-red-500">*</span>
                </div>
                <Input
                  id="maintenanceTasks"
                  placeholder="Oil Change, Tire Rotation, Brake Inspection, Fluid Checks"
                  className="w-full"
                />
              </div>
  
              <div className="grid grid-cols-2 gap-4 mt-6 w-full">
                <Button variant="outline" className="w-full bg-gray-100 hover:bg-gray-200 text-black">
                  Cancel
                </Button>
                <Button className="w-full bg-[#0a1929] hover:bg-[#152a3b]">Save Schedule</Button>
            </div>

            </div>
            </div>
            </div>
            </div>
          </TabsContent>
  
          <TabsContent value="assign" className="p-6">
            <div className="space-y-6 flex w-full justify-between gap-4">
                <div className="w-1/2 flex flex-col gap-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="selectVehicle" className="text-sm">
                    Select Vehicle
                  </Label>
                  <span className="text-red-500">*</span>
                </div>
                <select
                  id="selectVehicle"
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                >
                  <option>- select vehicle -</option>
                </select>
              </div> 
  
              <div className="space-y-2">
                <Label className="text-sm">Select date</Label>
                <div className="relative">
                  <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => setShowDatePicker(!showDatePicker)}
                  >
                    <h3 className="text-lg font-medium">Enter dates</h3>
                    <Calendar className="h-5 w-5" />
                  </div>
  
                  {showDatePicker && (
                    <div className="mt-4 space-y-4">
                      <div className="flex flex-col">
                        <Label htmlFor="startDate" className="text-xs mb-1">
                          Date
                        </Label>
                        <Input id="startDate" placeholder="mm/dd/yyyy" className="w-full" />
                      </div>
                      <div className="flex flex-col">
                        <Label htmlFor="endDate" className="text-xs mb-1">
                          End date
                        </Label>
                        <Input id="endDate" placeholder="mm/dd/yyyy" className="w-full" />
                      </div>
                      <div className="flex justify-between mt-4">
                        <Button variant="ghost" size="sm">
                          Close
                        </Button>
                        <div className="space-x-2">
                          <Button variant="ghost" size="sm">
                            Cancel
                          </Button>
                          <Button variant="ghost" size="sm">
                            OK
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="w-1/2 flex flex-col gap-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label className="text-sm">Assigned to</Label>
                  <span className="text-red-500">*</span>
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="department" name="assignedTo" className="h-4 w-4" checked />
                    <Label htmlFor="department" className="text-sm">
                      Department
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="project" name="assignedTo" className="h-4 w-4" />
                    <Label htmlFor="project" className="text-sm">
                      Project
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="client" name="assignedTo" className="h-4 w-4" />
                    <Label htmlFor="client" className="text-sm">
                      Client
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="location" name="assignedTo" className="h-4 w-4" />
                    <Label htmlFor="location" className="text-sm">
                      Location
                    </Label>
                  </div>
                </div>
  
                <select className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm mt-2">
                  <option>- select a Department -</option>
                </select>
              </div>
  
              <div className="space-y-2">
                <Label htmlFor="purpose" className="text-sm">
                  Purpose of Assignment
                </Label>
                <Textarea id="purpose" placeholder="text area" className="w-full h-20" />
              </div>
  
              <Button className="w-full bg-[#0a1929] hover:bg-[#152a3b] mt-4">Save Schedule</Button>
            </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
