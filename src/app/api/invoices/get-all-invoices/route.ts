import { connectDB } from "@/db/connectDB";
import Invoice from "@/models/invoices/invoice.model";
import { NextResponse } from "next/server";
connectDB()
export async function GET() {
    const invoices = await Invoice.find({});
    const formattedInvoices = invoices.map((invoice) => ({
        ...invoice.toObject(),
        totalAmount:invoice.totalAmount.toString(),
      }));
    return NextResponse.json({
        invoices:formattedInvoices,
    });
}
