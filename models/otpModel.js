import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true,
        unique: true
    },
    time: {
        type: Number
    }
})

export default mongoose.model('otp', otpSchema);