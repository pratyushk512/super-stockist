import { connectDB } from "@/db/connectDB";
import Order from "@/models/orders/order.model";
import { NextRequest, NextResponse } from "next/server";
import Counter from "@/models/counter/counter.model";
import { getDataFromToken } from "@/utils/getDataFromToken";
import Customer from "@/models/customers/customer.model";
await connectDB();

export async function POST(request: NextRequest) {
  try {
    const loggedInUser:any= await getDataFromToken(request);
    console.log(loggedInUser);
    const reqBody = await request.json();
    const {orderDate, status, totalAmount, items} = reqBody;
    console.log("Request body:", reqBody);

    if ( !orderDate || !status || !totalAmount || !items) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }
    const user = await Customer.findOne({ phone: loggedInUser.phone });
    const createdBy = {
        name: user.customerName,
        userType: 'customer'
    };

    const counter = await Counter.findOneAndUpdate(
      { _id: "orderNumber" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    const orderNumber = counter.seq;

    const newOrder = new Order({
      orderNumber,
      customerId: loggedInUser.id,
      orderDate,
      status,
      totalAmount,
      items,
      createdBy
    });
    const savedOrder = await newOrder.save();
    console.log("Saved Order:", savedOrder);

    return NextResponse.json(
      {
        message: "Order created successfully",
        success: true,
        savedOrder,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating order:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
