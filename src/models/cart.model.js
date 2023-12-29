'use strict'

import mongoose, { Types } from "mongoose"


const DOCUMENT_NAME = 'Cart'
const COLLECTION_NAME = 'Carts'

const cartSchema = new mongoose.Schema({
    cart_state: { type: String, default: 'active', enum: ['active', 'completed', 'failed', 'pending'] },
    cart_products: [
        {
            product_id: {
                type: Types.ObjectId,
                ref: 'Product'
            },
            shopId: {
                type: Types.ObjectId,
                ref: 'Shop'
            },
            name: {
                type: String
            },
            quantity: {
                type: Number
            },
            price: {
                type: Number
            }
        }
    ],
    cart_count_product: { type: Number, default: 0 },
    cart_userId: { type: Number, require: true },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

export const cartModel = mongoose.model(DOCUMENT_NAME, cartSchema)