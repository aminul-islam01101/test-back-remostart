/* eslint-disable new-cap */
const mongoose = require('mongoose');


const paymentSchema = mongoose.Schema({
    startupEmail: { type: String },
    payer: { address: {}, email: String, name: String, id: String },
    amount: { currency: String, value: String },
    paymentSource: { type: String },
    tier: { type: String },
    transactionId: { type: String },
    searchLimit: { type: Number },
    createdOn: {
        type: Date,
        default: Date.now,
    },
});
const Payment = new mongoose.model('payment', paymentSchema);

module.exports = Payment;
