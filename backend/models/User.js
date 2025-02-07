import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    image: {
        publicId: {
            type: String,
        },
        url: {
            type: String,
        }
    },
    role: {
        type: String,
        enum: ['user', 'organiser', 'admin'],
        default: 'user',
    }
}, {timestamps: true});

const User = mongoose.model("User", userSchema);
export default User;