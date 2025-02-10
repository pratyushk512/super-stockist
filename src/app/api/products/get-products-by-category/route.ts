import Product from "@/models/products/products.model";
import { NextRequest,NextResponse } from "next/server";
export async function POST(request: NextRequest) {
    const reqBody = await request.json();
    const { category } = reqBody;
    const products = await Product.find({category});
    
    return NextResponse.json({
        products,
    });
}
