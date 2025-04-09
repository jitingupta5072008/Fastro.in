import mongoose from 'mongoose'

const SellerSchema = new mongoose.Schema({
    name: {
        type: String,
        required:true,
        trim:true
    },
    email:{
        type: String,
        required:true,
        unique:true,
        lowercase:true
    },
    password:{
        type: String,
        required:true,
        minlength: 8,
    },
    phone:{
        type: String,
        // required:true,
    },
    shopName:{
        type: String,
        // required:true,
    },
    shopAddress:{
        type: String,
        // required:true,
    },
    isVerified:{type:Boolean,default:false},
    bankDetails:{
        accountHolderName:String,
        accountNumber:String,
        ifscCode: String,
        bankName: String
    },
    products:[{type: mongoose.Schema.Types.ObjectId, ref:'Product'}],
    orders:[{type: mongoose.Schema.Types.ObjectId, ref:'Order'}],
    createdAt: {
        type:Date,
        default: Date.now,
    },
    isAdmin: {
        type: Boolean,
        default: false, // Seller by default, true if it's an admin
      },  
},{timestamps: true})

export const Seller = mongoose.model('Seller',SellerSchema)