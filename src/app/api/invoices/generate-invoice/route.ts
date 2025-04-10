import { connectDB } from "@/db/connectDB";
import Order from "@/models/orders/order.model";
import { NextRequest, NextResponse } from "next/server";
import Counter from "@/models/counter/counter.model";
import { getDataFromToken } from "@/utils/getDataFromToken";
import Invoice from "@/models/invoices/invoice.model";
await connectDB();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const {invoiceDate, orderId, gstAmount, gstPercentage,totalAmount} = reqBody;
    console.log("Request body:", reqBody);

    if ( !invoiceDate || !orderId || !gstAmount || !gstPercentage || !totalAmount) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }
    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    const generateUniqueInvoiceNumber = async () => {
        const count = await Invoice.countDocuments();
        const number = count + 1;
        return `INV-${new Date().getFullYear()}-${String(number).padStart(4, '0')}`;
      };
    const invoiceNumber = await generateUniqueInvoiceNumber();
    const newInvoice = new Invoice({
      invoiceNumber,
      orderId,
      invoiceDate,
      gstAmount,
      gstPercentage,
      totalAmount
    });

    const savedInvoice = await newInvoice.save();
    console.log("Saved Invoice:", savedInvoice);

    return NextResponse.json(
      {
        message: "Invoice generated successfully",
        success: true,
        savedInvoice,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error Generating Invoice:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
