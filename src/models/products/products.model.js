import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
    },
    hsn:{
      type: String,
      required: [true, "HSN is required"],
    },
    description: {
      type: String,
    },
    price: {
      type: mongoose.Types.Decimal128,
      required: [true, "Product price is required"],
    },
    unitsPerBox: {
      type: Number,
      required: [true, "Units per box is required"],
    },
    unitsSold:{
      type: Number,
      required: [true, "Units sold is required"],
      default: 0
    },
    category:{
      type: String,
      enum: ["Cardboard","Marker","Pencil","Pen","Scale","Sharpner","Sketchpen","Stapler","Staplerpin","Whitener"],
      required: [true, "Category is required"],
    },
    currStock: {
      type: Number,
      required: [true, "Stock quantity is required"],
    },
    image: {
      type: String,
      required: [true, "Product image is required"],
      default: "D:\Coding\Super\super-stockist\public\placeholder.png.png",
    },
  },
  { timestamps: true }
);

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);
export default Product;
