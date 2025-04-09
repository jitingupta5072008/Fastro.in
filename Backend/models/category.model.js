import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    imageUrl: { type: String, required: true },
    bgColor:{type:String,required:true},
    slug: { type: String, unique: true, lowercase: true },
    parentCategory: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Category", 
      default: null 
    },
    isParent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);

export default Category;
