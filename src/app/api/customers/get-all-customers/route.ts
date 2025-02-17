import Customer from "@/models/customers/customer.model";
import { NextResponse } from "next/server";
import { connectDB } from "@/db/connectDB";

connectDB()
export async function GET() {
    const customers = await Customer.find({});
    
    return NextResponse.json({
        customers,
    });
}
