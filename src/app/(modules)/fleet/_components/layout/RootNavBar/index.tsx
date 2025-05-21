"use client"
import UserDropdown from '@/components/app/UserDropDown'
import { Input } from '@/components/ui/input'
import { Bell, HelpCircle, Search } from 'lucide-react'
import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/lib/redux/store'

const RootNavBar = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  return (
    <div className="flex items-center justify-between  py-4 ">
    <div className="relative w-full max-w-md">
      <Input
        type="text"
        placeholder="Search Fleet"
        className="pl-4 pr-10 py-2 rounded-md bg-white border-gray-200"
      />
      <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
    </div>
    <div className="flex items-center gap-4">
      <div className="relative">
        <Bell className="h-6 w-6 text-gray-500" />
       
      </div>
      <div className="relative">
        <HelpCircle className="h-6 w-6 text-gray-500" />
        <div className="absolute rounded-lg -top-3 -right-3 h-4 w-4 p-0 flex items-center justify-center text-xs bg-black text-white">
         3 
        </div>
      </div>
      <div className="bg-gray-900 rounded-lg px-4 py-2 flex items-center gap-2 text-white">
      <UserDropdown
            userName={`${user?.firstName} ${user?.lastName}`}
            avatarFallback={user?.firstName?.charAt(0) || ''}
            position='bottom'
            className='h-7'
            />
      </div>
    </div>
  </div>
  )
}

export default RootNavBar