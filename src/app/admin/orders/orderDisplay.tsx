"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Edit2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Loader from "@/components/Loader";
import { Order, OrderItem } from "@/types/types";
import { title } from "process";
import { useToast } from "@/hooks/use-toast";
import { RainbowButton } from "@/components/magicui/rainbow-button";

export default function OrderDisplay({ orderNo }: { orderNo: number }) {
    const [order, setOrder] = useState<Order | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [editedOrder, setEditedOrder] = useState<Partial<Order>>({});
    const {toast}=useToast()
    const router=useRouter()
    const handleGenerateInvoice = async () => {
        if (order?.status === "Completed" || order?.status === "Cancelled") {
            toast({
                title: "Cannot generate invoice for completed or cancelled orders",
                variant: "destructive",
            });
            return;
        }
    
        const baseAmount = Number(order?.totalAmount ?? 0); 
        const gstAmount = baseAmount * 0.18;
        const totalAmount = baseAmount + gstAmount;
    
        const invoiceRequest = {
            invoiceDate: order?.orderDate,
            orderId: order?._id,
            gstAmount,
            gstPercentage: 0.18,
            totalAmount: Number(totalAmount.toFixed(2)), 
        };
    
        console.log("Invoice Request:", invoiceRequest);
    
        const invoice = await fetch(`/api/invoices/generate-invoice`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(invoiceRequest),
        });
    
        if (!invoice.ok) {
            toast({
                title: "Error generating invoice",
                variant: "destructive",
            });
            router.refresh();
            return;
        } else {
            toast({
                title: "Invoice generated successfully",
                variant: "default",
            });
        }
    };
    
    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await fetch(`/api/orders/orderNumber`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ orderNo }),
                });

                if (!response.ok) throw new Error("Failed to fetch order");
                const data = await response.json();
                setOrder(data.formattedOrder);
            } catch (error) {
                console.error("Error fetching order:", error);
            }
        };
        fetchOrder();
    }, [orderNo, order?.status]);

    useEffect(() => {
        console.log(editedOrder);
    }, [editedOrder]);

    const handleEdit = () => {
        if(order?.status==="Completed" || order?.status==="Cancelled"){
            toast({
                title: "Cannot edit completed or cancelled orders",
                variant: "destructive",
            });
            return;
        }
        if (order) {
            setEditedOrder({ ...order });
        }
        setEditMode(true);
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`/api/orders/update-order/${orderNo}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editedOrder),
            });

            if (!response.ok) throw new Error("Failed to update order");

            const updatedOrder = await response.json();
            setOrder(updatedOrder);
            setEditedOrder({});
            setEditMode(false);
        } catch (error) {
            console.error("Error updating order:", error);
        }
    };

    const handleChange = (field: string, value: string | number) => {
        setEditedOrder((prev) => ({ ...prev, [field]: value }));
    };

    const handleItemChange = (index: number, field: keyof Order["items"][0], value: number) => {
        setEditedOrder((prev:any) => {
            const updatedItems = prev.items
                ? prev.items.map((item:any, i:any) =>
                      i === index
                          ? {
                                ...item,
                                [field]: value,
                                total: (field === "quantity" || field === "priceAtTime")
                                    ? (field === "quantity" ? value : item.quantity || 1) *
                                      (field === "priceAtTime" ? value : Number(item.priceAtTime) || 0)
                                    : item.total,
                            }
                          : item
                  )
                : order?.items.map((item, i) =>
                      i === index
                          ? {
                                ...item,
                                [field]: value,
                                total: (field === "quantity" || field === "priceAtTime")
                                    ? (field === "quantity" ? value : item.quantity || 1) *
                                      (field === "priceAtTime" ? value : Number(item.priceAtTime) || 0)
                                    : item.total,
                            }
                          : item
                  );

            const newTotalAmount = updatedItems?.reduce((sum:any, item:any) => sum + Number(item.total), 0) || 0;

            return { ...prev, items: updatedItems, totalAmount: newTotalAmount };
        });
    };

    
    if (!order) return <Loader />;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Order #{order.orderNo}</h2>
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
                    <p>{order.companyName}</p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Order Date</label>
                    {editMode ? (
                        <Input
                            type="date"
                            value={editedOrder.orderDate ? format(new Date(editedOrder.orderDate), "yyyy-MM-dd") : ""}
                            onChange={(e) => handleChange("orderDate", e.target.value)}
                        />
                    ) : (
                        <p>{order.orderDate ? format(new Date(order.orderDate), "MMMM d, yyyy") : "N/A"}</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    {editMode ? (
                        <Select
                            value={editedOrder.status ?? order.status}
                            onValueChange={(value) => handleChange("status", value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="Completed">Completed</SelectItem>
                                <SelectItem value="Cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                    ) : (
                        <p className="capitalize">{order.status}</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Total Amount</label>
                    <p>₹{Number(editedOrder.totalAmount ?? order.totalAmount).toFixed(2)}</p>
                </div>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Product Name</TableHead>
                        <TableHead>HSN</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Total</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {order.items.map((item, index) => (
                        <TableRow key={item.productId}>
                            <TableCell>{item.productName}</TableCell>
                            <TableCell>{item.hsn}</TableCell>
                            <TableCell>
                                {editMode ? (
                                    <Input
                                        type="number"
                                        value={
                                            editedOrder.items?.[index]?.quantity ??
                                            item.quantity
                                        }
                                        onChange={(e) =>
                                            handleItemChange(index, "quantity", Number(e.target.value))
                                        }
                                        className="w-24"
                                    />
                                ) : (
                                    item.quantity
                                )}
                            </TableCell>
                            <TableCell>
                                {editMode ? (
                                    <Input
                                        type="number"
                                        value={
                                            editedOrder.items?.[index]?.priceAtTime ??
                                            item.priceAtTime
                                        }
                                        onChange={(e) =>
                                            handleItemChange(index, "priceAtTime", Number.parseFloat(e.target.value))
                                        }
                                        className="w-24"
                                    />
                                ) : (
                                    `₹${Number(item.priceAtTime).toFixed(2)}`
                                )}
                            </TableCell>
                            <TableCell>₹{Number(editedOrder.items?.[index]?.total ?? item.total).toFixed(2)}</TableCell>
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
            <div className="flex justify-center mt-20">
                <RainbowButton onClick={handleGenerateInvoice}>Generate Invoice</RainbowButton>
            </div>
        </div>
    );
}
