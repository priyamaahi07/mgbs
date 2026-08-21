const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
    {
        item: {
            type: String,
            required: true
        },
        qty: {
            type: Number,
            required: true
        },
        unit: {
            type: String,
            default: ''
        },
        rate: {
            type: Number,
            required: true
        },
        discount: {
            type: Number,
            default: 0
        },
        amount: {
            type: Number,
            default: 0
        }
    },
    { _id: false }
);

const invoiceSchema = new mongoose.Schema(
    {
        invoice_number: {
            type: String,
            required: true,
            unique: true
        },

        customer_name: {
            type: String,
            required: true
        },

        phno: {
            type: String,
            required: true
        },

        items: {
            type: [itemSchema],
            required: true
        },

        total_amount: {
            type: Number,
            required: true
        },

        amount_paid: {
            type: Number,
            required: true
        },

        balance: {
            type: Number,
            default: 0
        },

        payment_mode: {
            type: String,
            required: true
        },
        created_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Invoice', invoiceSchema);