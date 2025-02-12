import Order from "@/models/orders/order.model";
import { NextResponse } from "next/server";
export async function GET() {
    const orders = await Order.find({});
    return NextResponse.json({
        orders,
    });
}
