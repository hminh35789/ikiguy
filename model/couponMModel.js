import mongoose from "mongoose";


const couponSchema = new mongoose.Schema(
    {
        name: {type: String, require: true},
        email: {type: String, require: true, unique: true},
        password: {type: String, require: true},
        isAdmin: {type: Boolean, require: true, default: false},
    }, {
        timestamps: true,
    }
); 

const Coupon = mongoose.models.User || mongoose.model("Coupon", couponSchema);

export default Coupon;