import {connectDB} from "@/db/connectDB";
import Invoice from "@/models/invoices/invoice.model";
import Payment from "@/models/payments/payment.model";
import { NextRequest, NextResponse } from "next/server";

connectDB()
export async function POST(request: NextRequest){
    try {
        const reqBody = await request.json()
        const {invoiceId,invoiceNo, paymentDate, paymentMode, amount,salesmanId} = reqBody
        console.log(reqBody);
        if(!invoiceId ||!invoiceNo ||  !paymentDate || !paymentMode || !amount  || !salesmanId){
            return NextResponse.json({error: "All fields are required"}, {status: 400})
        }
        const invoice = await Invoice.findById(invoiceId)
        if(!invoice){
            return NextResponse.json({error: "Invoice not found"}, {status: 400})
        }
        
        const newPayment = new Payment({
            invoiceId: invoiceId,
            invoiceNo: invoiceNo,
            paymentDate: paymentDate,
            paymentMode: paymentMode,
            amount: amount,
            status: "Pending",
            salesmanId: salesmanId,
        })

        const savedPayment = await newPayment.save()
        console.log(savedPayment);

        return NextResponse.json({
            message: "Payment Created.Waiting for confirmation.",
            success: true,
            savedPayment
        })
        
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})

    }
}

