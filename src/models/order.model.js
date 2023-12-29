'use strict'

import mongoose, { Types } from "mongoose"


const DOCUMENT_NAME = 'Order'
const COLLECTION_NAME = 'Orders'

const orderSchema = new mongoose.Schema({
    order_userId: { type: Number, require: true },
    order_checkout: {
        totalPrice: { type: Number, default: 0 },
        totalApplyDiscount: { type: Number, default: 0 },
        feeShip: { type: Number, default: 0 }
    },
    order_shipping: {
        wards: { type: String, default: '' },
        district: { type: String, default: '' },
        province: { type: String, default: '' },
        country: { type: String, default: '' },
    },
    order_payment: { type: Object, default: {} },
    order_products: { type: Array, require: true },
    order_trackingCode: { type: String, default: '#1234512' },
    order_status: { type: String, enum: ['pending', 'confirm', 'shipped', 'cancel', 'delivered'], default: 'pending' },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

export const orderModel = mongoose.model(DOCUMENT_NAME, orderSchema)