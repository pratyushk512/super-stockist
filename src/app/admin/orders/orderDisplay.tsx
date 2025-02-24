"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Edit2, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Loader from "@/components/Loader"
import { Order } from "@/types/types"
import { MainNav } from "@/components/admin/main-nav"
import { Search } from "@/components/admin/search"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserNav } from "@/components/admin/user-nav"

export default function OrderDisplay({ orderNumber }: { orderNumber: number }) {
    const [order, setOrder] = useState<Order | null>(null)
    const [editMode, setEditMode] = useState(false)
    const [editedOrder, setEditedOrder] = useState<Partial<Order>>({})

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await fetch(`/api/orders/orderNumber`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ orderNumber }),
                })

                if (!response.ok) throw new Error("Failed to fetch order")
                const data = await response.json()
                console.log("Fetched Data:", data.formattedOrder)
                setOrder({ ...data.formattedOrder })
            } catch (error) {
                console.error("Error fetching order:", error)
            }
        }
        fetchOrder()
    }, [orderNumber])

    useEffect(() => {
        console.log("Order state updated:", order)
    }, [order])

    const handleEdit = () => {
        setEditMode(true)
    }

    const handleSave = async () => {
        try {
            const response = await fetch(`/api/orders/${orderNumber}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editedOrder),
            })
            if (!response.ok) throw new Error("Failed to update order")
            const updatedOrder = await response.json()
            setOrder(updatedOrder)
            setEditMode(false)
        } catch (error) {
            console.error("Error updating order:", error)
        }
    }

    const handleChange = (field: string, value: string | number) => {
        setEditedOrder((prev) => ({ ...prev, [field]: value }))
    }

    const handleItemChange = (index: number, field: string, value: number) => {
        setEditedOrder((prev) => ({
            ...prev,
            items: prev.items?.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
        }))
    }

    if (!order) return <Loader />

    return (
        <>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Order #{order.orderNumber}</h2>
                    {editMode ? (
                        <Button onClick={handleSave}>
                            <Save className="mr-2 h-4 w-4" /> Save Changes
                        </Button>
                    ) : (
                        <Button onClick={handleEdit}>
                            <Edit2 className="mr-2 h-4 w-4" /> Edit Order
                        </Button>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Customer Name</label>
                        {editMode ? (
                            <Input
                                value={editedOrder.customerName || ""}
                                onChange={(e) => handleChange("customerName", e.target.value)}
                            />
                        ) : (
                            <p>{order.customerName}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Order Date</label>
                        {editMode ? (
                            <Input
                                type="date"
                                value={
                                    order.orderDate
                                        ? format(new Date(order.orderDate), "yyyy-MM-dd")
                                        : ""
                                }
                                onChange={(e) => handleChange("orderDate", e.target.value)}
                            />
                        ) : (
                            <p>
                                {order.orderDate
                                    ? format(new Date(order.orderDate), "MMMM d, yyyy")
                                    : "N/A"}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Status</label>
                        {editMode ? (
                            <Select
                                value={editedOrder.status || order.status}
                                onValueChange={(value) => handleChange("status", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="packed">Packed</SelectItem>
                                    <SelectItem value="paymentPending">Payment Pending</SelectItem>
                                    <SelectItem value="paid">Paid</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                        ) : (
                            <p className="capitalize">{order.status}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Total Amount</label>
                        <p>₹{Number(order.totalAmount).toFixed(2)}</p>
                    </div>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Product ID</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Total</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {order.items.map((item, index) => (
                            <TableRow key={item.productId}>
                                <TableCell>{item.productId}</TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                <TableCell>
                                    {editMode ? (
                                        <Input
                                            type="number"
                                            value={
                                                editedOrder.items?.[index]?.priceAtTime ||
                                                item.priceAtTime
                                            }
                                            onChange={(e) =>
                                                handleItemChange(
                                                    index,
                                                    "priceAtTime",
                                                    Number.parseFloat(e.target.value)
                                                )
                                            }
                                            className="w-24"
                                        />
                                    ) : (
                                        `₹${Number(item.priceAtTime).toFixed(2)}`
                                    )}
                                </TableCell>
                                <TableCell>₹{Number(item.total).toFixed(2)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <div>
                    <h3 className="text-lg font-semibold">Created By</h3>
                    <p>
                        {order.createdBy.name} ({order.createdBy.userType})
                    </p>
                </div>
            </div>
        </>
    )
}
