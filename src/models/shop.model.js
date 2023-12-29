'use strict'

import mongoose from "mongoose"


const DOCUMENT_NAME = 'Shop'
const COLLECTION_NAME = 'Shops'

const shopSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        maxLengTh: 150
    },
    email: {
        type: String,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'inactive'
    },
    vertify: {
        type: mongoose.Schema.Types.Boolean,
        default: false
    },
    role: {
        type: Array,
        default: []
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

export const shopModel = mongoose.model(DOCUMENT_NAME, shopSchema)