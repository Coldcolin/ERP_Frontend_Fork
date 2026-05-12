'use client'

import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/lib/redux/store'
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, Tooltip } from 'recharts'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

// Mock data for charts
const expensesData = [
  { name: 'Fuel Expenses', value: 3250000, color: '#EF4444' },
  { name: 'Toll Expenses', value: 950000, color: '#F97316' },
  { name: 'Maintenance expenses', value: 1250000, color: '#22C55E' },
]

const revenueData = [
  { name: 'Net Profit', value: 1550000, color: '#22C55E' },
  { name: 'Expenses', value: 5000000, color: '#EF4444' },
]

const tripMetricsData = [
  { name: 'Active Trips', value: 200, color: '#6366F1' },
  { name: 'trips delivered on/before ETA', value: 1380, color: '#22C55E' },
  { name: 'trips delivered after ETA', value: 58, color: '#EF4444' },
]

const incidentsData = [
  { name: 'Accidents', value: 18, percentage: '10%', color: '#EF4444' },
  { name: 'Breakdown', value: 80, percentage: '50%', color: '#F97316' },
  { name: 'Cancelled Trips', value: 30, percentage: '30%', color: '#22C55E' },
]

const areaChartData = [
  { value: 30 },
  { value: 45 },
  { value: 35 },
  { value: 50 },
  { value: 40 },
  { value: 60 },
]

const activeDeliveries = [
  {
    orderId: 'SHP-20250506-5813091',
    origin: 'Apapa Wharf',
    destination: 'Minna, Abuja',
    volume: '50 tons',
    shipmentType: 'Frozen Food',
    status: 'In transit',
  },
  {
    orderId: 'SHP-20250506-5813133',
    origin: 'Apapa Wharf',
    destination: 'Minna, Abuja',
    volume: '50 tons',
    shipmentType: 'Frozen Food',
    status: 'In transit',
  },
  {
    orderId: 'SHP-20250506-5813145',
    origin: 'Lagos Port',
    destination: 'Kano',
    volume: '30 tons',
    shipmentType: 'Electronics',
    status: 'Pending',
  },
  {
    orderId: 'SHP-20250506-5813156',
    origin: 'Apapa Wharf',
    destination: 'Port Harcourt',
    volume: '45 tons',
    shipmentType: 'Raw Materials',
    status: 'In transit',
  },
  {
    orderId: 'SHP-20250506-5813167',
    origin: 'Tin Can',
    destination: 'Ibadan',
    volume: '25 tons',
    shipmentType: 'Consumer Goods',
    status: 'Delivered',
  },
]

