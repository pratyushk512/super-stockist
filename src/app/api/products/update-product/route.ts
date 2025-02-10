import {connectDB} from "@/db/connectDB";
import Product from "@/models/products/products.model";
import { NextRequest, NextResponse } from "next/server";
connectDB()

//update Product
export async function POST(request: NextRequest){
    try {
        const reqBody = await request.json()
        const {name, newName, description, price, category,stockQuantity} = reqBody;
        console.log(reqBody);

        if(!name){
            return NextResponse.json({error: "Product name is required"}, {status: 400})
        }

        const product = await Product.findOne({name})
        if(!product){
            return NextResponse.json({error: "Product not found"}, {status: 400})
        }
        
        if(newName){
            const existingProdut = await Product.findOne({name:newName})
            if(!existingProdut){
                product.name=newName;
            }else{
                return NextResponse.json({error: "Product Name already exists"}, {status: 400})
            }  
        }
        if(description){
            product.description=description;
        }
        
        if(price){
            product.price=price;
        }
        if(category){
            product.category=category;
        }
        if(stockQuantity){
            product.stockQuantity=stockQuantity;
        }

        await product.save();
        const response = NextResponse.json({
            message: "Product details updated successfully",
            success: true,
            product
        })
        return response;

    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}