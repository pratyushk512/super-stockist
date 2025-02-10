import Product from "@/models/products/products.model";
import { NextResponse } from "next/server";
export async function GET() {
    const products = await Product.find({});
    const groupedProducts = products.reduce((acc, product) => {
        const category = product.category;
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(product);
        return acc;
    }, {});
    return NextResponse.json({
        groupedProducts,
    });
}
