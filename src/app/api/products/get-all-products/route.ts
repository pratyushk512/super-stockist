import Product from "@/models/products/products.model";
import { NextResponse } from "next/server";
import { connectDB } from "@/db/connectDB";

connectDB()
export async function GET() {
    const products = await Product.find({});
    const formattedProducts = products.map((product) => ({
        ...product.toObject(),
        price:product.price.toString(),
      }));
    return NextResponse.json({
        products: formattedProducts,
    });
}