const LogisticsDashboard = () => {
  const user = useSelector((state: RootState) => state.auth.user)
  const totalRevenue = 6550000
  const netProfit = 1550000
  const totalTrips = 1638

  return (
    <div className="container mx-auto py-2 pb-8">
      <h1 className="text-2xl font-bold mb-6">Welcome, {user?.firstName || 'Cynthia'} {user?.lastName || 'Chidera'}!</h1>

      {/* Top Row - Expenses and Revenue */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Expenses Breakdown */}
        <div className="bg-white rounded-lg border shadow-sm p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">Expenses Breakdown</h3>
            <Select defaultValue="month">
              <SelectTrigger className="w-[140px] h-8 text-sm">
                <SelectValue placeholder="select month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">select month</SelectItem>
                <SelectItem value="january">January</SelectItem>
                <SelectItem value="february">February</SelectItem>
                <SelectItem value="march">March</SelectItem>
                <SelectItem value="april">April</SelectItem>
                <SelectItem value="may">May</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-3">
            {expensesData.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-1 h-6 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-gray-500 text-sm flex-1">{item.name}</span>
                <span className="font-medium text-sm">₦{item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Breakdown */}
        <div className="bg-white rounded-lg border shadow-sm p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">Revenue Breakdown</h3>
            <Select defaultValue="month">
              <SelectTrigger className="w-[140px] h-8 text-sm">
                <SelectValue placeholder="select month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">select month</SelectItem>
                <SelectItem value="january">January</SelectItem>
                <SelectItem value="february">February</SelectItem>
                <SelectItem value="march">March</SelectItem>
                <SelectItem value="april">April</SelectItem>
                <SelectItem value="may">May</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-6">
            <div className="w-32 h-32 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={revenueData}
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={55}
                    dataKey="value"
                  >
                    {revenueData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold">{totalTrips}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-green-500"></div>
                <span className="text-sm text-gray-500">Total Revenue</span>
                <span className="font-semibold text-green-600 ml-2">₦{totalRevenue.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-red-500"></div>
                <span className="text-sm text-gray-500">Net Profit</span>
                <span className="font-semibold text-green-600 ml-6">₦{netProfit.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Second Row - Trip Metrics and Incidents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Trip Metrics */}
        <div className="bg-white rounded-lg border shadow-sm p-4">
          <h3 className="font-semibold text-lg mb-4">Trip Metrics</h3>
          <div className="flex items-center gap-6">
            <div className="w-32 h-32 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={tripMetricsData}
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={55}
                    dataKey="value"
                  >
                    {tripMetricsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold">{totalTrips}</span>
              </div>
            </div>
            <div className="space-y-3 flex-1">
              {tripMetricsData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm text-gray-500">{item.name}</span>
                  </div>
                  <span className="font-medium text-sm">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Incidents Metrics */}
        <div className="bg-white rounded-lg border shadow-sm p-4">
          <h3 className="font-semibold text-lg mb-2">Incidents Metrics</h3>
          <p className="text-xs text-gray-400 mb-4">major re-occurring incidents rate summary</p>
          <div className="grid grid-cols-3 gap-4">
            {incidentsData.map((item, index) => (
              <div key={index} className={`rounded-lg p-3 border ${
                item.name === 'Accidents' ? 'bg-red-50 border-red-200' :
                item.name === 'Breakdown' ? 'bg-orange-50 border-orange-200' :
                'bg-green-50 border-green-200'
              }`}>
                <div className="text-sm font-medium text-gray-700 mb-1">{item.name}</div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-2xl font-bold">{item.value}</span>
                </div>
                <div className="text-xs text-gray-500 mb-2">{item.percentage}</div>
                <div className="h-12 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={areaChartData}>
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke={item.color}
                        fill={`${item.color}40`}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Delivery Section */}
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="bg-black text-white rounded-t-lg px-6 py-4">
          <h3 className="text-lg font-semibold">Active Delivery</h3>
        </div>
        <div className="bg-gray-50 px-6 py-4">
          <Table>
            <TableHeader>
              <TableRow className="border-none hover:bg-transparent">
                <TableHead className="text-gray-600 font-medium">Order ID</TableHead>
                <TableHead className="text-gray-600 font-medium">Origin</TableHead>
                <TableHead className="text-gray-600 font-medium">Destination</TableHead>
                <TableHead className="text-gray-600 font-medium">Volume</TableHead>
                <TableHead className="text-gray-600 font-medium">Shipment type</TableHead>
                <TableHead className="text-gray-600 font-medium">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeDeliveries.map((delivery, index) => (
                <TableRow key={index} className="bg-white border-b border-gray-100">
                  <TableCell className="font-medium text-blue-900">{delivery.orderId}</TableCell>
                  <TableCell className="text-gray-600">{delivery.origin}</TableCell>
                  <TableCell className="text-gray-600">{delivery.destination}</TableCell>
                  <TableCell className="text-gray-600">{delivery.volume}</TableCell>
                  <TableCell className="text-gray-600">{delivery.shipmentType}</TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        delivery.status === 'In transit' 
                          ? 'border-blue-300 text-blue-700 bg-blue-50' :
                        delivery.status === 'Pending'
                          ? 'border-yellow-300 text-yellow-700 bg-yellow-50' :
                        delivery.status === 'Delivered'
                          ? 'border-green-300 text-green-700 bg-green-50' :
                          'border-gray-300 text-gray-700 bg-gray-50'
                      }`}
                    >
                      {delivery.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t">
          <div className="flex items-center gap-2">
            <Select defaultValue="5">
              <SelectTrigger className="w-[60px] h-8">
                <SelectValue placeholder="05" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">05</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-gray-500">items per page</span>
          </div>
          <div className="flex items-center gap-1">
            <button className="px-2 py-1 text-gray-400 hover:text-gray-600">
              &lt;&lt;
            </button>
            <button className="px-2 py-1 text-gray-400 hover:text-gray-600">
              &lt;
            </button>
            <button className="px-3 py-1 bg-blue-900 text-white rounded text-sm font-medium">
              1
            </button>
            <button className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded text-sm">
              2
            </button>
            <button className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded text-sm">
              3
            </button>
            <button className="px-2 py-1 text-gray-400 hover:text-gray-600">
              &gt;
            </button>
            <button className="px-2 py-1 text-gray-400 hover:text-gray-600">
              &gt;&gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LogisticsDashboard