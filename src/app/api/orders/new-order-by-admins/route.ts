import { connectDB } from "@/db/connectDB";
import Order from "@/models/orders/order.model";
import Customer from "@/models/customers/customer.model";
import { NextRequest, NextResponse } from "next/server";
import Counter from "@/models/counter/counter.model";
import User from "@/models/users/user.model";
import { getDataFromToken } from "@/utils/getDataFromToken";

connectDB();

export async function POST(request: NextRequest) {
  try {
    const loggedInUser: any = await getDataFromToken(request);
    const reqBody = await request.json();
    const { phone, orderDate, status, totalAmount, items } = reqBody;
    console.log("Request body:", reqBody);

    if (!phone || !orderDate || !status || !totalAmount || !items) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }
    const user = await User.findById(loggedInUser.id);
    const createdBy = {
      name: user.fullName,
      userType: user.userType,
    };
    const customer = await Customer.findOne({ phone }).select("_id").exec();
    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

   
    const counter = await Counter.findOneAndUpdate(
      { _id: "orderNumber" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const newOrder = new Order({
      orderNumber: counter.seq,
      customerId: customer._id,
      orderDate,
      status,
      totalAmount,
      items,
      createdBy,
    });

    const savedOrder = await newOrder.save();
    console.log("Saved Order:", savedOrder);

    if (!savedOrder) {
      counter.seq -= 1;
      return NextResponse.json(
        {
          message: "Order not created",
          success: false,
        },
        { status: 500 }
      );
    }
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
