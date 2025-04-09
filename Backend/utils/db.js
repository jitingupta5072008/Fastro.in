import mongoose from 'mongoose'

export const connectDB = async()=>{
    try {
        await mongoose.connect(process.env.MONGOURI)
        console.log('Mongodb connected Successfully.');
    } catch (error) {
        console.log(error);
    }
}
