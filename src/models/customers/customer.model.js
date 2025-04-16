import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  ownerName: {
    type: String,
    required: [true, "Customer name is required"],
  },
  companyName: {
    type: String,
    required: [true, "Company name is required"],
  },
  address:{
    type: String,
    required: [true, "Address is required"],
  },
  city: {
    type: String,
    required: [true, "City is required"],
  },
  gstIn: {
    type: String,
    required: [true, "GSTIN is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
  },
  phone: {
    type: String,
    required: [true, "Phone is required"],
  },
});

const Customer =
  mongoose.models.Customer || mongoose.model("Customer", customerSchema);
export default Customer;
