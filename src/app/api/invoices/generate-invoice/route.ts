import { connectDB } from "@/db/connectDB";
import Order from "@/models/orders/order.model";
import { NextRequest, NextResponse } from "next/server";
import Counter from "@/models/counter/counter.model";
import { getDataFromToken } from "@/utils/getDataFromToken";
import Invoice from "@/models/invoices/invoice.model";
import Product from "@/models/products/products.model";
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
    if(order.status === "Completed") {
      return NextResponse.json(
        { error: "Invoice already generated for this order" },
        { status: 400 }
      );
    }
    for (const item of order.items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return NextResponse.json(
          { error: `Product with ID ${item.productId} not found` },
          { status: 404 }
        );
      }
      // if (product.stock < item.quantity) {
      //   return NextResponse.json(
      //     { error: `Insufficient stock for product ${product.name}` },
      //     { status: 400 }
      //   );
      // }
      product.stock -= item.quantity;
      product.unitsSold += item.quantity;
      await product.save();
    }

    const generateUniqueInvoiceNumber = async () => {
        const count = await Invoice.countDocuments();
        const number = count + 1;
        return `INV-${new Date().getFullYear()}-${String(number).padStart(4, '0')}`;
      };
    const invoiceNumber = await generateUniqueInvoiceNumber();
    const newInvoice = new Invoice({
      invoiceNumber,
      customerName: order.customerName,
      orderId,
      invoiceDate,
      gstAmount,
      gstPercentage,
      totalAmount
    });

    const savedInvoice = await newInvoice.save();
    console.log("Saved Invoice:", savedInvoice);
    
    order.status = "Completed";
    await order.save();
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
