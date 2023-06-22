import mongoose from "mongoose";


const userSchema = new mongoose.Schema(
    {
        name: {type: String, require: true},
        email: {type: String, require: true, unique: true},
        password: {type: String, require: true},
        isAdmin: {type: Boolean, require: true, default: false},
        avatar: {
            type: String,
            default: 'https://res.cloudinary.com/devatchannel/image/upload/v1602752402/avatar/avatar_cugq40.png'
        }
    }, {
        timestamps: true,
    }
); 

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;