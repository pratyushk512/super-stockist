import {connectDB} from "@/db/connectDB";
import Customer from "@/models/customers/customer.model";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

connectDB()

export async function POST(request: NextRequest){
    try {
        const reqBody = await request.json()
        const {phone, unicode} = reqBody;
        console.log(reqBody);

        const user = await Customer.findOne({phone})
        if(!user){
            return NextResponse.json({error: "User does not exist"}, {status: 400})
        }
        
        const validPassword = (unicode === user.unicode)
        if(!validPassword){
            return NextResponse.json({error: "Invalid Password"}, {status: 400})
        }
        console.log(user);
        
        const tokenData = {
            id: user._id,
            username: user.customerName,
            phone: user.phone,
            userType: "customer"
        }

        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {expiresIn: "1d"})

        const response = NextResponse.json({
            message: "Login successful",
            success: true,
        })
        response.cookies.set("token", token, {
            httpOnly: true, 
        })
        return response;

    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}