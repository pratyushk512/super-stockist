import { NextRequest, NextResponse } from "next/server";
import {connectDB} from "@/db/connectDB"
import Order from "@/models/orders/order.model";
connectDB();
export async function PUT(req: NextRequest, { params }: { params: { orderNo: number } }) {
    const { orderNo } = params;
    const updatedData = await req.json();
    console.log(updatedData);
    try {
        const order = await Order.findOneAndUpdate(
            { orderNo },
            { $set: updatedData },
            { new: true, runValidators: true }
        );

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        return NextResponse.json(order, { status: 200 });
    } catch (error) {
        console.error("Error updating order:", error);
        return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
    }
}