'use client'
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  PackagePlus,
  Trash2
} from "lucide-react";
import { MainNav } from "@/components/admin/main-nav";
import { Search } from "@/components/admin/search";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserNav } from "@/components/admin/user-nav";
import { useRouter } from "next/navigation";
import { FileSearch, ArrowUpDown, Eye } from 'lucide-react';
import { useCustomerStore } from '@/store/customerStore';
import Loader from "@/components/Loader";
import React, { useState, useMemo, useEffect } from 'react';
import { Customer} from '@/types/types';


function App() {
  const router = useRouter();
  const customers = useCustomerStore((state) => state.customers);
  const isLoading = useCustomerStore((state) => state.isLoading);
  const fetchCustomers = useCustomerStore((state) => state.fetchCustomers);

  useEffect(() => {
    fetchCustomers();
  }, []);

//   const handleStoreClick = () => {
//     router.push('/admin/products/store');
//   }
  const handleNewCustomer = () => {
    router.push('/admin/customers/new-customer');
  }

  const [searchTerm, setSearchTerm] = useState('');
 

  const filteredAndSortedCustomers = useMemo(() => {
    console.log("filter :", customers);
    const filtered = customers.filter((cust) =>
      cust.companyName.toLowerCase().includes(searchTerm.toLowerCase())
    );


    return filtered;
  }, [customers,searchTerm]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    )
  }
  const handleViewCustomer = (customerId: string) => {
    router.push(`/admin/customers/${customerId}`)
}

  return (
    <>
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <MainNav className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            <Search />
            <ThemeToggle />
            <UserNav />
          </div>
        </div>
      </div>
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <h1 className="text-3xl font-bold text-primary">Customer Dashboard</h1>

          {/*Action Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

            <Card className="p-4">
              <Button
                variant="outline"
                className="w-full h-full min-h-[100px] flex flex-col gap-2"
                onClick={handleNewCustomer}
              >
                <PackagePlus className="h-6 w-6" />
                <span>Add new Customer</span>
              </Button>
            </Card>

            <Card className="p-4">
              <Button
                variant="outline"
                className="w-full h-full min-h-[100px] flex flex-col gap-2 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-6 w-6" />
                <span>Delete Customer</span>
              </Button>
            </Card>
          </div>

          {/* Products Table */}
          <div className="min-h-screen bg-background p-3 sm:p-4">
            <div className="max-w-9xl mx-auto space-y-3">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                <h1 className="text-xl font-semibold">Customers</h1>
                <div className="relative w-full sm:w-64">
                  <FileSearch className="absolute left-2 top-2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search customers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 h-8 text-sm"
                  />
                </div>
              </div>

              <div className="rounded-md border bg-card">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                      <th className="h-8 px-3 text-left align-middle ">
                          <Button
                            variant="ghost"
                            // {onClick={() => handleSort('name')}}
                            className="hover:bg-transparent px-0 text-l font-bold "
                          >
                            CustomerId
                            <ArrowUpDown className="ml-1 h-3 w-3" />
                          </Button>
                        </th>
                        <th className="h-8 px-3 text-left align-middle ">
                          <Button
                            variant="ghost"
                            // {onClick={() => handleSort('name')}}
                            className="hover:bg-transparent px-0 text-l font-bold "
                          >
                            Name
                            <ArrowUpDown className="ml-1 h-3 w-3" />
                          </Button>
                        </th>
                        <th className="h-8 px-3 text-left align-middle ">
                          <Button
                            variant="ghost"
                            // {onClick={() => handleSort('category')}}
                            className="hover:bg-transparent px-0 text-l font-bold "
                          >
                            Phone
                            <ArrowUpDown className="ml-1 h-3 w-3" />
                          </Button>
                        </th>
                        <th className="h-8 px-3 text-left align-middle">
                          <Button
                            variant="ghost"
                            // {onClick={() => handleSort('price')}}
                            className="hover:bg-transparent px-0 text-l font-bold"
                          >
                            E-Mail
                            <ArrowUpDown className="ml-1 h-3 w-3" />
                          </Button>
                        </th>
                        <th className="h-8 px-3 text-left align-middle">
                          <Button
                            variant="ghost"
                            // {onClick={() => handleSort('unitsSold')}}
                            className="hover:bg-transparent px-0 text-l font-bold"
                          >
                            Address
                            <ArrowUpDown className="ml-1 h-3 w-3" />
                          </Button>
                        </th>
                        <th className="h-8 px-3 text-left align-middle text-l font-bold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAndSortedCustomers.map((cust) => (
                        <tr key={cust._id} className="border-b hover:bg-muted/50">
                          <td className="px-3 py-2 align-middle text-sm">{cust._id}</td>
                          <td className="px-3 py-2 align-middle text-sm">{cust.companyName}</td>
                          <td className="px-3 py-2 align-middle text-sm">{cust.phone}</td>
                          <td className="px-3 py-2 align-middle text-sm">{cust.email}</td>
                          <td className="px-3 py-2 align-middle text-sm">{cust.address}</td>
                          <td className="px-3 py-2 align-middle">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewCustomer(cust._id)}
                              className="h-7 font-bold bg-orange-600"
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default App;




