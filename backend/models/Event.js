import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    organiser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    location: {
        address: {type: String, required: true},
        coordinates: {type: [Number], required: true},
    },
    ticketTypes: [{
        name: {type: String, required: true},
        price: {type: Number, required: true},
        quantity: {type: Number, required: true},
    }]
}, {timestamps: true});

const Event = mongoose.model("Event", eventSchema);
export default Event;