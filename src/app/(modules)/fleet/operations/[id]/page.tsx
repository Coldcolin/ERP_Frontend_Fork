"use client"
import { ArrowLeft, Download, Edit, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import Link from "next/link"
// import { useRouter } from "next/navigation"

type Props = {
  params: {
    id: string;
  };
};
export default function OperationsManagement({ params }: Props) {
  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Operations Management</h1>
        <Link href={`/fleet/operations`} className="flex items-center text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-4 w-4 mr-1" />
          back
        </Link>
      </div>

      <div className="flex flex-wrap items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-sm">Trip ID: </span>
            <span className="font-medium text-blue-600">{params.id}</span>
          </div>
          <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100 px-3">
            Scheduled
          </Badge>
        </div>
        <div className="flex gap-2 mt-2 sm:mt-0">
          <Button variant="outline" className="flex items-center gap-1 border-gray-300">
            <Edit className="h-4 w-4" />
            <span>Edit trip</span>
          </Button>
          <Button variant="outline" className="flex items-center gap-1 border-gray-300">
            <Plus className="h-4 w-4" />
            <span>Add expenses</span>
          </Button>
          <Button className="flex items-center gap-1 bg-gray-900 text-white hover:bg-gray-800">
            <Download className="h-4 w-4" />
            <span>Download Report</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shipment / Client Details */}
        <Card className="p-6 bg-gray-50">
          <h2 className="text-lg font-bold mb-4">Shipment / Client Details</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm font-medium">Client name</div>
              <div className="text-sm">FreshFoods Ltd.</div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm font-medium">Shipment Description</div>
              <div className="text-sm">Handle with cold chain integrity</div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm font-medium">Commodity Type</div>
              <div className="text-sm">Frozen Chicken</div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm font-medium">Weight / Volume</div>
              <div className="text-sm">5,000 kg</div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm font-medium">Number of Packages</div>
              <div className="text-sm">200</div>
            </div>
          </div>
        </Card>

        {/* Trip Expenses */}
        <Card className="p-6 bg-gray-50">
          <h2 className="text-lg font-bold mb-4">Trip Expenses</h2>
          <div className="mb-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm font-medium">Revenue</div>
              <div className="text-sm">unavailable</div>
            </div>
          </div>
          <div className="flex justify-center my-4">
            <ExpensesChart />
          </div>
          <div className="grid grid-cols-1 gap-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-500"></div>
              <div className="text-sm">Profit - unavailable</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500"></div>
              <div className="text-sm">Fuel expense - unavailable</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500"></div>
              <div className="text-sm">Toll fee - unavailable</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500"></div>
              <div className="text-sm">maintenance - unavailable</div>
            </div>
          </div>
        </Card>

        {/* Assignment Details */}
        <Card className="p-6 bg-gray-50">
          <h2 className="text-lg font-bold mb-4">Assignment Details</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm font-medium">Assigned Driver</div>
              <div className="text-sm">DRV-78220 James Okoro</div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm font-medium">Assigned Vehicle</div>
              <div className="text-sm">
                <span className="text-blue-600">NWUPD1</span> Mercedes Actros 1845
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm font-medium">Departure</div>
              <div className="text-sm">Mar 21 - 9:00 AM</div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm font-medium">ETA</div>
              <div className="text-sm">Mar 22 - 11:00 AM</div>
            </div>
          </div>
        </Card>

        {/* Documents */}
        <Card className="p-6 bg-gray-50">
          <h2 className="text-lg font-bold mb-4">Documents</h2>
          <div className="grid grid-cols-4 gap-4">
            <DocumentItem type="vehicle-manifest" />
            <DocumentItem type="load-manifest" />
            <DocumentItem type="toll-receipt" />
            <DocumentItem type="maintenance-receipt" />
            <DocumentItem type="delivery-proof" />
            <DocumentItem type="fuel-receipt" />
          </div>
        </Card>
      </div>
    </div>
  )
}

function ExpensesChart() {
  return (
    <div className="relative w-32 h-32">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Profit - Green */}
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="transparent"
          stroke="#10b981"
          strokeWidth="40"
          strokeDasharray="62.5 187.5"
          transform="rotate(-90 50 50)"
        />
        {/* Fuel - Red */}
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="transparent"
          stroke="#ef4444"
          strokeWidth="40"
          strokeDasharray="62.5 187.5"
          transform="rotate(0 50 50)"
        />
        {/* Toll - Blue */}
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="transparent"
          stroke="#3b82f6"
          strokeWidth="40"
          strokeDasharray="6.25 193.75"
          transform="rotate(90 50 50)"
        />
        {/* Maintenance - Yellow */}
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="transparent"
          stroke="#eab308"
          strokeWidth="40"
          strokeDasharray="62.5 187.5"
          transform="rotate(180 50 50)"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-xs font-medium text-center">
          <div>25%</div>
          <div>25%</div>
          <div>25%</div>
        </div>
      </div>
    </div>
  )
}

function DocumentItem({ type }: { type: string }) {
  const getIcon = () => {
    switch (type) {
      case "vehicle-manifest":
      case "load-manifest":
        return (
          <div className="bg-gray-200 rounded-md p-2 flex items-center justify-center">
            <div className="w-8 h-10 bg-gray-400 rounded-sm flex items-center justify-center">
              <span className="text-xs text-white">PDF</span>
            </div>
          </div>
        )
      case "toll-receipt":
      case "maintenance-receipt":
      case "delivery-proof":
      case "fuel-receipt":
        return (
          <div className="bg-gray-200 rounded-md p-2 flex items-center justify-center">
            <div className="w-8 h-10 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                />
              </svg>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  const getLabel = () => {
    switch (type) {
      case "vehicle-manifest":
        return "vehicle manifest.pdf"
      case "load-manifest":
        return "load manifest.pdf"
      case "toll-receipt":
        return "toll payment receipt"
      case "maintenance-receipt":
        return "maintenance receipt"
      case "delivery-proof":
        return "upload proof of delivery"
      case "fuel-receipt":
        return "upload fuel receipt"
      default:
        return ""
    }
  }

  return (
    <div className="flex flex-col items-center">
      {getIcon()}
      <div className="text-xs text-center mt-1">{getLabel()}</div>
    </div>
  )
}
