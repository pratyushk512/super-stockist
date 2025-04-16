import { connectDB } from "@/db/connectDB";
import Invoice from "@/models/invoices/invoice.model";
import Order from "@/models/orders/order.model";
import Customer from "@/models/customers/customer.model";
import { NextRequest, NextResponse } from "next/server";
connectDB();
export async function POST(request: NextRequest) {
    const reqBody = await request.json();
    const { invoiceNumber } = reqBody;
    console.log("Request body:", reqBody);
    const invoice = await Invoice.findOne({ invoiceNumber });
    if (!invoice) {
        return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }
    const order = await Order.findById(invoice.orderId);
    if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    const customer = await Customer.findById(order.customerId);
    if (!customer) {
        return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }
    const formattedOrder ={
        ...order.toObject(),
        totalAmount:order.totalAmount.toString(),
        items:order.items.map((item:any) => ({
            ...item.toObject(),
            priceAtTime: item.priceAtTime.toString(),
            total: item.total.toString(),
        })),
    }
    const invoiceData = {
        invoiceNumber: invoice.invoiceNumber,
        invoiceDate: invoice.invoiceDate,
        orderDate: formattedOrder.orderDate,
        seller: {
            name: "JN Traders",
            address: "Bye Lane,West Market Road,Upper Bazar",
            city: "Ranchi,Jharkhand, 834001",
            email: "",
            phone: "+91 9431596720",
            taxId: "GSTIN: 20XXXXXXXXXXXXXXX",
        },
        customer: {
            company: customer.companyName,
            address: customer.address,
            city: customer.city,
            gstIn: "GSTIN: " + customer.gstIn,
            email: customer.email,
            phone: customer.phone,
        },
        items: formattedOrder.items,
        subtotal: formattedOrder.totalAmount,
        taxDetails: [
            { name: "SGST (9%)", amount: (invoice.gstAmount / 2).toString() },
            { name: "CGST (9%)", amount: (invoice.gstAmount / 2).toString() },
        ],
        totalAmount: invoice.totalAmount.toString(),
    };

    return NextResponse.json({
        invoiceData: invoiceData,
    });
}
