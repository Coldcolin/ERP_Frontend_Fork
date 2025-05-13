'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight } from 'lucide-react'
import React from 'react'
import { AreaChart, Area, ResponsiveContainer, Tooltip, PieChart,Pie, Cell } from 'recharts';

const data:any = [
  { name: 'Jan', value: 200 },
  { name: 'Feb', value: 250 },
  { name: 'Mar', value: 300 },
  { name: 'Apr', value: 400 },
  { name: 'May', value: 600 },
  { name: 'Jun', value: 800 },
];

const milesData:any = [
  { name: 'Jan', value: 8500 },
  { name: 'Feb', value: 9200 },
  { name: 'Mar', value: 11000 },
  { name: 'Apr', value: 10500 },
  { name: 'May', value: 12000 },
  { name: 'Jun', value: 17500 },
];

const fleetData = [
  { name: 'Total Fleets', value: 1700, color: '#6366F1' }, 
   
  { name: 'Others', value: 60, color: '#EF4444' },  
     // orange-400
  { name: 'Break down', value: 100, color: '#4ADE80' }, 
  { name: 'Maintenance', value: 500, color: '#FB923C' },      // green-400
          // red-500
];

const Fleet = () => {
  return (
    <div className="container mx-auto py-2 ">
        <h1 className="text-3xl font-bold mb-8">Welcome, Janeth Asuquo!</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Overview Card */}
          <div className="bg-white rounded-lg border shadow-sm">
  <div className="flex flex-row justify-between items-center p-4 border-b">
    <h3 className="font-semibold text-lg">Overview</h3>
    <ArrowRight className="h-5 w-5 text-gray-500" />
  </div>
  <div className="p-4">
    <div className='flex'>
      <div className="flex mb-4 w-full h-52">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={fleetData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={90}
              dataKey="value"
            >
              {fleetData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="space-y-4 mt-6">
        {fleetData.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: item.color }}></div>
            <span className="text-gray-500">{item.name}</span>
            <span className="ml-auto font-medium">
              {item.value.toString().padStart(4, '0')}
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
</div>

          {/* Mileage Tracking Card */}
          <div className='grid grid-cols-2 gap-6'>
            
          <div className="bg-white rounded-lg border shadow-sm pt-4 ">
               <div className="flex flex-row justify-between p-2 items-center mb-2">
                    <h3 className="font-semibold text-lg">Mileage Tracking</h3>
                    <ArrowRight className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <div className="space-y-2 p-4">
                      <p className="text-sm text-gray-500">Total miles driven</p>
                      <p className="text-2xl font-semibold">
                        <span>58023K</span>
                        <span className="text-gray-500 ml-2">Miles</span>
                      </p>
                    </div>
                    <div className="w-full h-32">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                          <Tooltip />
                          <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#9333EA"
                            fill="url(#gradient)"
                          />
                          <defs>
                            <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#9333EA" stopOpacity={0.6} />
                              <stop offset="95%" stopColor="#9333EA" stopOpacity={0.1} />
                            </linearGradient>
                          </defs>
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
            </div>

            <div className="bg-white rounded-lg border shadow-sm pt-4 ">
               <div className="flex flex-row justify-between p-2 items-center mb-2">
                    <h3 className="font-semibold text-lg">Fuel Expense</h3>
                    <ArrowRight className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <div className="space-y-2 p-4">
                      <p className="text-sm text-gray-500">Total expense</p>
                      <p className="text-2xl font-semibold">
                        <span>3.8M</span>
                        <span className="text-gray-500 ml-2">Miles</span>
                      </p>
                    </div>
                    <div className="w-full h-32">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={milesData}>
                          <Tooltip />
                          <Area
                          type="monotone"
                          dataKey="value" 
                          stroke="#F59E0B"
                          fill="url(#gradient2)"
                        />
                        <defs>
                          <linearGradient id="gradient2" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#FCD34D" stopOpacity={0.5} />
                          </linearGradient>
                        </defs>
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
            </div>

          </div>
        </div>


        <div className='grid grid-cols-3 gap-6 mt-6 '>

        <div className="bg-white rounded-lg border shadow-sm pt-4">
            <div className="flex flex-row justify-between p-4 items-center">
              <h3 className="font-semibold text-lg">Fuel Usage</h3>
              <ArrowRight className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <div className="space-y-2 p-4">
                <p className="text-sm text-gray-500">Total fuel used</p>
                <p className="text-2xl font-semibold">
                  <span>45038</span>
                  <span className="text-gray-500 ml-2">Gallons</span>
                </p>
              </div>
              <div className="w-full h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#22C55E"
                      fill="url(#gradientGreen)"
                    />
                    <defs>
                      <linearGradient id="gradientGreen" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22C55E" stopOpacity={0.6} />
                        <stop offset="95%" stopColor="#22C55E" stopOpacity={0.8} />
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Maintenance Card */}
          <Card className="md:col-span-2 col-end-2">
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>Maintenance</CardTitle>
              <ArrowRight className="h-5 w-5 text-gray-500" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-4">Click the top-right arrow for full maintenance details.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Due Maintenance */}
                <div className="bg-red-50 border border-red-100 rounded-md p-4">
                  <div className="text-lg font-medium text-gray-700">Due</div>
                  <div className="mt-2 mb-4">
                    <span className="text-4xl font-bold">05</span>
                    <span className="text-xs text-red-500 ml-2">10% ↗</span>
                  </div>
                  <div className="h-[60px] w-full relative overflow-hidden">
                    <div
                      className="absolute bottom-0 left-0 right-0 h-[50px] bg-gradient-to-t from-red-500/80 to-red-300/50 rounded-md"
                      style={{ clipPath: "polygon(0 100%, 20% 80%, 40% 90%, 60% 70%, 80% 60%, 100% 40%, 100% 100%)" }}
                    ></div>
                  </div>
                </div>

                {/* Overdue Maintenance */}
                <div className="bg-orange-50 border border-orange-100 rounded-md p-4">
                  <div className="text-lg font-medium text-gray-700">OverDue</div>
                  <div className="mt-2 mb-4">
                    <span className="text-4xl font-bold">13</span>
                    <span className="text-xs text-orange-500 ml-2">15% ↗</span>
                  </div>
                  <div className="h-[60px] w-full relative overflow-hidden">
                    <div
                      className="absolute bottom-0 left-0 right-0 h-[50px] bg-gradient-to-t from-orange-500/80 to-orange-300/50 rounded-md"
                      style={{ clipPath: "polygon(0 100%, 20% 70%, 40% 80%, 60% 60%, 80% 50%, 100% 40%, 100% 100%)" }}
                    ></div>
                  </div>
                </div>

                {/* Upcoming Maintenance */}
                <div className="bg-green-50 border border-green-100 rounded-md p-4">
                  <div className="text-lg font-medium text-gray-700">Upcomming</div>
                  <div className="mt-2 mb-4">
                    <span className="text-4xl font-bold">03</span>
                    <span className="text-xs text-green-500 ml-2">02% ↗</span>
                  </div>
                  <div className="h-[60px] w-full relative overflow-hidden">
                    <div
                      className="absolute bottom-0 left-0 right-0 h-[50px] bg-gradient-to-t from-green-500/80 to-green-300/50 rounded-md"
                      style={{ clipPath: "polygon(0 100%, 20% 80%, 40% 70%, 60% 80%, 80% 60%, 100% 50%, 100% 100%)" }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          </div>
    </div>
  )
}

export default Fleet