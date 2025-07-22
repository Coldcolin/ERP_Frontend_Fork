"use client"

import React, { useState, useEffect } from "react"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useGetSingleUserQuery, useGrantPermissionsMutation } from "@/lib/redux/api/userApi"
import { Spinner } from "@/components/ui/spinner"
import { useRouter } from 'next/navigation'


// Define User type based on API response structure
type User = {
  name: string;
  email: string;
  department?: string;
  role?: string;
  firstName: string; 
  isActive: boolean;
  isAdministrator: boolean;
  isSuperAdmin: boolean;
  lastName: string;
  permissions: string[];
  phoneNumber: string;
  _id: string;
}

// Define UserData type that contains user object
type UserData = {
  user: User;
}

type UserManagementModuleProps = {
  params: {
    id: string;
  };
};

// List of all available permissions
const allPermissions = [
  "add_driver",
  "edit_driver",
  "delete_driver",
  "create_trip",
  "edit_trip",
  "delete_trip",
  "assign_vehicle",
  "track_vehicle",
  "add_asset_vehicle",
  "create_maintenance_request",
  "view_fleet_report",
  "view_financial_reports",
  "create_invoice",
  "edit_invoice",
  "delete_invoice",
  "manage_payroll",
  "approve_budget",
  "track_expenses",
  "manage_accounts",
  "create_delivery_order",
  "edit_delivery_order",
  "cancel_delivery",
  "track_shipment",
  "manage_warehouse_inventory",
  "assign_delivery_personnel",
  "schedule_pickup",
  "view_logistics_report",
  "add_new_customer",
  "edit_customer_information",
  "delete_customer",
  "track_customer_interaction",
  "assign_sales_representative",
  "view_customer_feedback",
  "generate_quote",
  "edit_quote",
  "change_quote_status",
  "delete_quote",
  "generate_crm_reports",
  "create_shipment_job_file",
  "upload_documents",
  "delete_job_file",
  "delete_document",
  "generate_operations_invoice",
  "close_job_file",
  "generate_operations_report",
  "add_pricing_customer",
  "edit_pricing_customer_info",
  "delete_pricing_customer",
  "assign_pricing_sales_rep",
  "generate_pricing_quote",
  "edit_pricing_quote",
  "change_pricing_quote_status",
  "delete_pricing_quote",
  "generate_quote_summary_reports"
];

