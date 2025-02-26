import { connectDB } from "@/db/connectDB";
import Order from "@/models/orders/order.model";
import { NextRequest,NextResponse } from "next/server";
connectDB()
export async function POST(request: NextRequest) {
    const reqBody = await request.json();
    const { orderNo } = reqBody;
    const order = await Order.findOne({orderNo});
    console.log(orderNo);
    const formattedOrder ={
        ...order.toObject(),
        totalAmount:order.totalAmount.toString(),
        items:order.items.map((item:any) => ({
            ...item.toObject(),
            priceAtTime: item.priceAtTime.toString(),
            total: item.total.toString(),
        })),
    }
    return NextResponse.json({
        formattedOrder,
    });
}
