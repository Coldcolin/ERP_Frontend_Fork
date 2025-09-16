"use client"

import { Search, Plus, MoreHorizontal } from "lucide-react"
import { useEffect } from "react"
import { useDebounce } from "@/hooks/use-debounce"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useGetAllClientQuery, useCreateClientMutation, useDeleteClientMutation } from "@/lib/redux/api/clientApi"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
// import { format } from "date-fns"  
import { Client } from "@/types/client"
import React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

// Define form schema
const clientFormSchema = z.object({
  companyName: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  contactPerson: z.string().min(2, {
    message: "Contact person name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 characters.",
  }),
  contactPersonEmail: z.string().email({
    message: "Please enter a valid contact person email.",
  }).optional(),
  contactPersonPhone: z.string().min(10, {
    message: "Contact person phone must be at least 10 characters.",
  }).optional(),
  address: z.string().optional(),
  industry: z.string().optional(),
  notes: z.string().optional(),
})




export default function CustomerManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const pageSize = 10; 
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false)
  const debouncedSearchTerm = useDebounce(searchInput, 500); // 500ms delay
  const [createClient, { isLoading: isCreating }] = useCreateClientMutation()
  // Update search query when debounced value changes
  useEffect(() => {
    setSearchQuery(debouncedSearchTerm);
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  const { data: clients = { data: [], pagination: { total: 0, totalPages: 1 } }, refetch } = useGetAllClientQuery({
    page: currentPage,
    limit: pageSize,
    query: searchQuery.trim() || undefined
  }, {
    refetchOnMountOrArgChange: true,
  })
  const [deleteClient] = useDeleteClientMutation()
  

  const totalPages = clients?.pagination?.totalPages || 1;

  const goToPage = (page: number) => {
    setCurrentPage(page)
  }

  const goToPrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  const goToNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
      // The API will automatically refetch when currentPage changes
    }
  }

  // Initialize form with default values
  const form = useForm<z.infer<typeof clientFormSchema>>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      companyName: "",
      contactPerson: "",
      email: "",
      phone: "",
      contactPersonEmail: "",
      contactPersonPhone: "",
      address: "",
      industry: "",
      notes: "",
    },
  });

  const handleDelete = (id: string) => {
    
    
    const confirmDelete = () => {
      const deleteToast = toast.loading('Deleting customer...');
      deleteClient(id)
        .unwrap()
        .then(() => {
          toast.success('Customer deleted successfully');
          refetch();
        })
        .catch((error) => {
          toast.error(error.data?.message || 'Failed to delete customer');
        })
        .finally(() => {
          toast.dismiss(deleteToast);
        });
    };

    const confirmationToast = toast(
      <div className="flex flex-col gap-2">
        <p>Are you sure you want to delete this customer?</p>
        <div className="flex gap-2 justify-end mt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              toast.dismiss(confirmationToast);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              toast.dismiss(confirmationToast);
              confirmDelete();
            }}
          >
            Delete
          </Button>
        </div>
      </div>,
      {
        duration: 10000, // 10 seconds
        // onDismiss: () => {
        //   // This will be called when the toast is dismissed by clicking the X or auto-dismiss
        //   toast.dismiss(deleteToast);
        // }
      }
    );
  }

  // Reset form when modal opens/closes
  React.useEffect(() => {
    if (isAddCustomerOpen) {
      form.reset();
    }
  }, [isAddCustomerOpen, form]);

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof clientFormSchema>) => {
    try {
      // Check if required fields are empty
      if (!values.companyName.trim() || !values.contactPerson.trim() || !values.email.trim() || !values.phone.trim()) {
        // Form will show validation errors automatically due to Zod schema
        return;
      }

      // Trim all string values before submission
      const trimmedValues = Object.fromEntries(
        Object.entries(values).map(([key, value]) => [
          key,
          typeof value === 'string' ? (value || '').trim() : value
        ])
      ) as z.infer<typeof clientFormSchema>;
      // console.log(trimmedValues)
      await createClient(trimmedValues).unwrap();
      form.reset();
      setIsAddCustomerOpen(false);
      await refetch();
      // Optional: Add toast notification here for success
    } catch (error) {
      console.error("Failed to create client:", error);
      // Optional: Add error toast here
    }
  };
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Customer Management</h1>
        <div className="flex gap-3">
          <Button 
            onClick={() => setIsAddCustomerOpen(true)}
            className="bg-slate-800 text-white hover:bg-slate-700 border-slate-800"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Customer
          </Button>
          {/* <Button variant="outline" className="bg-slate-800 text-white hover:bg-slate-700 border-slate-800 ml-2">
            <Upload className="w-4 h-4 mr-2" />
            Import Sheet
          </Button> */}
        </div>
      </div>

      {/* Add Customer Modal */}
      <Dialog open={isAddCustomerOpen} onOpenChange={setIsAddCustomerOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Company Name (Required) */}
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter company name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Contact Person (Required) */}
                <FormField
                  control={form.control}
                  name="contactPerson"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Person *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter contact person name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email (Required) */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Email *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Enter company email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Phone (Required) */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Phone *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter company phone" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Contact Person Email (Optional) */}
                <FormField
                  control={form.control}
                  name="contactPersonEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Person Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Enter contact person email" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Contact Person Phone (Optional) */}
                <FormField
                  control={form.control}
                  name="contactPersonPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Person Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter contact person phone" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Industry (Optional) */}
                <FormField
                  control={form.control}
                  name="industry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Industry</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter industry" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Address (Optional) */}
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter company address" className="resize-none" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Notes (Optional) */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter any additional notes" className="resize-none" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    form.reset()
                    setIsAddCustomerOpen(false)
                  }}
                  disabled={isCreating}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? 'Adding...' : 'Add Customer'}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Metrics Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white">
          <CardContent className="p-3">
            <div className="space-y-2 text-center">
              <p className="text-sm text-gray-600">Total Active Customers</p>
              <p className="text-3xl font-bold text-gray-900">{clients?.data?.length || 0}</p>
            </div>
          </CardContent>
        </Card>
        {/* Search and Filters */}
        <Card className="bg-white col-span-2">
          <CardContent className="p-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input 
                placeholder="Search by name, email, or company..." 
                className="pl-10 bg-gray-50 border-gray-200"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer Table */}
      <Card className="bg-white">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-800 hover:bg-slate-800">
                <TableHead className="text-white">Company</TableHead>
                <TableHead className="text-white">Contact Person</TableHead>
                <TableHead className="text-white">Email</TableHead>
                <TableHead className="text-white">Phone</TableHead>
                <TableHead className="text-white">Industry</TableHead>
                <TableHead className="text-white">Status</TableHead>
                <TableHead className="text-right text-white">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients?.data?.map((client: Client) => (
                <TableRow key={client._id}>
                  <TableCell className="font-medium">{client.companyName}</TableCell>
                  <TableCell>{client.contactPerson}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{client.phone}</TableCell>
                  <TableCell>{client.industry}</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>
                    <div className="flex justify-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => router.push(`/fleet/customers/${client._id}`)}
                          >
                            View Details
                          </DropdownMenuItem>
                          {/* <DropdownMenuItem
                            onClick={() => {
                              // Handle edit action
                            }}
                          >
                            Edit
                          </DropdownMenuItem> */}
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => {
                              // Handle delete action
                              handleDelete(client._id);
                            }}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Pagination */}
      
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-700">
                Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, clients?.pagination?.total || 0)} of {clients?.pagination?.total || 0} entries
              </div>
      
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToPrevious}
                  disabled={currentPage === 1}
                  className="px-3 bg-transparent"
                >
                  Previous
                </Button>
      
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => goToPage(page)}
                      className={`w-8 h-8 p-0 ${
                        currentPage === page ? "bg-black text-white hover:bg-gray-800" : "hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </Button>
                  ))}
                </div>
      
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToNext}
                  disabled={currentPage === totalPages}
                  className="px-3 bg-transparent"
                >
                  Next
                </Button>
              </div>
            </div>
    </div>
  )
}
