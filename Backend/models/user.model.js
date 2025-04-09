import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String, unique: true },
    password: { type: String },
    phone: { type: String },
    otp: { type: String },
    otpExpire: { type: Date },
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],

    // Address directly in User schema
    address: {
        fullname: { type: String },
        email: { type: String },
        phone: { type: String },
        pincode: { type: String },
        state: { type: String },
        city: { type: String },
        country: { type: String },
        fulladdress: { type: String },
        addressType: { type: String },
        defaultAddress: { type: Boolean, default: false }, // To mark if it's the primary address
    },

    createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.model('User', userSchema);