// Helper function to format permission display name
const formatPermissionName = (permission: string): string => {
  return permission
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export default function UserManagementModule({ params }: UserManagementModuleProps) {
  const userId = params.id;
  const router = useRouter();
  
  // Fetch user data using the id from params
  const { data: userData, isLoading, isError } = useGetSingleUserQuery(userId);
  
  // Grant permissions mutation
  const [grantPermissions, { isLoading: isUpdating }] = useGrantPermissionsMutation();
  console.log(grantPermissions)
  // Initialize permissions state with all permissions set to false
  const [permissions, setPermissions] = useState<Record<string, boolean>>({});

  // const [selectedRole, setSelectedRole] = useState("Fleet Admin");
  
  // State for update status
  const [updateStatus, setUpdateStatus] = useState<{ success?: boolean; message?: string } | null>(null);
  
  // Update component state when user data is loaded
  useEffect(() => {
    if (userData?.user) {
      console.log('User data loaded:', userData);
      
      // Initialize permissions based on user data
      const userPermissions: Record<string, boolean> = {};
      
      // Set all permissions to false initially
      allPermissions.forEach((perm: string) => {
        userPermissions[perm] = false;
      });
      
      // Set permissions from user data to true
      if (userData.user.permissions && Array.isArray(userData.user.permissions)) {
        userData.user.permissions.forEach((perm: string) => {
          if (allPermissions.includes(perm)) {
            userPermissions[perm] = true;
          }
        });
      }
      
      setPermissions(userPermissions);
      
      // Set role if available
      // if (userData.user.role) {
      //   setSelectedRole(userData.user.role);
      // }
    }
  }, [userData]);

  const handlePermissionChange = (permission: string) => {
    setPermissions(prev => ({
      ...prev,
      [permission]: !prev[permission],
    }));
  };

  const handleUpdate = async () => {
    try {
      // Get the list of enabled permissions
      // const enabledPermissions = Object.entries(permissions)
      //   .filter(([isEnabled]) => isEnabled)
      //   .map(([permission]) => permission);
      
      // console.log(`Updating permissions for user ${userId}:`, enabledPermissions);
      
      // Call the API to update the user's permissions
      // const result = await grantPermissions({
      //   id: userId,
      //   permissions: enabledPermissions
      // }).unwrap();
      
      setUpdateStatus({
        success: true,
        message: 'Permissions updated successfully!'
      });
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setUpdateStatus(null);
      }, 3000);
      
    } catch (error) {
      console.error('Failed to update permissions:', error);
      setUpdateStatus({
        success: false,
        message: 'Failed to update permissions. Please try again.'
      });
    }
  };

  const handleCancel = () => {
    console.log(`Cancelling changes for user ${userId}`);
    // Reset permissions to original state from userData
    if (userData?.user?.permissions) {
      const userPermissions: Record<string, boolean> = {};
      
      // Reset all to false
      allPermissions.forEach((perm: string) => {
        userPermissions[perm] = false;
      });
      
      // Set user's permissions to true
      userData.user.permissions.forEach((perm: string) => {
        if (allPermissions.includes(perm)) {
          userPermissions[perm] = true;
        }
      });
      
      setPermissions(userPermissions);
    }
  };

  // Show loading state while fetching user data
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-10 bg-white flex flex-col items-center justify-center h-64">
        <Spinner size="lg" />
        <p className="mt-4 text-gray-500">Loading user data...</p>
      </div>
    );
  }

  // Show error state if fetching user data fails
  if (isError) {
    return (
      <div className="max-w-4xl mx-auto p-10 bg-white">
        <div className="p-4 border border-red-200 rounded-lg bg-red-50 text-red-700">
          <h2 className="text-lg font-semibold mb-2">Error Loading User</h2>
          <p>There was a problem loading the user data. Please try again later.</p>
        </div>
      </div>
    );
  }

  // Type assertion for userData
  const typedUserData = userData as UserData | undefined;
  const userName = typedUserData?.user?.firstName + " " + typedUserData?.user?.lastName || "User";

  // Group permissions by category for better organization
  const permissionCategories = {
    "Fleet Management": allPermissions.filter((p: string) => 
      p.includes("driver") || p.includes("vehicle") || p.includes("trip") || 
      p.includes("fleet") || p.includes("maintenance")
    ),
    "Financial": allPermissions.filter((p: string) => 
      p.includes("invoice") || p.includes("financial") || p.includes("payroll") || 
      p.includes("budget") || p.includes("expenses") || p.includes("accounts")
    ),
    "Logistics": allPermissions.filter((p: string) => 
      p.includes("delivery") || p.includes("shipment") || p.includes("warehouse") || 
      p.includes("pickup") || p.includes("logistics")
    ),
    "Customer Management": allPermissions.filter((p: string) => 
      p.includes("customer") || p.includes("sales") || p.includes("feedback") || 
      p.includes("quote") || p.includes("crm")
    ),
    "Operations": allPermissions.filter((p: string) => 
      p.includes("job") || p.includes("document") || p.includes("operations") || 
      p.includes("pricing")
    ),
  };

  return (
    <div className="max-w-4xl mx-auto p-10 bg-white">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
        <span className="hover:text-gray-700 cursor-pointer" onClick={() => router.push('/admin')}>User Management</span>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 font-medium">{userName}</span>
      </nav>

      {/* Main Heading */}
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">{userName}</h1>

      {/* Tabs */}
      <Tabs defaultValue="permissions" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="p-4 border rounded-lg">
            {typedUserData?.user ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  <p className="text-gray-900">{typedUserData.user.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Department</h3>
                  <p className="text-gray-900">{typedUserData.user.department || 'Not specified'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <p className="text-gray-900">{typedUserData.user.isActive ? 'Active' : 'Inactive'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Permissions Count</h3>
                  <p className="text-gray-900">{typedUserData.user.permissions?.length || 0} permissions granted</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-600">Overview content would go here...</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="permissions" className="mt-6">
          <div className="space-y-6">
            {/* Current Role(s) Section */}
          <div>
              {/* <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Role(s)</h2> */}
              <div className="space-y-2">
                {/* <label className="text-sm font-medium text-gray-700">Select Role :</label> */}
                {/* <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="w-48 bg-gray-50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fleet Admin">Fleet Admin</SelectItem>
                    <SelectItem value="Fleet Manager">Fleet Manager</SelectItem>
                    <SelectItem value="Driver">Driver</SelectItem>
                    <SelectItem value="Viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select> */}
              </div>
            </div>

            {/* Granular Permissions Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Granular Permissions</h2>
              
              {/* Render permissions by category */}
              {Object.entries(permissionCategories).map(([category, categoryPermissions]) => (
                <div key={category} className="mb-6">
                  <h3 className="text-md font-medium text-gray-800 mb-3">{category}</h3>
                  <div className="space-y-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                    {categoryPermissions.map(permission => (
                      <div key={permission} className="flex items-center space-x-3">
                        <Checkbox
                          id={permission}
                          checked={permissions[permission] || false}
                          onCheckedChange={() => handlePermissionChange(permission)}
                        />
                        <label htmlFor={permission} className="text-sm font-medium text-gray-700">
                          {formatPermissionName(permission)}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Note */}
              <p className="text-xs text-gray-500 mt-4">
                Changes to permissions will take effect immediately after updating. User may need to log out and log back in for changes to be applied.
              </p>
            </div>

            {/* Status Message */}
            {updateStatus && (
              <div className={`p-3 rounded-md mt-4 ${updateStatus.success ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {updateStatus.message}
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-6">
              <Button variant="outline" onClick={handleCancel} className="px-8 py-2 bg-transparent" disabled={isUpdating}>
                Cancel
              </Button>
              <Button 
                onClick={handleUpdate} 
                className="px-8 py-2 bg-slate-900 hover:bg-slate-800"
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Updating...
                  </>
                ) : 'Update'}
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
