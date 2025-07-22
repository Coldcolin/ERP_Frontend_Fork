import React from 'react'
import { ArrowLeft, FileText, Download, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import pdfImd from "@/assets/Group.png"
import Image from "next/image"

const documents:any = [
  {
    id: 1,
    name: "kamoru-driver-license.pdf",
    type: "pdf",
    url: "#"
  },
  {
    id: 2,
    name: "kamoru-national-idcard.pdf",
    type: "pdf",
    url: "#"
  },
  {
    id: 3,
    name: "kamoru-road-worthiness.pdf",
    type: "pdf",
    url: "#"
  },
  {
    id: 4,
    name: "kamoru-medical-fitness.pdf",
    type: "pdf",
    url: "#"
  },
  {
    id: 5,
    name: "kamoru-vehicle-license.pdf",
    type: "pdf",
    url: "#"
  },
  {
    id: 6,
    name: "kamoru-proof-of-ownership.pdf",
    type: "pdf",
    url: "#"
  }
];

const DriverDetails = () => {
  return (
    <div className="min-h-screen bg-white">
    {/* Header */}
    <div className="bg-white ">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-4 h-4 mr-2" />
              back
            </Button>
            <h1 className="text-2xl font-semibold text-gray-900">Driver Details</h1>
          </div>
        </div>
      </div>
    </div>

    {/* Driver ID and Actions */}
    <div className="max-w-7xl  mx-auto px-6 py-6">
      <div className="flex items-center bg-[#F2F2F7] px-5 py-5 justify-between mb-8">
        <div className="flex items-center gap-4">
          <span className="font-bold text-black ">Driver ID:</span>
          <span className="font-semibold text-red-600">DRV-78220</span>
          <Button variant="link" className="text-blue-500 hover:text-blue-600 p-0 h-auto font-normal">
            See performance metrics
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="text-gray-700 border-gray-300 bg-transparent">
            ✏️ Edit driver details
          </Button>
          <Button className="bg-gray-900 hover:bg-gray-800 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Assign Vehicle
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 bg-[#F2F2F7]  lg:grid-cols-2 gap-8">
        {/* Left Side - Driver Information */}
        <div className="bg-[#F2F2F7]  p-6 h-fit ">
          {/* Driver Profile */}
          <div className="flex  items-center gap-4  mb-8">
          <div className="w-16 h-16 border-2 overflow-hidden bg-gray-200 relative">
                  <Image
                    src="/assets/images/profile.png"
                    alt="Driver photo"
                    fill  // This makes the image fill the parent container
                    className="object-cover"  // This ensures proper cropping
                    sizes="(max-width: 768px) 100vw, 33vw"  // Optional: helps with responsive sizing
                  />
                </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Alhaji Chibuike Kamoru</h2>
              <p className="text-gray-600">Driver</p>
            </div>
          </div>

          {/* Driver Details */}
          <div className="space-y-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Email Address</span>
              <span className="text-gray-900 font-medium">abubakarsola001@gmail.com</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Phone Number</span>
              <span className="text-gray-900 font-medium">+2349012345678</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">National ID Number</span>
              <span className="text-gray-900 font-medium">12345678901</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">License Number</span>
              <span className="text-gray-900 font-medium">gh231457908868</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">License Type</span>
              <span className="text-gray-900 font-medium">Class C</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">License Expiry date</span>
              <span className="text-gray-900 font-medium">2030-03-15</span>
            </div>
          </div>
        </div>

        {/* Right Side - Documents */}
        <div className="bg-[#F2F2F7] rounded-lg p-6 relative">
              {/* Vertical line - perfectly centered */}
        <div className="hidden lg:block absolute top-0 bottom-0 -left-4 w-px bg-[#B6B6B9]"></div>
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Driver Details / View Documents</h3>

          {/* Document Grid */}
          <div className="grid grid-cols-3 gap-4 mb-6">
      {documents.map((document:any) => (
        <div key={document.id} className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
          <div className="w-12 h-12  rounded flex items-center justify-center mb-2 relative">
            {/* PDF icon - replace with your actual image path */}
            <Image 
              src="/assets/images/Group.png" 
              alt="PDF Icon"
              width={30}
              height={30}
            />
          
          </div>
          <span className="text-xs text-gray-600 text-center truncate w-full">
            {document.name}
          </span>
        </div>
      ))}
    </div>

          {/* Download Button */}
          <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white">
            <Download className="w-4 h-4 mr-2" />
            Download ALL (zip)
          </Button>
        </div>
      </div>
    </div>
  </div>
  )
}

export default DriverDetails