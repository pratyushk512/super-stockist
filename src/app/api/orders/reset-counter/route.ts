import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/db/connectDB";
import Counter from "@/models/counter/counter.model";

connectDB();

export async function POST(request: NextRequest) {
  try {
    const resetValue = 0;
    const currentDate = new Date();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const year = currentDate.getFullYear().toString().slice(-2);
    const orderNumber = `${month}${year}${resetValue.toString().padStart(4, '0')}`;
    const orderNo = parseInt(orderNumber, 10);
    const newValue = orderNo;
    console.log(newValue);
    const updatedCounter = await Counter.findByIdAndUpdate(
      { _id: "orderNumber" },
      { $set: { seq: newValue } },
      { new: true, upsert: true }
    );

    return NextResponse.json(
      {
        message: "Counter reset successfully",
        counter: updatedCounter,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error resetting counter:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
