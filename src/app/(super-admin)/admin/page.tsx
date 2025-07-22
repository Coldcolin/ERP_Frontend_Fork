'use client'
import React, { useState } from 'react'
import {
  Search,
  Filter,
  PlusIcon
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import TableOptions from '@/components/app/TableOptions'
import ViewEditProfileModal from './_components/ViewEditProfileModal'
import { User, UserRoundPen, Key, CloudDownload, Trash2 } from 'lucide-react';
import DeleteConfirmatioNodal from '@/components/app/DeleteConfirmatioNodal'
import { useGetAllUserQuery } from "@/lib/redux/api/userApi"
import { Spinner } from "@/components/ui/spinner"
import { Skeleton } from "@/components/ui/skeleton"

// Define AppUser type based on properties used
type AppUser = {
  id: string;
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  department?: string;
  phoneNo?: string;
  role?: string;
  avatar?: string;
  [key: string]: any;
};

const Admin = () => {
const [isModalOpen, setIsModalOpen] = React.useState(false);
const [selectedUser, setSelectedUser] = React.useState<AppUser | null>(null);
const [isDialogOpen, setIsDialogOpen] = useState(false) 
const [userToDelete, setUserToDelete] = useState<AppUser | null>(null) 
// const isAuthenticated = useSelector((state: any) => state?.auth?.user)
const router = useRouter();

const { data: users, isLoading } = useGetAllUserQuery({});

console.log("user data",users)
const handleDeleteUser = () => {
  if (userToDelete) {
    console.log(`Deleting user with ID: ${userToDelete.id}`)
    // Perform the delete operation (e.g., API call)
    // Example: await deleteUser(userToDelete.id);
    setIsDialogOpen(false) // Close the dialog after deletion
    setUserToDelete(null) // Reset the userToDelete state
  }
}
// console.log(isLoading)


// const handleViewProfile = (user: any) => {
//   setSelectedUser(user)
//   setIsModalOpen(true)
// }
  return (
  <div>
    <main className="flex-1">
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">User management</h2>
            <p className="text-sm text-gray-500">Manage your team members and their account permission here</p>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Total Users</CardTitle>
                <CardDescription>All registered users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">07</div>
                <p className="text-xs text-gray-500">1 active, 6 inactive</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Departments</CardTitle>
                <CardDescription>User distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Fleet Management</span>
                    <span className="text-sm font-medium">3</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">HR Department</span>
                    <span className="text-sm font-medium">3</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Finance</span>
                    <span className="text-sm font-medium">2</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>System Status</CardTitle>
                <CardDescription>All systems operational</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <span className="text-sm font-medium text-green-600">Online</span>
                </div>
                <p className="mt-2 text-xs text-gray-500">Last updated: 5 minutes ago</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="all-users" className="mb-6">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="all-users">All Users</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="inactive">Inactive</TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input type="search" placeholder="Search" className="w-64 pl-10" />
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
                <Link href="/admin/invite-users">
                  <Button size="sm" className="gap-2">
                    <PlusIcon className="h-4 w-4" />
                    Invite Employee
                  </Button>
                </Link>
              </div>
            </div>

            <TabsContent value="all-users" className="mt-4">
              <div className="overflow-hidden rounded-lg border bg-white">
                <div className="grid grid-cols-12 border-b bg-gray-50 px-6 py-3 text-sm font-medium text-gray-500">
                  <div className="col-span-4">Names</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-3">Department</div>
                  <div className="col-span-2">Role</div>
                  <div className="col-span-1">Actions</div>
                </div>
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <Spinner size="lg" className="mb-4" />
                    <p className="text-sm text-gray-500">Loading users...</p>
                    <div className="w-full px-6 py-4 space-y-4 mt-4">
                      {[...Array(5)].map((_, index) => (
                        <div key={index} className="grid grid-cols-12 items-center gap-4">
                          <div className="col-span-4 flex items-center gap-3">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="space-y-2">
                              <Skeleton className="h-4 w-32" />
                              <Skeleton className="h-3 w-48" />
                            </div>
                          </div>
                          <div className="col-span-2">
                            <Skeleton className="h-6 w-16" />
                          </div>
                          <div className="col-span-3">
                            <Skeleton className="h-4 w-24" />
                          </div>
                          <div className="col-span-2">
                            <Skeleton className="h-4 w-16" />
                          </div>
                          <div className="col-span-1 flex justify-end">
                            <Skeleton className="h-8 w-8 rounded-full" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="divide-y">
                    {users?.users?.map((user: AppUser) => (
                      <div key={user._id} className="grid grid-cols-12 items-center px-6 py-4">
                        <div className="col-span-4 flex items-center gap-3">
                        <Avatar>
                              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={`${user.firstName} ${user.lastName}`.trim()} />
                              <AvatarFallback>{user.firstName.charAt(0)}</AvatarFallback>
                            </Avatar>
                    <div>
                      <div className="font-medium">{`${user.firstName} ${user.lastName}`.trim()}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>

                        </div>
                        <div className="col-span-2">
                          <Badge
                            variant={user.isActive === true ? "default" : "outline"}
                            className={
                              user.isActive === true
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : "bg-red-100 text-red-800 hover:bg-red-100"
                            }
                          >
                            {user.isActive ? "Active" : "Inactive"}
                            {/* Inactive */}
                          </Badge>
                        </div>
                        <div className="col-span-3 text-sm">{user.department ? user.department: "Admin"}</div>
                        <div className="col-span-2 text-sm">
                          {/* {user.role} */}
                          Staff
                          </div>
                        <div className="col-span-1 text-right cursor-pointer">

                         <TableOptions 
                         variant="dotsVertical"
                         options={[
                          {
                            label: "View Profile",
                            onClick: () => {
                              setSelectedUser(user);
                              setIsModalOpen(true);
                            },
                            icon: <User className="h-4 w-4 cursor-pointer" />,
                          },
                          {
                            label: "Edit Profile",
                            onClick: () => {
                              setSelectedUser(user);
                              setIsModalOpen(true);
                              setSelectedUser({ ...user, isEditing: true });
                            },
                            icon: <UserRoundPen  className="h-4 w-4 cursor-pointer" />,

                          },
                          {
                            label: "Change permissions",
                            onClick: () => {
                              router.push(`/admin/permissions/${user._id}`);
                            },
                            icon: <Key  className="h-4 w-4 cursor-pointer" />,

                          },
                          {
                            label: "Export details",
                            onClick: () => {
                            console.log('Eport details');
                            },
                            icon: <CloudDownload  className="h-4 w-4 cursor-pointer" />,

                          },
                          {
                            label: "Delete User",
                            onClick: () => {
                              setUserToDelete(user) 
                              setIsDialogOpen(true) 
                            },
                            icon: <Trash2  className="h-4 w-4 cursor-pointer" />,

                          },
                         ]}
                         />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="active" className="mt-4">
              <div className="overflow-hidden rounded-lg border bg-white">
                <div className="grid grid-cols-12 border-b bg-gray-50 px-6 py-3 text-sm font-medium text-gray-500">
                  <div className="col-span-4">Names</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-3">Department</div>
                  <div className="col-span-2">Role</div>
                  <div className="col-span-1">Actions</div>
                </div>
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <Spinner size="lg" className="mb-4" />
                    <p className="text-sm text-gray-500">Loading active users...</p>
                    <div className="w-full px-6 py-4 space-y-4 mt-4">
                      {[...Array(3)].map((_, index) => (
                        <div key={index} className="grid grid-cols-12 items-center gap-4">
                          <div className="col-span-4 flex items-center gap-3">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="space-y-2">
                              <Skeleton className="h-4 w-32" />
                              <Skeleton className="h-3 w-48" />
                            </div>
                          </div>
                          <div className="col-span-2">
                            <Skeleton className="h-6 w-16" />
                          </div>
                          <div className="col-span-3">
                            <Skeleton className="h-4 w-24" />
                          </div>
                          <div className="col-span-2">
                            <Skeleton className="h-4 w-16" />
                          </div>
                          <div className="col-span-1 flex justify-end">
                            <Skeleton className="h-8 w-8 rounded-full" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="divide-y">
                    {users?.users
                      ?.filter((user: AppUser) => user.isActive === true)
                      ?.map((user: AppUser) => (
                        <div key={user._id} className="grid grid-cols-12 items-center px-6 py-4">
                          <div className="col-span-4 flex items-center gap-3">
                          <Avatar>
                              <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={`${user.firstName} ${user.lastName}`.trim()} />
                              <AvatarFallback>{user.firstName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{`${user.firstName} ${user.lastName}`.trim()}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                          <div className="col-span-2">
                            <Badge variant={user.isActive === true ? "default" : "outline"}
                            className={
                              user.isActive === true
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : "bg-red-100 text-red-800 hover:bg-red-100"
                            }>{user.isActive? "Active": "Inactive"}</Badge>
                          </div>
                          <div className="col-span-3 text-sm">{user.department ? user.department: "Admin"}</div>
                          <div className="col-span-2 text-sm">{user.role}</div>
                          <div className="col-span-1 text-right">
                            <TableOptions 
                            variant="dotsVertical"
                            options={[
                              {
                                label: "View Profile",
                                onClick: () => {
                                  setSelectedUser(user);
                                  setIsModalOpen(true);
                                },
                                icon: <User className="h-4 w-4" />,
                              },
                              {
                                label: "Edit Profile",
                                onClick: () => {
                                  setSelectedUser(user);
                                  setIsModalOpen(true);
                                  setSelectedUser({ ...user, isEditing: true });
                                },
                                icon: <UserRoundPen  className="h-4 w-4" />,
                              },
                              {
                                label: "Change permissions",
                                onClick: () => {
                                  router.push(`/admin/permissions/${user._id}`);
                                },
                                icon: <Key  className="h-4 w-4" />,
                              },
                              {
                                label: "Export details",
                                onClick: () => {
                                console.log('Eport details');
                                },
                                icon: <CloudDownload  className="h-4 w-4" />,
                              },
                              {
                                label: "Delete User",
                                onClick: () => {
                                  setUserToDelete(user) 
                                  setIsDialogOpen(true) 
                                },
                                icon: <Trash2  className="h-4 w-4" />,
                              },
                            ]}
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="inactive" className="mt-4">
              <div className="overflow-hidden rounded-lg border bg-white">
                <div className="grid grid-cols-12 border-b bg-gray-50 px-6 py-3 text-sm font-medium text-gray-500">
                  <div className="col-span-4">Names</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-3">Department</div>
                  <div className="col-span-2">Role</div>
                  <div className="col-span-1">Actions</div>
                </div>
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <Spinner size="lg" className="mb-4" />
                    <p className="text-sm text-gray-500">Loading inactive users...</p>
                    <div className="w-full px-6 py-4 space-y-4 mt-4">
                      {[...Array(2)].map((_, index) => (
                        <div key={index} className="grid grid-cols-12 items-center gap-4">
                          <div className="col-span-4 flex items-center gap-3">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="space-y-2">
                              <Skeleton className="h-4 w-32" />
                              <Skeleton className="h-3 w-48" />
                            </div>
                          </div>
                          <div className="col-span-2">
                            <Skeleton className="h-6 w-16" />
                          </div>
                          <div className="col-span-3">
                            <Skeleton className="h-4 w-24" />
                          </div>
                          <div className="col-span-2">
                            <Skeleton className="h-4 w-16" />
                          </div>
                          <div className="col-span-1 flex justify-end">
                            <Skeleton className="h-8 w-8 rounded-full" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="divide-y">
                    {users?.users
                      ?.filter((user: AppUser) => user.isActive === false)
                      ?.map((user: AppUser) => (
                        <div key={user._id} className="grid grid-cols-12 items-center px-6 py-4">
                          <div className="col-span-4 flex items-center gap-3">
                          <Avatar>
                              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={`${user.firstName} ${user.lastName}`.trim()} />
                              <AvatarFallback>{user.firstName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{`${user.firstName} ${user.lastName}`.trim()}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                          <div className="col-span-2">
                            <Badge variant={user.isActive === true ? "default" : "outline"}
                            className={
                              user.isActive === true
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : "bg-red-100 text-red-800 hover:bg-red-100"
                            }>
                              {user.isActive? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          <div className="col-span-3 text-sm">{user.department ? user.department: "Admin"}</div>
                          <div className="col-span-2 text-sm">{user.role}</div>
                          <div className="col-span-1 text-right">
                            <TableOptions 
                            variant="dotsVertical"
                            options={[
                              {
                                label: "View Profile",
                                onClick: () => {
                                  setSelectedUser(user);
                                  setIsModalOpen(true);
                                },
                                icon: <User className="h-4 w-4" />,
                              },
                              {
                                label: "Edit Profile",
                                onClick: () => {
                                  setSelectedUser(user);
                                  setIsModalOpen(true);
                                  setSelectedUser({ ...user, isEditing: true });
                                },
                                icon: <UserRoundPen  className="h-4 w-4" />,
                              },
                              {
                                label: "Change permissions",
                                onClick: () => {
                                  router.push(`/admin/permissions/${user._id}`);
                                },
                                icon: <Key  className="h-4 w-4" />,
                              },
                              {
                                label: "Export details",
                                onClick: () => {
                                console.log('Eport details');
                                },
                                icon: <CloudDownload  className="h-4 w-4" />,
                              },
                              {
                                label: "Delete User",
                                onClick: () => {
                                  setUserToDelete(user) 
                                  setIsDialogOpen(true) 
                                },
                                icon: <Trash2  className="h-4 w-4" />,
                              },
                            ]}
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      {selectedUser && (
        <ViewEditProfileModal
          user={selectedUser as any}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      <DeleteConfirmatioNodal
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onConfirm={handleDeleteUser}
        title="Confirm User Deletion"
        description="Are you sure you want to delete this user? All data associated with this account will be permanently removed. This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
  </div>
  )
}

export default Admin