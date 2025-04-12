import mongoose from "mongoose";
const invoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: [true, "Invoice Number is required"],
    unique: true,
  },
  invoiceDate: {
    type: Date,
    default: Date.now,
    required: [true, "Invoice date is required"],
  },
  customerName: {
    type: String,
    required: [true, "Customer name is required"],
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: [true, "Order ID is required"],
  },
  paymentStatus: {
    type: String,
    enum: ["Paid","Unpaid"],
    default: "Unpaid",
  },
  totalAmount: {
    type: mongoose.Types.Decimal128,
    required: [true, "Total amount is required"],
  },
  gstAmount: {
    type: mongoose.Types.Decimal128,
    required: [true, "GST amount is required"],
  },
  gstPercentage: {
    type: Number,
    required: [true, "GST percentage is required"],
  },
  pdfUrl: {
    type: String,
    //required: [true, "PDF URL is required"],
  }
},
{
    timestamps: true,
}
);

const Invoice = mongoose.models.Invoice || mongoose.model("Invoice", invoiceSchema);
export default Invoice;
