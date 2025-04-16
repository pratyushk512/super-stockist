"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { MainNav } from "@/components/admin/main-nav"
import { Search } from "@/components/admin/search"
import { UserNav } from "@/components/admin/user-nav"
import { Order, OrderStatus } from "@/types/types"
import { useOrdersStore } from "@/store/ordersStore"
import Loader from "@/components/Loader"

const statusColors: { [key in OrderStatus]: string } = {
    Pending: "bg-yellow-500/10 text-yellow-500",
    Cancelled: "bg-red-500/10 text-red-500",
    Completed: "bg-green-500/10 text-green-500",
}

export default function OrdersTable() {
    const { orders, isLoading, error, fetchOrders } = useOrdersStore()
    const router = useRouter()
    
    const [filters, setFilters] = useState({
        orderNo: "",
        status: "",
        customerName: "",
        orderDate: "",
    })

    useEffect(() => {
        fetchOrders()
    }, []) 

    const filteredOrders = Array.isArray(orders)
        ? orders.filter((order) =>
            order.orderNo.toString().includes(filters.orderNo) &&
            order.status.toLowerCase().includes(filters.status.toLowerCase()) &&
            order.companyName.toLowerCase().includes(filters.customerName.toLowerCase()) &&
            order.orderDate.includes(filters.orderDate)
        )
        : []

    const handleViewOrder = (orderNo: number) => {
        console.log("View Order:", orderNo)
        router.push(`/admin/orders/${orderNo}`)
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader />
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg text-red-500">Error: {error}</div>
            </div>
        )
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
            <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">Orders</h1>
                        <p className="text-muted-foreground">Manage your orders and their status</p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => router.push("/admin/products/store")}
                    >
                        New Order
                    </Button>
                    <Button 
                        onClick={() => fetchOrders()} 
                        variant="outline"
                    >
                        Refresh Orders
                    </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Input
                        placeholder="Filter Order No."
                        value={filters.orderNo}
                        onChange={(e) => setFilters({ ...filters, orderNo: e.target.value })}
                    />
                    <Input
                        placeholder="Filter Status"
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    />
                    <Input
                        placeholder="Filter Customer Name"
                        value={filters.customerName}
                        onChange={(e) => setFilters({ ...filters, customerName: e.target.value })}
                    />
                    <Input
                        type="date"
                        value={filters.orderDate}
                        onChange={(e) => setFilters({ ...filters, orderDate: e.target.value })}
                    />
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order No.</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Customer Name</TableHead>
                                <TableHead className="hidden sm:table-cell">Order Date</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredOrders.map((order) => (
                                <TableRow key={order.orderNo}>
                                    <TableCell className="font-medium">{order.orderNo}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className={statusColors[order.status]}>
                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{order.companyName}</TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                        {new Date(order.orderDate).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            onClick={() => handleViewOrder(order.orderNo)}
                                        >
                                            View Order
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </>
    )
}