import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true,
        min: 0,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    subCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",  // Subcategory bhi Category model ka hi ek entry hogi
        default: null
    },
    images: [{ type: String }],
    seller: {
        type: mongoose.Schema.Types.ObjectId, ref: "Seller",
        required: true,
    },
    shippingInformation: { type: String },
    availabilityStatus: { type: String, enum: ['In Stock', 'Low Stock', 'Out of Stock'], default: 'In Stock' },

    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
      }],
    returnPolicy: { type: String },
    minimumOrderQuantity: { type: Number, default: 1 },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

export const Product = mongoose.model("Product", ProductSchema)