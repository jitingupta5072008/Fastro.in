import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  userId: String,
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  qty:{type:String},
  totalAmount: Number,
  paymentMethod: String,
  DeliveryTime: String,

  status: { type: String, default: "Pending" },
  
  shippingAddress: {
    fullname: { type: String, required: true },
    email: { type: String },
    phone: { type: String, required: true },
    pincode: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    fulladdress: { type: String, required: true },
    addressType: { type: String, enum: ["Home", "Office"], default:"Home" },
    defaultAddress: { type: Boolean, default: false },
  },

  createdAt: { type: Date, default: Date.now },
});

export const Order = mongoose.model('Order', OrderSchema);

