import { connectDB } from "@/db/connectDB";
import Order from "@/models/orders/order.model";
import { NextResponse } from "next/server";
connectDB()
export async function GET() {
    const orders = await Order.find({});
    const formattedOrders = orders.map((order) => ({
        ...order.toObject(),
        totalAmount:order.totalAmount.toString(),
      }));
    return NextResponse.json({
        orders,
    });
}
