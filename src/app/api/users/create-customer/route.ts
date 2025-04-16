import {connectDB} from "@/db/connectDB";
import Customer from "@/models/customers/customer.model";
import User from "@/models/users/user.model";
import { NextRequest, NextResponse } from "next/server";

connectDB()
//create new customer
export async function POST(request: NextRequest){
    try {
        const reqBody = await request.json()
        const {ownerName, companyName, address, city,gstIn,email,phone} = reqBody
        console.log(reqBody);

        const user = await Customer.findOne({phone})
        
        if(user){
            return NextResponse.json({error: "User already exists"}, {status: 400})
        }

        const newCustomer = new Customer({
            ownerName,
            companyName,
            address,
            city,
            gstIn,
            email,
            phone
        })

        const savedCustomer = await newCustomer.save()
        console.log(savedCustomer);

        return NextResponse.json({
            message: "Customer created successfully",
            success: true,
            savedCustomer
        })
        
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})

    }
}

