import Product from "@/models/products/products.model";
import { NextRequest, NextResponse } from "next/server";
export async function POST(request:NextRequest) {
    const reqBody = await request.json();
    const {name} = reqBody;

    const product = await Product.findOne({name});
    if(!product){
        return NextResponse.json({
            message: "Product not found",
            success: false,
        });
    }
    return NextResponse.json({
        product,
        success:true,
    });
}
