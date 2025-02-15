'use client'
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BarChart3,
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


import React, { useState, useMemo } from 'react';


interface Product {
  id: number;
  name: string;
  price: number;
  unitsSold: number;
  currentStock: number;
  category: string;
}

const initialProducts: Product[] = [
  { id: 1, name: "Laptop Pro",category:"Electronics", price: 1299.99, unitsSold: 150, currentStock: 50 },
  { id: 2, name: "Wireless Mouse",category:"Home", price: 29.99, unitsSold: 300, currentStock: 200 },
  { id: 3, name: "Mechanical Keyboard",category:"Accessories", price: 159.99, unitsSold: 200, currentStock: 75 },
  { id: 4, name: "4K Monitor",category:"Screen", price: 499.99, unitsSold: 100, currentStock: 25 },
  { id: 5, name: "USB-C Hub",category:"Accessories", price: 49.99, unitsSold: 400, currentStock: 150 },
];

function App() {
  const router = useRouter();
  const handleStoreClick = () => {
    router.push('/admin/products/store');
  }

  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Product | null;
    direction: 'asc' | 'desc';
  }>({ key: null, direction: 'asc' });

  const handleSort = (key: keyof Product) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === 'asc'
          ? 'desc'
          : 'asc',
    });
  };

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = initialProducts.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key!] < b[sortConfig.key!]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key!] > b[sortConfig.key!]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [searchTerm, sortConfig]);

  const handleViewProduct = (productId: number) => {
    alert(`Viewing product ${productId}`);
  };
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
          <h1 className="text-3xl font-bold text-primary">Product Dashboard</h1>

          {/*Action Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <Button
                variant="outline"
                className="w-full h-full min-h-[100px] flex flex-col gap-2"
                onClick={handleStoreClick}
              >
                <Package className="h-6 w-6" />
                <span>Product Store</span>
              </Button>
            </Card>

            <Card className="p-4">
              <Button
                variant="outline"
                className="w-full h-full min-h-[100px] flex flex-col gap-2"
              >
                <RefreshCw className="h-6 w-6" />
                <span>Update Stock</span>
              </Button>
            </Card>

            <Card className="p-4">
              <Button
                variant="outline"
                className="w-full h-full min-h-[100px] flex flex-col gap-2"
              >
                <PackagePlus className="h-6 w-6" />
                <span>Add new Product</span>
              </Button>
            </Card>

            <Card className="p-4">
              <Button
                variant="outline"
                className="w-full h-full min-h-[100px] flex flex-col gap-2 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-6 w-6" />
                <span>Delete Product</span>
              </Button>
            </Card>
          </div>

          {/* Products Table */}
          <div className="min-h-screen bg-background p-3 sm:p-4">
            <div className="max-w-9xl mx-auto space-y-3">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                <h1 className="text-xl font-semibold">Products</h1>
                <div className="relative w-full sm:w-64">
                  <FileSearch className="absolute left-2 top-2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
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
                            onClick={() => handleSort('name')}
                            className="hover:bg-transparent px-0 text-l font-bold "
                          >
                            Name
                            <ArrowUpDown className="ml-1 h-3 w-3" />
                          </Button>
                        </th>
                        <th className="h-8 px-3 text-left align-middle ">
                          <Button
                            variant="ghost"
                            onClick={() => handleSort('category')}
                            className="hover:bg-transparent px-0 text-l font-bold "
                          >
                            Category
                            <ArrowUpDown className="ml-1 h-3 w-3" />
                          </Button>
                        </th>
                        <th className="h-8 px-3 text-left align-middle">
                          <Button
                            variant="ghost"
                            onClick={() => handleSort('price')}
                            className="hover:bg-transparent px-0 text-l font-bold"
                          >
                            Price
                            <ArrowUpDown className="ml-1 h-3 w-3" />
                          </Button>
                        </th>
                        <th className="h-8 px-3 text-left align-middle">
                          <Button
                            variant="ghost"
                            onClick={() => handleSort('unitsSold')}
                            className="hover:bg-transparent px-0 text-l font-bold"
                          >
                            Units Sold
                            <ArrowUpDown className="ml-1 h-3 w-3" />
                          </Button>
                        </th>
                        <th className="h-8 px-3 text-left align-middle">
                          <Button
                            variant="ghost"
                            onClick={() => handleSort('currentStock')}
                            className="hover:bg-transparent px-0 text-l font-bold"
                          >
                            Current Stock
                            <ArrowUpDown className="ml-1 h-3 w-3" />
                          </Button>
                        </th>
                        <th className="h-8 px-3 text-left align-middle text-l font-bold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAndSortedProducts.map((product) => (
                        <tr key={product.id} className="border-b hover:bg-muted/50">
                          <td className="px-3 py-2 align-middle text-sm">{product.name}</td>
                          <td className="px-3 py-2 align-middle text-sm">{product.category}</td>
                          <td className="px-3 py-2 align-middle text-sm">${product.price.toFixed(2)}</td>
                          <td className="px-3 py-2 align-middle text-sm">{product.unitsSold}</td>
                          <td className="px-3 py-2 align-middle text-sm">{product.currentStock}</td>
                          <td className="px-3 py-2 align-middle">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewProduct(product.id)}
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




