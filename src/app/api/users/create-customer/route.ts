import {connectDB} from "@/db/connectDB";
import Customer from "@/models/customers/customer.model";
import User from "@/models/users/user.model";
import { NextRequest, NextResponse } from "next/server";

connectDB()
//create new customer
export async function POST(request: NextRequest){
    try {
        const reqBody = await request.json()
        const {salesman, customerName, phone, email,address} = reqBody
        console.log(reqBody);
        const salesmanId = await User.findOne({username:salesman})
        console.log(salesmanId);

        const user = await Customer.findOne({phone})
        
        if(user){
            return NextResponse.json({error: "User already exists"}, {status: 400})
        }
        const unicode = Math.floor(1000 + Math.random() * 9000).toString();

        const newUser = new Customer({
            salesmanId:salesmanId._id,
            customerName,
            unicode,
            phone,
            email,
            address,
        })

        const savedUser = await newUser.save()
        console.log(savedUser);

        return NextResponse.json({
            message: "Customer created successfully",
            success: true,
            savedUser
        })
        
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})

    }
}

