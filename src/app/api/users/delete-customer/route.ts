import { connectDB } from "@/db/connectDB";
import Customer from "@/models/customers/customer.model";
import { NextRequest, NextResponse } from "next/server";

connectDB();
//delete existing customer
export async function DELETE(request: NextRequest) {
  const reqBody = await request.json();
  const { phone } = reqBody;
  const deletedUser = await Customer.deleteOne({ phone });
  console.log(deletedUser);
  return NextResponse.json({
    message: "Customer deleted successfully",
    success: true,
    deletedUser,
  });
}
