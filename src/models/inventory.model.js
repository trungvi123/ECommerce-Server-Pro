'use strict'

import mongoose, { Types } from "mongoose"


const DOCUMENT_NAME = 'Inventory'
const COLLECTION_NAME = 'Inventories'

const inventorySchema = new mongoose.Schema({
    inven_productId: { type: Types.ObjectId, ref: 'Product' },
    inven_location: { type: String, default: 'unknow' },
    inven_stock: { type: Number, require: true },
    inven_shopId: { type: Types.ObjectId, ref: 'Shop' },
    inven_reservations: { type: Array, default: [] },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

export const inventoryModel = mongoose.model(DOCUMENT_NAME, inventorySchema)