"use client"

import { ArrowLeft, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useGetSingleClientQuery } from "@/lib/redux/api/clientApi";
import { useRouter } from "next/navigation";
// interface Client {
//   _id: string;
//   companyName: string;
//   contactPerson: string;
//   email: string;
//   phone: string;
//   address: string;
//   city: string;
//   state: string;
//   postalCode: string;
//   industry: string;
//   country: string;
//   taxId?: string;
//   paymentTerms?: string;
//   notes?: string;
//   createdAt?: Date | string;
//   updatedAt?: Date | string;
// }

type Props = {
    params: { id: string };
  };

export default function CustomerManagement({ params }: Props) {
    const { id } = params;
    const router = useRouter();
    const { data: clientInfo, isLoading } = useGetSingleClientQuery(id);
    console.log(clientInfo)

    if (isLoading) {
      return (
        <div className="min-h-screen bg-gray-50 p-6">
            Loading...
        </div>
      );
    }
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="p-2" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-semibold text-gray-900">Customer Management</h1>
          </div>
        </div>

        {/* Customer ID and Actions */}
        <div className="flex items-center justify-between mb-8">
          <div className="text-lg font-medium text-gray-900">
            Customer ID : <span className="font-normal">{clientInfo?._id}</span>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <Edit className="h-4 w-4" />
              Edit Customer Details
            </Button>
            {/* <Button className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700">
              <Plus className="h-4 w-4" />
              Add New Customer
            </Button> */}
          </div>
        </div>

        {/* Customer Information Grid */}
        <div className="grid grid-cols-2 gap-x-16 gap-y-6 mb-8">
          {/* Left Column */}
          <div className="space-y-6">
            <div>
              <div className="text-sm text-gray-500 mb-1">Company Name</div>
              <div className="text-gray-900 font-medium">{clientInfo?.companyName}</div>
            </div>

            <div>
              <div className="text-sm text-gray-500 mb-1">Company Email</div>
              <div className="text-gray-900">{clientInfo?.email}</div>
            </div>

            <div>
              <div className="text-sm text-gray-500 mb-1">Company Phone No.</div>
              <div className="text-gray-900">{clientInfo?.phone}</div>
            </div>

            <div>
              <div className="text-sm text-gray-500 mb-1">Office Address</div>
              <div className="text-gray-900">{clientInfo?.address}</div>
            </div>

            {/* <div>
              <div className="text-sm text-gray-500 mb-1">City</div>
              <div className="text-gray-900">{clientInfo?.city}</div>
            </div>

            <div>
              <div className="text-sm text-gray-500 mb-1">State</div>
              <div className="text-gray-900">{clientInfo?.state}</div>
            </div>

            <div>
              <div className="text-sm text-gray-500 mb-1">Country</div>
              <div className="text-gray-900">{clientInfo?.country}</div>
            </div> */}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div>
              <div className="text-sm text-gray-500 mb-1">Contact Person</div>
              <div className="text-gray-900 font-medium">{clientInfo?.contactPerson}</div>
            </div>

            <div>
              <div className="text-sm text-gray-500 mb-1">Contact Person email</div>
              <div className="text-gray-900">{clientInfo?.contactPersonEmail}</div>
            </div>

            <div>
              <div className="text-sm text-gray-500 mb-1">Contact Phone No.</div>
              <div className="text-gray-900">{clientInfo?.contactPersonPhone}</div>
            </div>

            {/* <div>
              <div className="text-sm text-gray-500 mb-1">Company Type</div>
              <div className="text-gray-900">{clientInfo?.companyType}</div>
            </div> */}

            <div>
              <div className="text-sm text-gray-500 mb-1">Industry</div>
              <div className="text-gray-900">{clientInfo?.industry}</div>
            </div>
          </div>
        </div>

        {/* Notes Section */}
        <div className="mt-8">
          <div className="text-lg font-medium text-gray-900 mb-4">Notes</div>
          <div className="text-gray-700 leading-relaxed">
            Please handle this shipment with special care as it contains perishable agricultural produce. Ensure that
            the goods are transported under the recommended temperature and humidity conditions to maintain freshness
            and quality.
          </div>
        </div>
      </div>
    </div>
  )
}
