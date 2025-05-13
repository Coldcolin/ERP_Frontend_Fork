import { MoreHorizontal } from "lucide-react"
import Link from "next/link"

interface MetricCardProps {
  title: string;
  value: string;
  unit?: string;
  subtext?: string;
  bgColor?: string;
  textColor?: string;
}

export default function VehicleDashboard() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Vehicles</h1>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <MetricCard title="Fleets" value="1,283" subtext="10%" bgColor="bg-[#0a192f]" textColor="text-white" />
        <MetricCard title="Miles Driven" value="25675k" subtext="15%" />
        <MetricCard title="Fuel consumption" value="10238" unit="/Gal" subtext="13%" />
        <MetricCard title="Avg fuel cost" value="₹998" unit="/Gal" subtext="14%" />
        <MetricCard title="Avg miles" value="138" subtext="7%" />
      </div>

      {/* Vehicles Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#0a192f] text-white">
              <th className="p-3 text-left">
                <input type="checkbox" className="rounded" />
              </th>
              <th className="p-3 text-left">Vehicle ID</th>
              <th className="p-3 text-left">Year</th>
              <th className="p-3 text-left">Make</th>
              <th className="p-3 text-left">Model</th>
              <th className="p-3 text-left">Weight</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Exempt</th>
            </tr>
          </thead>
          <tbody>
            {vehicleData.map((vehicle, index) => (
              <tr key={vehicle.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="p-3">
                  <input type="checkbox" className="rounded" />
                </td>
                <td className="p-3">
                  <Link href="#" className="text-blue-600 hover:underline">
                    {vehicle.id}
                  </Link>
                </td>
                <td className="p-3">{vehicle.year}</td>
                <td className="p-3">{vehicle.make}</td>
                <td className="p-3">{vehicle.model}</td>
                <td className="p-3">{vehicle.weight}</td>
                <td className="p-3">{vehicle.type}</td>
                <td className="p-3">{vehicle.exempt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function MetricCard({ title, value, unit = "", subtext, bgColor = "bg-gray-100", textColor = "text-gray-900" }: MetricCardProps) {
  return (
    <div className={`${bgColor} rounded-md p-4 relative`}>
      <div className="flex justify-between items-start">
        <h3 className={`text-sm font-medium ${textColor === "text-white" ? "text-gray-300" : "text-gray-500"}`}>
          {title}
        </h3>
        <button className="text-gray-400 hover:text-gray-600">
          <MoreHorizontal size={16} />
        </button>
      </div>
      <div className={`mt-2 flex items-baseline ${textColor}`}>
        <span className="text-2xl font-semibold">{value}</span>
        {unit && <span className="ml-1">{unit}</span>}
      </div>
      {subtext && <div className="mt-1 text-xs text-gray-500">{subtext}</div>}
    </div>
  )
}

const vehicleData = [
  {
    id: "NWUPD1",
    year: "2019",
    make: "Toyota",
    model: "Camry",
    weight: "<=8,500 pounds",
    type: "Hybrid",
    exempt: "Yes",
  },
  {
    id: "NWUPD2",
    year: "2020",
    make: "Honda",
    model: "Accord",
    weight: "<=8,500 pounds",
    type: "Gasoline",
    exempt: "Yes",
  },
  {
    id: "NWUPD3",
    year: "2021",
    make: "Ford",
    model: "Fusion",
    weight: "<=8,500 pounds",
    type: "Hybrid",
    exempt: "Yes",
  },
  {
    id: "NWUPD4",
    year: "2018",
    make: "Nissan",
    model: "Altima",
    weight: "<=8,500 pounds",
    type: "Gasoline",
    exempt: "No",
  },
  {
    id: "NWUPD5",
    year: "2022",
    make: "Hyundai",
    model: "Sonata",
    weight: "<=8,500 pounds",
    type: "Hybrid",
    exempt: "Yes",
  },
  {
    id: "NWUPD6",
    year: "2023",
    make: "Kia",
    model: "Sportage",
    weight: "<=8,500 pounds",
    type: "Gasoline",
    exempt: "Yes",
  },
  {
    id: "NWUPD7",
    year: "2021",
    make: "Chevrolet",
    model: "Bolt EV",
    weight: "<=8,500 pounds",
    type: "Electric",
    exempt: "Yes",
  },
  { id: "NWUPD8", year: "2020", make: "Kia", model: "Optima", weight: "<=8,500 pounds", type: "Hybrid", exempt: "Yes" },
]
