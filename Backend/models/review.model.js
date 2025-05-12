import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
    {
        rating: { type: Number, min: 1, max: 5 },
        comment: { type: String },
        date: { type: Date, default: Date.now },
        reviewerName: { type: String },
        reviewerEmail: { type: String },
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref:'User',
        },
        images: {
            type: [String],
            default: [],
        },
          
    },

);

const Review = mongoose.model("Review", ReviewSchema);

export default Review;
