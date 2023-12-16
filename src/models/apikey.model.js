import mongoose from "mongoose"


const DOCUMENT_NAME = 'Apikey'
const COLLECTION_NAME = 'Apikeys'

const keyTokenSchema = new mongoose.Schema({
    key: {
        type: String,
        require: true,
        unique:true
    },
    status: {
        type: Boolean,
        default: true
    },
    permissions: {
        type: [String],
        require: true,
        enum: ['0000','1111','2222']
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

export const apikeyModel = mongoose.model(DOCUMENT_NAME, keyTokenSchema)