'use client'
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Package,
  PackagePlus,
  RefreshCw,
  Trash2
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MainNav } from "@/components/admin/main-nav";
import { Search } from "@/components/admin/search";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserNav } from "@/components/admin/user-nav";
import { useRouter } from "next/navigation";
import { FileSearch, ArrowUpDown, Eye } from 'lucide-react';
import { useCustomerStore } from '@/store/customerStore';
import Loader from "@/components/Loader";
import React, { useState, useMemo, useEffect } from 'react';
import { Customer, Product } from '@/types/types';
interface User {
  _id: string;
  fullName: string;
  email: string;
  password: string;
  userType: string;
  createdAt: string;
  updatedAt: string;
}

function Salesman() {
  const router = useRouter();
  const [salesmen, setSalesmen] = useState<User[]>([]);
  const [isLoading,setIsLoading] = useState(false);
  useEffect(() => {
    const fetchSalesmen = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/users/get-all-salesman');
        if (!response.ok) {
          throw new Error('Failed to fetch salesmen');
        }
        const data = await response.json();
        setSalesmen(data.salesmen);
      } catch (error) {
        console.error('Error fetching salesmen:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSalesmen();
  }, []);


  const handleNewSalesman = () => {
    router.push('/admin/sales/new-salesman');
  }

  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Customer | null;
    direction: 'asc' | 'desc';
  }>({ key: null, direction: 'asc' });


  const filteredSalesmen = useMemo(() => {
    console.log("filter :", salesmen);
    let filtered = salesmen.filter((sales) =>
      sales.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered;
  }, [salesmen,searchTerm, sortConfig]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    )
  }
  const handleViewSalesman = (customerId: string) => {
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
          <h1 className="text-3xl font-bold text-primary">Salesman Dashboard</h1>

          {/*Action Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

            <Card className="p-4">
              <Button
                variant="outline"
                className="w-full h-full min-h-[100px] flex flex-col gap-2"
                onClick={handleNewSalesman}
              >
                <PackagePlus className="h-6 w-6" />
                <span>Add new Salesman</span>
              </Button>
            </Card>

            <Card className="p-4">
              <Button
                variant="outline"
                className="w-full h-full min-h-[100px] flex flex-col gap-2 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-6 w-6" />
                <span>Delete Salesman</span>
              </Button>
            </Card>
          </div>

          {/* Products Table */}
          <div className="min-h-screen bg-background p-3 sm:p-4">
            <div className="max-w-9xl mx-auto space-y-3">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                <h1 className="text-xl font-semibold">Salesmen</h1>
                <div className="relative w-full sm:w-64">
                  <FileSearch className="absolute left-2 top-2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search salesman..."
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
                            className="hover:bg-transparent px-0 text-l font-bold "
                          >
                            Name
                          </Button>
                        </th>
                        <th className="h-8 px-3 text-left align-middle ">
                          <Button
                            variant="ghost"
                            className="hover:bg-transparent px-0 text-l font-bold "
                          >
                            Email
                          </Button>
                        </th>
            
                        <th className="h-8 px-3 text-left align-middle text-l font-bold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSalesmen.map((sales) => (
                        <tr key={sales._id} className="border-b hover:bg-muted/50">
                          <td className="px-3 py-2 align-middle text-sm">{sales.fullName}</td>
                          <td className="px-3 py-2 align-middle text-sm">{sales.email}</td>
                          <td className="px-3 py-2 align-middle">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewSalesman(sales._id)}
                              className="h-7 font-bold bg-yellow-600"
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

export default Salesman;




