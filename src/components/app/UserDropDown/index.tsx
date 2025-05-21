"use client"
import { cn } from "@/lib/utils"
import { useState } from "react"
import {
    Settings, 
    User,
    LogOut,
    ChevronDown,
  } from "lucide-react"
  import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
  import { useDispatch } from 'react-redux';
import { logout } from '@/lib/redux/slices/authSlice';
import { useRouter } from 'next/navigation';

  interface AdminDropdownProps {
    userName: string;
    avatarFallback: string;
    email?: string;
    position?: 'top' | 'bottom'; 
    className?: string;
  }
function UserDropdown({ userName, avatarFallback, position = 'top' , className }: AdminDropdownProps) {
    const [isOpen, setIsOpen] = useState(false)
    const dispatch = useDispatch();
    const router = useRouter();

    const handleLogout = () => {
      dispatch(logout());
      router.push('/login');
      setIsOpen(false);
    };
  
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn("flex w-full items-center h-10 justify-between rounded-md bg-[#0F172A] px-2 py-3 text-white", className)}
        >
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 border-2 border-white/20">
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Admin" />
              <AvatarFallback className="font-black">{avatarFallback}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{userName}</span>
          </div>
          <ChevronDown className={`h-5 w-5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>
  
        {isOpen && (
          <div  className={`absolute ${position === 'top' ? 'bottom-full mb-1' : 'top-full mt-1'} left-0 w-full overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg`}>
            <div className="p-2">
              <div className="mb-2 px-3 py-1 text-xs font-medium text-gray-500">admin@dreamworks.com</div>
              <button className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <User className="h-4 w-4" />
                Profile
              </button>
              <button className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <Settings className="h-4 w-4" />
                Settings
              </button>
              <div className="my-1 border-t border-gray-100"></div>
              <button onClick={handleLogout} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-50">
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  export default UserDropdown;