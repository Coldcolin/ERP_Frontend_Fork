"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { ArrowLeft, Download, Edit, Plus, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
// import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
// import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import {useGetSingleTripQuery} from "@/lib/redux/api/tripsAPI"

// interface TripData {
//   id: string
//   status: string
//   client: {
//     name: string
//     shipmentDescription: string
//     commodityType: string
//     weight: string
//     packages: number
//   }
//   assignment: {
//     driver: string
//     vehicle: string
//     departure: string
//     eta: string
//   }
//   expenses: {
//     revenue: string
//     breakdown: {
//       profit: number
//       fuel: number
//       toll: number
//       maintenance: number
//     }
//   }
//   documents: {
//     vehiclePermit: boolean
//     roadManifest: boolean
//     tollReceipt: boolean
//     maintenanceReceipt: boolean
//     proofOfDelivery: boolean
//     fuelReceipt: boolean
//   }
// }

export default function OperationsManagementPage() {
  const params = useParams()
  const tripId = params.id as string
  const { data: tripData, isLoading } = useGetSingleTripQuery(tripId);

  // const [tripData, setTripData] = useState<TripData | null>(null)
  // const [loading, setLoading] = useState(true)
  const [error] = useState<string | null>(null)

  // useEffect(() => {
  //   const fetchTripData = async () => {
  //     try {
  //       setLoading(true)
  //       const response = await fetch(`/api/trips/${tripId}`)

  //       if (!response.ok) {
  //         throw new Error("Failed to fetch trip data")
  //       }

  //       const data = await response.json()
  //       // setTripData(data)
  //     } catch (err) {
  //       setError(err instanceof Error ? err.message : "An error occurred")
  //     } finally {
  //       setLoading(false)
  //     }
  //   }

  //   if (tripId) {
  //     fetchTripData()
  //   }
  // }, [tripId])

  const handleEditTrip = () => {
    // Handle edit trip functionality
    console.log("Edit trip:", tripId)
  }

  const handleAddExpenses = () => {
    // Handle add expenses functionality
    console.log("Add expenses for trip:", tripId)
  }

  const handleDownloadReport = () => {
    // Handle download report functionality
    console.log("Download report for trip:", tripId)
  }

  const handleGoBack = () => {
    window.history.back()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading trip details...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <Alert className="mt-6">
            <AlertDescription>Error loading trip data: {error}</AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  if (!tripData) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <Alert className="mt-6">
            <AlertDescription>Trip not found</AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "in-progress":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleGoBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-semibold text-gray-900">Operations Management</h1>
        </div>

        {/* Trip ID Section */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-lg font-medium text-gray-900">Trip ID:</span>
            <span className="text-lg font-medium text-blue-600">{tripData?._id}</span>
            <Badge
              variant="secondary"
              className={`${getStatusColor(tripData?.status)} hover:${getStatusColor(tripData?.status)}`}
            >
              {tripData?.status}
            </Badge>
          </div>
          <div className="flex items-center gap-3">
            <Button className="bg-gray-800 hover:bg-gray-900 text-white" onClick={handleEditTrip}>
              <Edit className="h-4 w-4 mr-2" />
              Edit trip
            </Button>
            <Button variant="outline" onClick={handleAddExpenses}>
              <Plus className="h-4 w-4 mr-2" />
              Add expenses
            </Button>
            <Button className="bg-gray-800 hover:bg-gray-900 text-white" onClick={handleDownloadReport}>
              <Download className="h-4 w-4 mr-2" />
              Download Report
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipment / Client Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Shipment / Client Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Client name</span>
                    <p className="text-sm text-gray-900 mt-1">{tripData?.client?.companyName}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Shipment Description</span>
                    {/* <p className="text-sm text-gray-900 mt-1">{tripData.client.shipmentDescription}</p> */}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Commodity Type</span>
                    {/* <p className="text-sm text-gray-900 mt-1">{tripData.client.commodityType}</p> */}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Weight / Volume</span>
                    {/* <p className="text-sm text-gray-900 mt-1">{tripData.client.weight}</p> */}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Number of Packages</span>
                    {/* <p className="text-sm text-gray-900 mt-1">{tripData.client.packages}</p> */}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Assignment Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Assignment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Assigned Driver</span>
                    <p className="text-sm text-gray-900 mt-1">{tripData?.driver?.personalInfo?.name}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Assigned Vehicle</span>
                    <p className="text-sm text-blue-600 mt-1">{tripData?.vehicle?.registration}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Departure</span>
                    <p className="text-sm text-gray-900 mt-1">{tripData?.startLocation}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-600">ETA</span>
                    {/* <p className="text-sm text-gray-900 mt-1">{tripData.assignment.eta}</p> */}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Logistics Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Logistics Details</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">Additional logistics information will be displayed here.</p>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Trip Expenses */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Trip Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-sm font-medium text-gray-600">Revenue</span>
                  <span className="text-sm font-semibold text-gray-900">{tripData?.cargo?.expectedRevenue}</span>
                </div>

                {/* Improved Pie Chart */}
                {/* <div className="h-80 w-full">
                  <ChartContainer
                    config={{
                      profit: {
                        label: "Profit",
                        color: "hsl(142, 76%, 36%)",
                      },
                      fuel: {
                        label: "Fuel expense",
                        color: "hsl(0, 84%, 60%)",
                      },
                      toll: {
                        label: "Toll fee",
                        color: "hsl(221, 83%, 53%)",
                      },
                      maintenance: {
                        label: "Maintenance",
                        color: "hsl(43, 96%, 56%)",
                      },
                    }}
                    className="h-full w-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            {
                              name: "Profit",
                              value: tripData.expenses.breakdown.profit,
                              fill: "hsl(142, 76%, 36%)",
                            },
                            {
                              name: "Fuel expense",
                              value: tripData.expenses.breakdown.fuel,
                              fill: "hsl(0, 84%, 60%)",
                            },
                            {
                              name: "Toll fee",
                              value: tripData.expenses.breakdown.toll,
                              fill: "hsl(221, 83%, 53%)",
                            },
                            {
                              name: "Maintenance",
                              value: tripData.expenses.breakdown.maintenance,
                              fill: "hsl(43, 96%, 56%)",
                            },
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ value }) => `${value}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {[
                            { fill: "hsl(142, 76%, 36%)" },
                            { fill: "hsl(0, 84%, 60%)" },
                            { fill: "hsl(221, 83%, 53%)" },
                            { fill: "hsl(43, 96%, 56%)" },
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <ChartTooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0]
                              return (
                                <div className="rounded-lg border bg-background p-2 shadow-sm">
                                  <div className="grid grid-cols-2 gap-2">
                                    <div className="flex flex-col">
                                      <span className="text-[0.70rem] uppercase text-muted-foreground">
                                        {data.name}
                                      </span>
                                      <span className="font-bold text-muted-foreground">{data.value}%</span>
                                    </div>
                                  </div>
                                </div>
                              )
                            }
                            return null
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div> */}

                {/* Improved Legend */}
                {/* <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "hsl(142, 76%, 36%)" }}></div>
                      <span className="text-sm text-gray-700">Profit</span>
                    </div>
                    <span className="text-sm font-medium text-gray-600">{tripData.expenses.revenue}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "hsl(0, 84%, 60%)" }}></div>
                      <span className="text-sm text-gray-700">Fuel expense</span>
                    </div>
                    <span className="text-sm font-medium text-gray-600">{tripData.expenses.revenue}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "hsl(221, 83%, 53%)" }}></div>
                      <span className="text-sm text-gray-700">Toll fee</span>
                    </div>
                    <span className="text-sm font-medium text-gray-600">{tripData.expenses.revenue}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "hsl(43, 96%, 56%)" }}></div>
                      <span className="text-sm text-gray-700">Maintenance</span>
                    </div>
                    <span className="text-sm font-medium text-gray-600">{tripData.expenses.revenue}</span>
                  </div>
                </div> */}
              </CardContent>
            </Card>

            {/* Documents */}
            {/* <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg">
                    <FileText
                      className={`h-8 w-8 mb-2 ${tripData.documents.vehiclePermit ? "text-red-500" : "text-gray-400"}`}
                    />
                    <span className="text-xs text-center text-gray-600">Vehicle permit.pdf</span>
                  </div>
                  <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg">
                    <FileText
                      className={`h-8 w-8 mb-2 ${tripData.documents.roadManifest ? "text-red-500" : "text-gray-400"}`}
                    />
                    <span className="text-xs text-center text-gray-600">Road manifest.pdf</span>
                  </div>
                  <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg">
                    <Upload
                      className={`h-8 w-8 mb-2 ${tripData.documents.tollReceipt ? "text-green-500" : "text-gray-400"}`}
                    />
                    <span className="text-xs text-center text-gray-600">Toll payment receipt</span>
                  </div>
                  <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg">
                    <Upload
                      className={`h-8 w-8 mb-2 ${tripData.documents.maintenanceReceipt ? "text-green-500" : "text-gray-400"}`}
                    />
                    <span className="text-xs text-center text-gray-600">maintenance receipt</span>
                  </div>
                  <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg">
                    <Upload
                      className={`h-8 w-8 mb-2 ${tripData.documents.proofOfDelivery ? "text-green-500" : "text-gray-400"}`}
                    />
                    <span className="text-xs text-center text-gray-600">upload proof of delivery</span>
                  </div>
                  <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg">
                    <Upload
                      className={`h-8 w-8 mb-2 ${tripData.documents.fuelReceipt ? "text-green-500" : "text-gray-400"}`}
                    />
                    <span className="text-xs text-center text-gray-600">upload fuel receipt</span>
                  </div>
                </div>
              </CardContent>
            </Card> */}
          </div>
        </div>
      </div>
    </div>
  )
}
