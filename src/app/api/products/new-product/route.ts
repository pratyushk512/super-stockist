import {connectDB} from "@/db/connectDB";
import Product from "@/models/products/products.model";
import { NextRequest, NextResponse } from "next/server";

connectDB()
//add new product
export async function POST(request: NextRequest){
    try {
        const reqBody = await request.json()
        const {name,hsn, description, price, unitsPerBox, category,currStock} = reqBody
        console.log(reqBody);
        if(!name ||!hsn ||  !description || !price || !category || !currStock || !unitsPerBox){
            return NextResponse.json({error: "All fields are required"}, {status: 400})
        }
        const product = await Product.findOne({name})
        
        if(product){
            return NextResponse.json({error: "Product already exists"}, {status: 400})
        }
        
        const newProduct = new Product({
            name,
            hsn,
            description,
            price,
            category,
            currStock,
            unitsPerBox,
        })

        const savedProduct = await newProduct.save()
        console.log(savedProduct);

        return NextResponse.json({
            message: `${name} Added.`,
            success: true,
            savedProduct
        })
        
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})

    }
}

