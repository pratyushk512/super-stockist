import { connectDB } from "@/db/connectDB";
import Product from "@/models/products/products.model";
import { NextRequest, NextResponse } from "next/server";

connectDB();
//delete existing product
export async function DELETE(request: NextRequest) {
  const reqBody = await request.json();
  const { name } = reqBody;
  const deletedProduct = await Product.deleteOne({ name });
  console.log(deletedProduct);
  return NextResponse.json({
    message: "Product deleted.",
    success: true,
    deletedProduct,
  });
}
