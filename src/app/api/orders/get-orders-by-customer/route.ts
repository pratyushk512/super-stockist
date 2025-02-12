import Order from "@/models/orders/order.model";
import { NextRequest,NextResponse } from "next/server";
export async function POST(request: NextRequest) {
    const reqBody = await request.json();
    const { customerId } = reqBody;
    const orders = await Order.find({customerId});
    
    return NextResponse.json({
        orders,
    });
}
