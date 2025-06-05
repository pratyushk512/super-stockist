import { connectDB } from "@/db/connectDB";
import Order from "@/models/orders/order.model";
import { NextResponse } from "next/server";
connectDB()
export async function GET() {
    const orders = await Order.find({});
   
    return NextResponse.json({
        orders,
    });
}
