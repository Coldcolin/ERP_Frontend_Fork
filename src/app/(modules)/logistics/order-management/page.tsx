'use client'

import React, { useState } from 'react'
import { Search, Filter, Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import CreateOrderModal from '../_components/CreateOrderModal'

// Order data matching the screenshot
const ordersData = [
  {
    orderId: 'SHP-20250506-581345',
    quantity: 3500,
    origin: 'Apapa Wharf',
    destination: 'Minna, Abuja',
    weight: 50,
    shipmentType: 'Frozen Food',
    status: 'Unscheduled',
  },
  {
    orderId: 'SHP-20250506-5813785',
    quantity: 13000,
    origin: 'Apapa Wharf',
    destination: 'Minna, Abuja',
    weight: 50,
    shipmentType: 'Frozen Food',
    status: 'Scheduled',
  },
  {
    orderId: 'SHP-20250506-5813233',
    quantity: 20000,
    origin: 'Apapa Wharf',
    destination: 'Minna, Abuja',
    weight: 50,
    shipmentType: 'Frozen Food',
    status: 'Completed',
  },
  {
    orderId: 'SHP-20250506-5813211',
    quantity: 100,
    origin: 'Apapa Wharf',
    destination: 'Minna, Abuja',
    weight: 50,
    shipmentType: 'Frozen Food',
    status: 'On route',
  },
  {
    orderId: 'SHP-20250506-5813981',
    quantity: 750,
    origin: 'Apapa Wharf',
    destination: 'Minna, Abuja',
    weight: 50,
    shipmentType: 'Frozen Food',
    status: 'Unscheduled',
  },
  {
    orderId: 'SHP-20250506-5813091',
    quantity: 3500,
    origin: 'Apapa Wharf',
    destination: 'Minna, Abuja',
    weight: 50,
    shipmentType: 'Frozen Food',
    status: 'Scheduled',
  },
  {
    orderId: 'SHP-20250506-5813133',
    quantity: 11500,
    origin: 'Apapa Wharf',
    destination: 'Minna, Abuja',
    weight: 80,
    shipmentType: 'Frozen Food',
    status: 'Unscheduled',
  },
]

const getStatusBadgeStyles = (status: string) => {
  switch (status) {
    case 'Unscheduled':
      return 'bg-red-50 text-red-600 border-red-300 hover:bg-red-50'
    case 'Scheduled':
      return 'bg-blue-50 text-blue-600 border-blue-300 hover:bg-blue-50'
    case 'Completed':
      return 'bg-emerald-100 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
    case 'On route':
      return 'bg-amber-50 text-amber-600 border-amber-300 hover:bg-amber-50'
    default:
      return 'bg-gray-50 text-gray-600 border-gray-300 hover:bg-gray-50'
  }
}

const OrderManagement = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  return (
    <div className="container mx-auto py-6 px-4">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Order Management</h1>
        
        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search Order" 
              className="pl-10 pr-4 h-10 w-48 bg-white border-gray-200"
            />
          </div>

          {/* Filters Button */}
          <Button 
            variant="outline" 
            className="h-10 px-4 bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>

          {/* Add New Order Button */}
          <Button 
            onClick={() => setIsCreateModalOpen(true)}
            className="h-10 px-4 bg-[#0F172A] hover:bg-[#1e293b] text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add new order
          </Button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#0F172A] hover:bg-[#0F172A]">
              <TableHead className="text-white font-medium py-4 px-6">Order ID</TableHead>
              <TableHead className="text-white font-medium py-4 px-6">Quantity</TableHead>
              <TableHead className="text-white font-medium py-4 px-6">Origin</TableHead>
              <TableHead className="text-white font-medium py-4 px-6">Destination</TableHead>
              <TableHead className="text-white font-medium py-4 px-6">Weight(kg)</TableHead>
              <TableHead className="text-white font-medium py-4 px-6">Shipment type</TableHead>
              <TableHead className="text-white font-medium py-4 px-6">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ordersData.map((order, index) => (
              <TableRow 
                key={index} 
                className="bg-gray-50/50 hover:bg-gray-100 border-b border-gray-100"
              >
                <TableCell className="py-4 px-6">
                  <span className="text-blue-900 font-medium text-sm">{order.orderId}</span>
                </TableCell>
                <TableCell className="py-4 px-6 text-gray-700 text-sm">{order.quantity}</TableCell>
                <TableCell className="py-4 px-6 text-gray-700 text-sm">{order.origin}</TableCell>
                <TableCell className="py-4 px-6 text-gray-700 text-sm">{order.destination}</TableCell>
                <TableCell className="py-4 px-6 text-gray-700 text-sm">{order.weight}</TableCell>
                <TableCell className="py-4 px-6 text-gray-700 text-sm">{order.shipmentType}</TableCell>
                <TableCell className="py-4 px-6">
                  <Badge 
                    variant="outline" 
                    className={`rounded-full px-4 py-1 text-xs font-medium ${getStatusBadgeStyles(order.status)}`}
                  >
                    {order.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-gray-100">
          <div className="flex items-center gap-2">
            <Select defaultValue="05">
              <SelectTrigger className="w-16 h-9 border-gray-200">
                <SelectValue placeholder="05" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="05">05</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-gray-500">items per page</span>
          </div>

          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
              onClick={() => setCurrentPage(1)}
            >
              <ChevronLeft className="h-4 w-4" />
              <ChevronLeft className="h-4 w-4 -ml-2" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <Button 
              size="sm" 
              className={`h-8 w-8 p-0 text-sm font-medium ${
                currentPage === 1 
                  ? 'bg-[#0F172A] text-white hover:bg-[#1e293b]' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setCurrentPage(1)}
            >
              1
            </Button>
            <Button 
              size="sm" 
              className={`h-8 w-8 p-0 text-sm font-medium ${
                currentPage === 2 
                  ? 'bg-[#0F172A] text-white hover:bg-[#1e293b]' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setCurrentPage(2)}
            >
              2
            </Button>
            <Button 
              size="sm" 
              className={`h-8 w-8 p-0 text-sm font-medium ${
                currentPage === 3 
                  ? 'bg-[#0F172A] text-white hover:bg-[#1e293b]' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setCurrentPage(3)}
            >
              3
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
              onClick={() => setCurrentPage(Math.min(3, currentPage + 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
              onClick={() => setCurrentPage(3)}
            >
              <ChevronRight className="h-4 w-4" />
              <ChevronRight className="h-4 w-4 -ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Create Order Modal */}
      <CreateOrderModal 
        open={isCreateModalOpen} 
        onOpenChange={setIsCreateModalOpen} 
      />
    </div>
  )
}

export default OrderManagement
