import mongoose from "mongoose";
const orderSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: [true, "Customer ID is required"],
  },
  companyName: {
    type: String,
    required: [true, "Company name is required"],
  },
  orderNo: {
    type: Number,
    required: [true, "Order number is required"],
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["Pending","Completed","Cancelled"],
    default: "Pending",
  },
  totalAmount: {
    type: mongoose.Types.Decimal128,
    required: [true, "Total amount is required"],
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      productName: {
        type: String,
        required: [true, "Product name is required"],
      },
      hsn:{
        type: String,
        required: [true, "HSN is required"],
      },
      quantity: {
        type: Number,
        required: [true, "Quantity is required"],
      },
      priceAtTime: {
        type: mongoose.Types.Decimal128,
        required: [true, "Price at the time of purchase is required"],
      },
      total:{
        type: mongoose.Types.Decimal128,
        required: [true, "Total price is required"],
      }
    },
  ],
  createdBy:{
    name:{
      type:String,
      required:true
    },
    userType:{
      type:String,
      required:true
    }
  }
});



const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;
