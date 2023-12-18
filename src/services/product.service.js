'use strict'

import { BadrequestError } from "../core/error.response.js"
import { productModel, clothingModel, electronicsModel } from "../models/product.model.js"
import { getDraftListByShop, getPublishedListByShop, publishProductByShop, 
        searchProduct, unpublishProductByShop 
} from "../models/repositories/product.repo.js"

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
        return await productModel.create({ ...this, _id: product_id })
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