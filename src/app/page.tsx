"use client"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useSelector } from 'react-redux'
import { format } from 'date-fns';
import { toast } from "sonner"

export default function Dashboard() {
    const router = useRouter()
  const [selectedModule, setSelectedModule] = useState("")
  const [showUnavailable, setShowUnavailable] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
 
  const isAuthenticated = useSelector((state: any) => state.auth.token)
  
  const isUser = useSelector((state: any) => state.auth.user)

  const currentDate = new Date();
  const formattedDateTime = format(currentDate, "EEEE, MMMM d, yyyy, h:mm a 'WAT'")
  
  const handleGetStarted = async () => {
  
    setIsLoading(true)
    // if (selectedModule === "FLEET") {
    //   router.push("/fleet")
    // } else if (selectedModule) {
    //   setShowUnavailable(true)
    // }
    try {
      if (!isAuthenticated) {
        // If not authenticated, redirect to login
        router.push('/login');
        return;
      }
  
      if (selectedModule === "ADMIN" && !isUser?.isSuperAdmin) {
        toast.error("You don't have permission to access the admin dashboard");
        return;
      }
  
      // If authenticated, handle module routing
      if (selectedModule === "FLEET") {
        await router.push("/fleet"); // Using await for the navigation
      } else if (selectedModule === "ADMIN") {
        await router.push("/admin");
      } else if (selectedModule) {
        setShowUnavailable(true);
      }
    } catch (error) {
      console.error("Navigation error:", error);
      toast.error("An error occurred during navigation");
    } finally {
      setIsLoading(false); // Stop loading regardless of success or failure
    }
  }
  return (
    <div className="relative flex flex-col min-h-screen text-white overflow-hidden">
        <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("/assets/images/welcome_screen.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      <header className="relative z-10 p-6">
        <div className="flex items-center">
          <div className="bg-white p-1 rounded">
            <Image
              src="/assets/images/cover.png"
              alt="DreamWork Global Logistics"
              width={120}
              height={40}
              className="h-10 w-[120px] object-cover"
            />
          </div>
        </div>
        <div className="mt-8">
        {
          isUser && (
            <h2 className="text-lg font-normal">{`${isUser.firstName} ${isUser.lastName}`}</h2>
          )
        }
         </div>
        <div className="text-xs text-gray-300 mt-1">
        <p>{formattedDateTime}</p>
              <p>Lagos, Lagos, Nigeria</p>
            </div>
     
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 -mt-10">
        <div className="w-full max-w-md text-center flex flex-col gap-10">
          <h1 className="text-4xl font-bold">
            Which module would you
            <br />
            like to access?
          </h1>
           <div className="space-y-4">
            <select 
              className="w-full bg-transparent border border-gray-600 rounded px-4 py-2 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedModule}
              onChange={(e) => {
                setSelectedModule(e.target.value)
                setShowUnavailable(false)
              }}
            >
              <option value="" className="text-gray-600">
                - SELECT -
              </option>
              <option value="ADMIN" className="text-gray-600">
        ADMIN DASHBOARD
      </option>
              <option value="FLEET" className="text-gray-600">
                FLEET
              </option>
              <option value="LOGISTICS" className="text-gray-600">
                LOGISTICS/ROAD OPERATIONS
              </option>
              <option value="SALES" className="text-gray-600">
                SALES/CRM
              </option>
              <option value="FINANCE" className="text-gray-600">
                FINANCE
              </option>
            </select>

            {showUnavailable && (
              <Alert className="bg-red-900/50 border-red-800 text-white">
                <AlertDescription className="text-white">
                  This Module is currently unavailable
                </AlertDescription>
              </Alert>
            )}

        <Button 
              className="w-full bg-[#021325] hover:bg-[#021320] text-white border-none py-6 cursor-pointer"
              onClick={handleGetStarted}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Get Started"}
            </Button>
          </div>
        </div>
      </main>
      <footer className="relative z-10 p-6 text-center text-xs text-gray-300">
        <div className="mb-2">
          <Link href="#" className="hover:text-white">
          {
          isUser && (
            isUser.firstName + " " + isUser.lastName
          )
          }
          </Link>{" "}
          |
          <Link href="#" className="hover:text-white ml-2">
            Settings
          </Link>{" "}
          |
          <Link href="#" className="hover:text-white ml-2">
            Help & Support
          </Link>{" "}
          |
          <Link href="#" className="hover:text-white ml-2">
            Logout
          </Link>
        </div>
        <div>© DreamWork Global Logistics LTD. 2025</div>
      </footer>
    </div>
  )
}
