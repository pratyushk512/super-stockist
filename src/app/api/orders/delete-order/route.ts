import { connectDB } from "@/db/connectDB";
import Order from "@/models/orders/order.model";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function DELETE(request: NextRequest) {
  const reqBody = await request.json();
  const { orderNumber } = reqBody;
  const deletedOrder = await Order.deleteOne({ orderNumber });
  console.log(deletedOrder);
  return NextResponse.json({
    message: "Order deleted.",
    success: true,
    deletedOrder,
  });
}
