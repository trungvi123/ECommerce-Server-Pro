'use strict'

import mongoose, { Types } from "mongoose"


const DOCUMENT_NAME = 'Comment'
const COLLECTION_NAME = 'Comments'

const commentSchema = new mongoose.Schema({
    comment_productId: { type: Types.ObjectId, ref: 'Product' },
    comment_userId: { type: Number, require: true },
    comment_content: { type: String, default: 'ok' },
    comment_left: { type: Number, default: 0 },
    comment_right: { type: Number, default: 0 },
    comment_parentId: { type: Types.ObjectId, ref: DOCUMENT_NAME },
    isDeleted: { type: Boolean, default: false }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

export const commentModel = mongoose.model(DOCUMENT_NAME, commentSchema)