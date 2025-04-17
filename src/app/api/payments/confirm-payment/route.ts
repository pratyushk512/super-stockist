import {connectDB} from "@/db/connectDB";
import Invoice from "@/models/invoices/invoice.model";
import Payment from "@/models/payments/payment.model";
import { NextRequest, NextResponse } from "next/server";
connectDB()

export async function POST(request: NextRequest){
    try {
        const reqBody = await request.json()
        const {paymentId} = reqBody;
        console.log(reqBody);

        if(!paymentId){
            return NextResponse.json({error: "PaymentId is required"}, {status: 400})
        }

        const payment = await Payment.findById(paymentId)
        if(!payment){
            return NextResponse.json({error: "Payment Record not found"}, {status: 400})
        }
        
        payment.status="Verified"
        await payment.save();
        const invoice= await Invoice.findById(payment.invoiceId)

        if(!invoice){
            return NextResponse.json({error: "Invoice not found"}, {status: 400})
        }
        invoice.paymentStatus="Paid"
        await payment.save();
        await invoice.save();
        const response = NextResponse.json({
            message: "Payment Status updated successfully",
            success: true,
            invoice
        })
        return response;

    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}