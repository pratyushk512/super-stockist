import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
    {
        invoiceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Invoice",
            required: [true, "Invoice ID is required"],
        },
        invoiceNo: {
            type: String,
            required: [true, "invoice No is required"],
        },
        paymentDate: {
            type: String,
            required: [true, "Payment date is required"],
        },
        amount: {
            type: mongoose.Types.Decimal128,
            required: [true, "Amount is required"],
        },
        paymentMode: {
            type: String,
            required: [true, "Payment Mode is required"],
        },
        status: {
            type: String,
            enum: ["Pending", "Verified"],
            required: [true, "Status is required"],
            default: "Pending",
        },
        salesmanId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Salesman ID is required"],
        }
    },
    { timestamps: true }
);

const Payment =
    mongoose.models.Payment || mongoose.model("Payment", paymentSchema);
export default Payment;
