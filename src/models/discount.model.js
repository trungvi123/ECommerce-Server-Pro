'use strict'

import mongoose, { Types } from "mongoose"


const DOCUMENT_NAME = 'Discount'
const COLLECTION_NAME = 'Discounts'

const discountSchema = new mongoose.Schema({
    discount_name : {type: String, require: true},
    discount_description : {type: String, require: true},
    discount_type: {type: String, default: 'fixed_amount'}, // giam gia co dinh
    discount_value: {type: Number, require: true}, // giam gia co dinh
    discount_max_value: {type: Number, require: true}, // giam gia co dinh
    discount_code: {type: String, require: true}, 
    discount_start_date: {type: Date, require: true}, // ngay bat dau
    discount_end_date: {type: Date, require: true}, // ngay ket thuc
    discount_max_uses: {type: Number, require: true}, // số lượng discount
    discount_uses_count: {type: Number, require: true}, // số discount được sdung
    discount_users_used: {type: Array, default: []}, // nhung nguoi da su dung
    discount_max_uses_per_user:{type: Number, require: true}, // 1 người sử dụng tối đa mấy lần
    discount_min_order_value: {type: Number, require: true},
    discount_shop: { type: Types.ObjectId, ref: 'Shop' },

    discount_isActive: {type: Boolean, default: true},
    discount_applies_to: {type: String, require: true, enum: ['all','specific']},
    discount_product_ids: {type: Array, default: []}

}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

export const DiscountModel = mongoose.model(DOCUMENT_NAME, discountSchema)