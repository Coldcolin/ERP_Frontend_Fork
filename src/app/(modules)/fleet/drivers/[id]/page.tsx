"use client"
// import Image from "next/image"
import { ArrowLeft, Download, Edit, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
// import { useRouter } from "next/navigation"
import {useGetDriverDetailsQuery} from "@/lib/redux/api/driverApi"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import { saveAs } from 'file-saver';
import JSZip from 'jszip';

type Certification = {
  type: string;
  documentPath: string;
};



type Props = {
  params: {
    id: string;
  };
};

export default function Component({ params }: Props) {
    // const router = useRouter();
    // const { id } = React.use(params);
    const {data: driverInfo, isLoading}= useGetDriverDetailsQuery(params?.id);
    const driverCerts = driverInfo?.certifications || [];
    const vehicleCerts = driverInfo?.assignedVehicle?.certifications || [];
    const allDocs = [...driverCerts, ...vehicleCerts];

     async function downloadAllAsZip() {
        const zip = new JSZip();
    
        for (const doc of allDocs) {
          try {
            const response = await fetch(doc.documentPath);
            const blob = await response.blob();
            const fileName = `${doc.type.toLowerCase().replace(/\s/g, '-')}.pdf`;
    
            zip.file(fileName, blob);
          } catch (err) {
            console.error(`Failed to fetch ${doc.type}:`, err);
          }
        }
    
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        saveAs(zipBlob, 'certifications.zip');
      }

  function formatToYYYYMMDD(dateString: string) {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.error("Invalid date:", dateString);
        return null;
      }

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');

      return `${year}-${month}-${day}`;
    }
  // const documents = [
  //   { name: "kamoru-driver-license.pdf", label: "Driver License" },
  //   { name: "kamoru-national-id-card.pdf", label: "National ID" },
  //   { name: "kamoru-road-worthiness.pdf", label: "Road Worthiness" },
  //   { name: "kamoru-medical-fitness.pdf", label: "Medical Fitness" },
  //   { name: "kamoru-vehicle-license.pdf", label: "Vehicle License" },
  //   { name: "kamoru-proof-of-ownership.pdf", label: "Proof of Ownership" },
  // ]
  if (isLoading) {
      return <div>Loading...</div>;
    }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4" onClick={() => window.history.back()}>
            <Button variant="ghost" size="sm" className="p-1">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-gray-600">back</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-semibold text-gray-900">Driver Details</h1>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Driver ID:</span>
              <span className="text-sm font-medium text-red-600">{params?.id}</span>
              <Button variant="link" className="text-blue-600 text-sm p-0 h-auto">
                See performance metrics
              </Button>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Edit className="w-4 h-4" />
                Edit driver details
              </Button>
              <Button size="sm" className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800">
                <Plus className="w-4 h-4" />
                Assign Vehicle
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Driver Profile */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 flex items-center justify-center rounded-full overflow-hidden bg-gray-200">
                  <Avatar>
                      <AvatarImage src={driverInfo?.photo || "/placeholder.svg"} alt={driverInfo?.personalInfo?.name} />
                      <AvatarFallback>{driverInfo?.personalInfo?.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{driverInfo?.personalInfo?.name}</h2>
                  <p className="text-sm text-gray-600">Driver</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600">Address</label>
                  <p className="text-sm font-medium text-gray-900">{driverInfo?.personalInfo?.address}</p>
                </div>

                <div>
                  <label className="text-sm text-gray-600">Phone Number</label>
                  <p className="text-sm font-medium text-gray-900">{driverInfo?.personalInfo?.conatct}</p>
                </div>

                {/* <div>
                  <label className="text-sm text-gray-600">National ID Number</label>
                  <p className="text-sm font-medium text-gray-900">12345678901</p>
                </div> */}

                <div>
                  <label className="text-sm text-gray-600">License Number</label>
                  <p className="text-sm font-medium text-gray-900">{driverInfo?.personalInfo?.licenseNumber}</p>
                </div>

                {/* <div>
                  <label className="text-sm text-gray-600">License Type</label>
                  <p className="text-sm font-medium text-gray-900">Class C</p>
                </div> */}

                <div>
                  <label className="text-sm text-gray-600">License Expiry date</label>
                  <p className="text-sm font-medium text-gray-900">{formatToYYYYMMDD(driverInfo?.personalInfo?.licenseExpiry)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documents Section */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Driver Details / View Documents</h3>

              <div className="grid grid-cols-3 gap-4 mb-6">
                {allDocs.map((doc, index) => (
                  <div key={index} className="flex flex-col items-center text-center">
                    <div className="w-16 h-20 bg-gray-600 rounded flex items-center justify-center mb-2">
                      <div className="text-white text-xs font-bold">PDF</div>
                    </div>
                    <p className="text-xs text-gray-600 leading-tight">{doc.type}</p>
                  </div>
                ))}
              </div>

              <Button onClick={downloadAllAsZip} className="w-full bg-gray-900 hover:bg-gray-800 flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                Download All (zip)
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
