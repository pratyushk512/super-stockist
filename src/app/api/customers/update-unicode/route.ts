import {connectDB} from "@/db/connectDB";
import Customer from "@/models/customers/customer.model";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/utils/getDataFromToken";
connectDB()

//update password
export async function POST(request: NextRequest){
    try {
        const loggedInUser= await getDataFromToken(request);
        console.log(loggedInUser);
        const reqBody = await request.json()
        const {newUnicode} = reqBody;
        console.log(reqBody);
        const phone=loggedInUser.phone;
        const user = await Customer.findOne({phone})
        if(!user){
            return NextResponse.json({error: "User does not exist"}, {status: 400})
        }
        
        user.unicode=newUnicode;

        await user.save();
        const response = NextResponse.json({
            message: "Password updated successfully",
            success: true,
        })
        return response;

    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}