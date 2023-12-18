import mongoose, { Schema, Types } from "mongoose"
import slugify from "slugify"


const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'

const productSchema = new mongoose.Schema({
    product_name: { type: String, require: true },
    product_thumb: { type: String, require: true },
    product_description: String,
    product_slug: String,
    product_price: { type: Number, require: true },
    product_quantity: { type: Number, require: true },
    product_type: { type: String, require: true, enum: ['Electronics', 'Clothing', 'Furniture'] },
    product_shop: { type: Types.ObjectId, ref: 'Shop' },
    product_attributes: { type: Schema.Types.Mixed, require: true },
    product_ratingAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be above 5.0'],
        set: (val) => Math.round(val * 10) / 10
    },
    product_variations: { type: Array, default: [] },
    isDraft: { type: Boolean, default: true, index: true, select: false },
    isPublished: { type: Boolean, default: true, index: false, select: false }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

productSchema.pre('save', function (next) {
    this.product_slug = slugify(this.product_name, { lower: true })
    next()
})


const productModel = mongoose.model(DOCUMENT_NAME, productSchema)


const clothingSchema = new Schema({
    brand: { type: String, require: true },
    size: String,
    material: String,
    product_shop: { type: Types.ObjectId, ref: 'Shop' },
}, {
    timestamps: true,
    collection: 'Clothes'
})

const clothingModel = mongoose.model('Clothing', clothingSchema)


const ElectronicSchema = new Schema({
    manufacturer: { type: String, require: true },
    model: String,
    color: String,
    product_shop: { type: Types.ObjectId, ref: 'Shop' },
}, {
    timestamps: true,
    collection: 'Electronics'
})

const electronicsModel = mongoose.model('Electronic', ElectronicSchema)


const furnitureSchema = new Schema({
    brand: { type: String, require: true },
    size: String,
    material: String,
    product_shop: { type: Types.ObjectId, ref: 'Shop' },
}, {
    timestamps: true,
    collection: 'Furnitures'
})

const furnitureModel = mongoose.model('Furniture', furnitureSchema)

export {
    productModel,
    clothingModel,
    electronicsModel,
    furnitureModel
}
