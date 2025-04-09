import mongoose from "mongoose";

const sliderSchema = new mongoose.Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Slider = mongoose.model("Slider", sliderSchema);
export default Slider;
