import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    tickets: [{
        ticketType: {type: String, required: true},
        quantity: {type: Number, required: true},
        price: {type: Number, required: true},
    }],
    totalAmount: {type: Number, required: true},
    paymentStatus: {type: String, enum: ["pending", "completed", "failed"], default: "pending"},
}, {timestamps: true});

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;