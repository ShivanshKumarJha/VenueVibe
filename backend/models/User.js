import mongoose, {Schema} from "mongoose";

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
    },
    eventsCreated: [{
        type: Schema.Types.ObjectId,
        ref: 'Event',
    }],
    ticketsPurchased: [{
        type: Schema.Types.ObjectId,
        ref: 'Transaction',
    }]
}, {timestamps: true});

const User = mongoose.model("User", userSchema);
export default User;