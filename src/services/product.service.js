'use strict'

import { BadrequestError } from "../core/error.response.js"
import { productModel, clothingModel, electronicsModel } from "../models/product.model.js"
import { insertInventory } from "../models/repositories/inventory.repo.js"
import {
    getAllProduct,
    getDraftListByShop, getProductById, getPublishedListByShop, publishProductByShop,
    searchProduct, unpublishProductByShop, updateProductById
} from "../models/repositories/product.repo.js"
import { removeUndefinedInObject, updateNestedObjectParser } from "../utils/index.js"

class ProductFactory {

    static typeProduct = {} // type - class

    static addTypeProduct(type, classRef) {
        ProductFactory.typeProduct[type] = classRef
    }

    static createProduct(type, payload) {
        const product_class = ProductFactory.typeProduct[type]
        if (!product_class) throw new BadrequestError('Error type product')

        return new product_class(payload).createProduct()
    }

    static updateProduct(type, product_id, payload) {
        const product_class = ProductFactory.typeProduct[type]
        if (!product_class) throw new BadrequestError('Error type product')

        return new product_class(payload).updateProduct(product_id)
    }

    // PUT | POST

    static async publishProductByShop({ product_shop, product_id }) {
        return await publishProductByShop({ product_shop, product_id })
    }

    static async unpublishProductByShop({ product_shop, product_id }) {
        return await unpublishProductByShop({ product_shop, product_id })
    }

    static async searchProduct(keyword) {
        return await searchProduct(keyword)
    }
    // GET

    static async getDraftListByShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isDraft: true }
        return await getDraftListByShop({ query, limit, skip })
    }

    static async getPublishedListByShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isPublished: true }
        return await getPublishedListByShop({ query, limit, skip })
    }

    static async getAllProduct({ limit = 50, page = 1, sort = 'ctime', filter = { isPublished: true } }) {
        return await getAllProduct({
            limit, page, sort, filter,
            select: ['product_name', 'product_description', 'product_thumb']
        })
    }

    static async getProductById({ product_id }) {
        return await getProductById({
            product_id,
            unselect: ['__v', 'product_variations']
        })
    }

}

class Product {
    constructor({
        product_name, product_thumb, product_description, product_price,
        product_quantity, product_type, product_shop, product_attributes
    }) {
        this.product_name = product_name
        this.product_thumb = product_thumb
        this.product_description = product_description
        this.product_price = product_price
        this.product_quantity = product_quantity
        this.product_type = product_type
        this.product_shop = product_shop
        this.product_attributes = product_attributes
    }

    async createProduct(product_id) {
        const newProduct = await productModel.create({ ...this, _id: product_id })
        if (newProduct) {
            await insertInventory({
                product_id: newProduct._id,
                shopId: this.product_shop,
                stock: this.product_quantity
            })
        }

        return newProduct
    }

    async updateProduct(product_id, payload) {
        return await updateProductById({ product_id, payload, model: productModel })
    }

}


class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothingModel.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newClothing) throw new BadrequestError('Created clothing product err')

        const newProduct = await super.createProduct(newClothing._id)
        if (!newProduct) throw new BadrequestError('Created product err')
        return newProduct
    }


    async updateProduct(product_id) {
        const objectParams = removeUndefinedInObject(this)
        const product_attributes = objectParams.product_attributes
        if (product_attributes) {
            await updateProductById({ product_id, payload: updateNestedObjectParser(product_attributes), model: clothingModel })
        }

        const updateProduct = await super.updateProduct(product_id, updateNestedObjectParser(objectParams))
        return updateProduct
    }
}

class Electronics extends Product {
    async createProduct() {
        const newElectronic = await electronicsModel.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newElectronic) throw new BadrequestError('Created electronic product err')

        const newProduct = await super.createProduct(newElectronic._id)
        if (!newProduct) throw new BadrequestError('Created product err')
        return newProduct
    }
}

ProductFactory.addTypeProduct('Electronics', Electronics)
ProductFactory.addTypeProduct('Clothing', Clothing)
// ProductFactory.addTypeProduct('Electronics',Electronic)


export default ProductFactory