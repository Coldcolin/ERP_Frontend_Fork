"use client"

import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from 'next/navigation';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { toast } from "sonner"
import {useCreateUserMutation} from "@/lib/redux/api/userApi"

const inviteUserSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  department: z.string().min(1, "Please select a department"),
  phoneNumber: z.string().min(10, "Please enter a valid phone number"),
})

type InviteUserFormValues = z.infer<typeof inviteUserSchema>

export default function InviteUserPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter();
  const [createUser, { isLoading: isUserLoading }] = useCreateUserMutation();

  const form = useForm<InviteUserFormValues>({
    resolver: zodResolver(inviteUserSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      department: '',
      phoneNumber: '',
    },
  })

  const onSubmit = async (data: InviteUserFormValues) => {
    setIsLoading(true)
    try {
      console.log('Form Data:', data);
      const response = await createUser(data).unwrap();
      console.log('API Response:', response);
      toast.success('User invited successfully!', {
        description: 'An email has been sent to the user.',
        duration: 5000,
      });
      form.reset(); 
      router.push('/admin');
      setIsLoading(false);
    } catch (error: any) {
      console.error('API Error:', error);
      toast.error(error.data?.message || error.message || 'Failed to invite user');
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">User management</h1>
          <p className="text-sm text-gray-500">Manage your team members and their account permission here</p>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300">
              <Link href="/admin">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </div>
            <h2 className="text-xl font-semibold">User Setup</h2>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">First Name</label>
                      <span className="text-sm font-medium text-red-500">*</span>
                    </div>
                    <FormControl>
                      <Input
                        placeholder="Enter First Name"
                        className="h-12 rounded-md border-gray-300"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">Last Name</label>
                      <span className="text-sm font-medium text-red-500">*</span>
                    </div>
                    <FormControl>
                      <Input
                        placeholder="Enter Last Name"
                        className="h-12 rounded-md border-gray-300"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <span className="text-sm font-medium text-red-500">*</span>
                  </div>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter email address"
                      className="h-12 rounded-md border-gray-300"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Department</label>
                    <span className="text-sm font-medium text-red-500">*</span>
                  </div>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12 rounded-md border-gray-300 w-full">
                        <SelectValue placeholder="- Select department -" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Sales Fleet">Fleet Management</SelectItem>
                      <SelectItem value="HR & Admin">HR Department</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Courier">Courier</SelectItem>
                      <SelectItem value="Customer service & Pricing">Customer service & Pricing</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Phone No.</label>
                    <span className="text-sm font-medium text-red-500">*</span>
                  </div>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="Enter Phone Number"
                      className="h-12 rounded-md border-gray-300"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="pt-4">
              <Button 
                type="submit" 
                className="h-12 w-full bg-[#0F172A] text-white hover:bg-[#1E293B]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Inviting User...
                  </div>
                ) : (
                  'Invite User'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}