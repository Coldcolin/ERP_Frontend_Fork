import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"


// TODO:CONSUME INVITE USER ENDPOINT

export default function InviteUserPage() {
  return (
    <div className="min-h-screen bg-white p-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">User management</h1>
          <p className="text-sm text-gray-500">Manage your team members and their account permission here</p>
        </div>

        <div  className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300">
             <Link href="/admin">
             <ArrowLeft className="h-4 w-4" />
             </Link>
            </div>
            <h2 className="text-xl font-semibold">User Setup</h2>
          </div>
        </div>

        <form className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                  First Name
                </label>
                <span className="text-sm font-medium text-red-500">*</span>
              </div>
              <Input
                id="firstName"
                placeholder="Enter First Name"
                className="h-12 rounded-md border-gray-300"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <span className="text-sm font-medium text-red-500">*</span>
              </div>
              <Input id="lastName" placeholder="Enter Last Name" className="h-12 rounded-md border-gray-300" required />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </label>
              <span className="text-sm font-medium text-red-500">*</span>
            </div>
            <Input
              id="email"
              type="email"
              placeholder="Enter email address"
              className="h-12 rounded-md border-gray-300"
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="department" className="text-sm font-medium text-gray-700">
                Department
              </label>
              <span className="text-sm font-medium text-red-500">*</span>
            </div>
            <Select required >
              <SelectTrigger id="department" className="h-12 rounded-md border-gray-300 w-full">
                <SelectValue placeholder="- Select department -" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fleet-management">Fleet Management</SelectItem>
                <SelectItem value="hr-department">HR Department</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="phone" className="text-sm font-medium text-gray-700">
                Phone No.
              </label>
              <span className="text-sm font-medium text-red-500">*</span>
            </div>
            <Input
              id="phone"
              type="tel"
              placeholder="Enter Phone Number"
              className="h-12 rounded-md border-gray-300"
              required
            />
          </div>

          <div className="pt-4">
            <Button type="submit" className="h-12 w-full bg-[#0F172A] text-white hover:bg-[#1E293B]">
              Invite User
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
