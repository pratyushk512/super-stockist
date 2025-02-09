import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  salesmanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Salesman ID is required"],
  },
  customerName: {
    type: String,
    required: [true, "Customer name is required"],
  },
  contact: {
    phone: {
      type: Number,
      required: [true, "Phone number is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
    },
  },
  region: {
    type: String,
    required: [true, "Region is required"],
  },
});

const Customer = mongoose.models.Customer || mongoose.model("Customer", customerSchema);
export default Customer;
