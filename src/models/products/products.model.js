import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
    },
    description: {
      type: String,
    },
    price: {
      type: mongoose.Types.Decimal128,
      required: [true, "Product price is required"],
    },
    category:{
      type: String,
      enum: ["Cardboard","Marker","Pencil","Pen","Scale","Sharpner","Sketchpen","Stapler","Staplerpin","Whitener"],
      required: [true, "Category is required"],
    },
    stockQuantity: {
      type: Number,
      required: [true, "Stock quantity is required"],
    },
  },
  { timestamps: true }
);

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);
export default Product;
