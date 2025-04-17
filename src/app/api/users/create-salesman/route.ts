import {connectDB} from "@/db/connectDB";
import User from "@/models/users/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";


connectDB()

export async function POST(request: NextRequest){
    try {
        const reqBody = await request.json()
        const {fullName, email, password} = reqBody

        console.log(reqBody);

        const user = await User.findOne({email})

        if(user){
            return NextResponse.json({error: "User already exists"}, {status: 400})
        }

        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password, salt)

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
            userType: 'salesman'
        })

        const savedUser = await newUser.save()
        console.log(savedUser);

        return NextResponse.json({
            message: "Salesman created successfully",
            success: true,
            savedUser
        })
        
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})

    }
}