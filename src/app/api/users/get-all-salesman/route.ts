import User from "@/models/users/user.model";
import { NextResponse } from "next/server";
import { connectDB } from "@/db/connectDB";

connectDB()
export async function GET() {
    const users = await User.find({});
    const salesUsers = users.filter((user) => user.userType === "salesman");
    return NextResponse.json({
        salesmen: salesUsers,
    });
}
