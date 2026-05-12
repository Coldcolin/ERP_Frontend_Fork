'use client'

import React, { useState } from 'react'
import { ChevronLeft, Upload, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'

// Mock data for orders in dropdown
const ordersData = [
  { orderId: 'SHP-20250506-5813133', route: 'Lagos → Abuja' },
  { orderId: 'SHP-20250506-5813133', route: 'Ibadan → Zamfara' },
  { orderId: 'SHP-20250506-5813133', route: 'Lagos → Delta' },
  { orderId: 'SHP-20250506-5813133', route: 'Lagos → Delta' },
]

// Active deliveries data matching the screenshot
const activeDeliveriesData = [
  {
    orderId: 'SHP-20250506-5813345',
    origin: 'Apapa Wharf',
    destination: 'Minna, Abuja',
    volume: '50 tons',
    shipmentType: 'Frozen Food',
    status: 'In transit',
  },
  {
    orderId: 'SHP-20250506-5813785',
    origin: 'Apapa Wharf',
    destination: 'Minna, Abuja',
    volume: '50 tons',
    shipmentType: 'Frozen Food',
    status: 'In transit',
  },
  {
    orderId: 'SHP-20250506-5813233',
    origin: 'Apapa Wharf',
    destination: 'Minna, Abuja',
    volume: '50 tons',
    shipmentType: 'Frozen Food',
    status: 'In transit',
  },
  {
    orderId: 'SHP-20250506-5813211',
    origin: 'Apapa Wharf',
    destination: 'Minna, Abuja',
    volume: '50 tons',
    shipmentType: 'Frozen Food',
    status: 'In transit',
  },
  {
    orderId: 'SHP-20250506-5813981',
    origin: 'Apapa Wharf',
    destination: 'Minna, Abuja',
    volume: '50 tons',
    shipmentType: 'Frozen Food',
    status: 'In transit',
  },
  {
    orderId: 'SHP-20250506-5813091',
    origin: 'Apapa Wharf',
    destination: 'Minna, Abuja',
    volume: '50 tons',
    shipmentType: 'Frozen Food',
    status: 'Scheduled',
  },
  {
    orderId: 'SHP-20250506-5813133',
    origin: 'Apapa Wharf',
    destination: 'Minna, Abuja',
    volume: '50 tons',
    shipmentType: 'Frozen Food',
    status: 'In transit',
  },
]

const getStatusBadgeStyles = (status: string) => {
  switch (status) {
    case 'In transit':
      return 'bg-blue-50 text-blue-700 border-blue-300 hover:bg-blue-50 rounded-full px-4 py-1'
    case 'Scheduled':
      return 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-100 rounded-full px-4 py-1'
    case 'Completed':
      return 'bg-emerald-100 text-emerald-700 border-emerald-300 hover:bg-emerald-100 rounded-full px-4 py-1'
    default:
      return 'bg-gray-50 text-gray-600 border-gray-300 hover:bg-gray-50 rounded-full px-4 py-1'
  }
}

const DeliveryExecution = () => {
  const [activeTab, setActiveTab] = useState<'update' | 'active'>('update')
  const [selectedOrder, setSelectedOrder] = useState('')
  const [deliveryStatus, setDeliveryStatus] = useState('complete')
  const [actualTime, setActualTime] = useState('')
  const [incidentReport, setIncidentReport] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)

  const totalPages = Math.ceil(activeDeliveriesData.length / itemsPerPage)
  const paginatedData = activeDeliveriesData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleUpdateDelivery = () => {
    // Handle form submission
    console.log({
      selectedOrder,
      deliveryStatus,
      actualTime,
      incidentReport,
    })
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Delivery Execution</h1>
        <button className="flex items-center gap-1 text-sm text-gray-500 mt-1 hover:text-gray-700">
          <ChevronLeft className="h-4 w-4" />
          back
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('update')}
            className={`pb-3 text-sm font-medium transition-colors relative ${
              activeTab === 'update'
                ? 'text-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Update delivery status
            {activeTab === 'update' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className={`pb-3 text-sm font-medium transition-colors relative ${
              activeTab === 'active'
                ? 'text-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Active deliveries
            {activeTab === 'active' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
            )}
          </button>
        </div>
      </div>

      {/* Update Delivery Status Tab */}
      {activeTab === 'update' && (
        <div className="space-y-5">
          {/* Pre-trip vehicle inspection */}
          <div>
            <Label className="text-sm font-medium text-gray-900 mb-3 block">
              Pre-trip vehicle inspection
            </Label>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Select Order */}
              <div>
                <Label className="text-sm text-gray-700 mb-2 block">Select order</Label>
                <Select value={selectedOrder} onValueChange={setSelectedOrder}>
                  <SelectTrigger className="w-full h-11 border-gray-200 bg-white">
                    <SelectValue placeholder="-Select an order-" />
                  </SelectTrigger>
                  <SelectContent>
                    {ordersData.map((order, index) => (
                      <SelectItem key={index} value={`${order.orderId}-${index}`}>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">{order.orderId}</span>
                          <span className="text-xs text-gray-500">{order.route}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Selected Orders List */}
                <div className="mt-3 space-y-2">
                  {ordersData.map((order, index) => (
                    <div key={index} className="text-sm">
                      <span className="font-medium text-gray-900">{order.orderId}</span>
                      <span className="text-gray-500"> — {order.route}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Status */}
              <div>
                <Label className="text-sm text-gray-700 mb-2 block">Delivery Status</Label>
                <RadioGroup
                  value={deliveryStatus}
                  onValueChange={setDeliveryStatus}
                  className="space-y-3"
                >
                  <div className="flex items-start gap-3 p-3 border border-gray-200 rounded-md bg-gray-50">
                    <RadioGroupItem value="complete" id="complete" className="mt-0.5" />
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-gray-900" />
                      <div>
                        <Label htmlFor="complete" className="text-sm font-medium cursor-pointer">
                          Complete delivery
                        </Label>
                        <p className="text-xs text-gray-500">All shipment delivered successfully</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 border border-gray-200 rounded-md bg-gray-50">
                    <RadioGroupItem value="in_progress" id="in_progress" className="mt-0.5" />
                    <div>
                      <Label htmlFor="in_progress" className="text-sm font-medium cursor-pointer">
                        Delivery in progress
                      </Label>
                      <p className="text-xs text-gray-500">shipment is still in transit</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 border border-gray-200 rounded-md bg-gray-50">
                    <RadioGroupItem value="in_progress_2" id="in_progress_2" className="mt-0.5" />
                    <div>
                      <Label htmlFor="in_progress_2" className="text-sm font-medium cursor-pointer">
                        Delivery in progress
                      </Label>
                      <p className="text-xs text-gray-500">shipment is still in transit</p>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>

          {/* Actual Time of Delivery */}
          <div>
            <Label className="text-sm text-gray-700 mb-2 block">Actual Time of Delivery</Label>
            <div className="relative">
              <Input
                type="text"
                placeholder="enter actual time of delivery"
                value={actualTime}
                onChange={(e) => setActualTime(e.target.value)}
                className="h-11 border-gray-200 pr-10"
              />
              <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Upload Signed POD / Waybill */}
          <div>
            <Label className="text-sm text-gray-700 mb-2 block">Upload Signed POD / Waybill</Label>
            <div className="border border-dashed border-gray-300 rounded-md p-8 text-center bg-gray-50/50">
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 flex items-center justify-center">
                  <Upload className="h-5 w-5 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500">
                  Drag & Drop Delivery Confirmation Image / Video / File
                </p>
                <p className="text-xs text-gray-400">(acceptable file format - jpg, png, pdf, jpeg)</p>
                <p className="text-xs text-gray-400">Or</p>
                <Button
                  variant="default"
                  size="sm"
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs px-4"
                >
                  Upload Files
                </Button>
              </div>
            </div>
          </div>

          {/* Incident Report */}
          <div>
            <Label className="text-sm text-gray-700 mb-2 block">Incident report (optional)</Label>
            <Textarea
              placeholder="Report any delay, accident or issues during transit"
              value={incidentReport}
              onChange={(e) => setIncidentReport(e.target.value)}
              className="min-h-[80px] border-gray-200 resize-none"
            />
          </div>

          {/* Update Button */}
          <Button
            onClick={handleUpdateDelivery}
            className="bg-slate-900 hover:bg-slate-800 text-white px-8"
          >
            Update delivery status
          </Button>
        </div>
      )}

      {/* Active Deliveries Tab */}
      {activeTab === 'active' && (
        <div>
          {/* Table Header */}
          <div className="bg-slate-900 text-white rounded-t-md">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="text-white font-medium py-4">Order ID</TableHead>
                  <TableHead className="text-white font-medium">Origin</TableHead>
                  <TableHead className="text-white font-medium">Destination</TableHead>
                  <TableHead className="text-white font-medium">Volume</TableHead>
                  <TableHead className="text-white font-medium">Shipment type</TableHead>
                  <TableHead className="text-white font-medium text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
            </Table>
          </div>

          {/* Table Body */}
          <div className="bg-white rounded-b-md border border-t-0 border-gray-200">
            <Table>
              <TableBody>
                {paginatedData.map((delivery, index) => (
                  <TableRow key={index} className="hover:bg-gray-50 border-b border-gray-100 last:border-b-0">
                    <TableCell className="font-medium text-blue-900 py-4">
                      {delivery.orderId}
                    </TableCell>
                    <TableCell className="text-gray-600">{delivery.origin}</TableCell>
                    <TableCell className="text-gray-600">{delivery.destination}</TableCell>
                    <TableCell className="text-gray-600">{delivery.volume}</TableCell>
                    <TableCell className="text-gray-600">{delivery.shipmentType}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline" className={getStatusBadgeStyles(delivery.status)}>
                        {delivery.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => {
                  setItemsPerPage(Number(value))
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger className="w-16 h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">05</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-gray-500">items per page</span>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </Button>

              {[1, 2, 3].map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? 'default' : 'ghost'}
                  size="sm"
                  className={`h-8 w-8 text-xs ${
                    currentPage === page
                      ? 'bg-slate-900 text-white hover:bg-slate-800'
                      : 'text-gray-600'
                  }`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DeliveryExecution
