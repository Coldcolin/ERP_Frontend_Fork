"use client"

import type React from "react"
import { useState,useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

// Add form schema
const formSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  department: z.string().min(2, "Department is required"),
  phoneNo: z.string().min(10, "Phone number is required"),
})


type User = {
  id: string
  firstName: string
  lastName: string
  email: string
  department: string
  phoneNo: string
  isEditing?: boolean
}

interface ViewEditProfileModalProps {
  user: User
  isOpen: boolean
  onClose: () => void
}

 function ViewEditProfileModal({ user, isOpen, onClose }: ViewEditProfileModalProps) {
  const [isEditing, setIsEditing] = useState(user.isEditing || false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      department: user.department,
      phoneNo: user.phoneNo,
    },
  })

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log("Updated user data:", data)
    setIsEditing(false)
  }
  
  useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        department: user.department,
        phoneNo: user.phoneNo,
      });
      setIsEditing(user.isEditing || false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, form.reset]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEditClick = (e:any) => {
    e.preventDefault();
    setIsEditing(true);
    // Enable form fields
    form.clearErrors();
  };

  return (
     <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Profile" : "View Profile"}</DialogTitle>
         
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="firstName">
              First Name <span className="text-red-500">*</span>
            </Label>
            <Input
              {...form.register("firstName")}
              readOnly={!isEditing}
              className={!isEditing ? "bg-gray-50" : ""}
            />
            {form.formState.errors.firstName && (
              <p className="text-sm text-red-500">{form.formState.errors.firstName.message}</p>
            )}
          </div>
          {/* Repeat for other fields with same pattern */}
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name <span className="text-red-500">*</span></Label>
            <Input {...form.register("lastName")} readOnly={!isEditing} className={!isEditing ? "bg-gray-50" : ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
            <Input {...form.register("email")} type="email" readOnly={!isEditing} className={!isEditing ? "bg-gray-50" : ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="department">Department <span className="text-red-500">*</span></Label>
            <Input {...form.register("department")} readOnly={!isEditing} className={!isEditing ? "bg-gray-50" : ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phoneNo">Phone No. <span className="text-red-500">*</span></Label>
            <Input {...form.register("phoneNo")} readOnly={!isEditing} className={!isEditing ? "bg-gray-50" : ""} />
          </div>
          <div className="pt-4">
            {isEditing ? (
              <Button type="submit" className="w-full">
                Save Changes
              </Button>
            ) : (
              <Button type="button" onClick={handleEditClick} className="w-full">
                Edit Profile
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ViewEditProfileModal