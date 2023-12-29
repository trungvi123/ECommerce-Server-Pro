'use strict'

import { BadrequestError } from "../core/error.response"
import { inventoryModel } from "../models/inventory.model"
import { getProductByIdSelect } from "../models/repositories/product.repo.js"

class InventoryService {
    static async addStockToInventory({
        stock,
        product_id,
        shopId,
        location = '123, can tho'
    }) {
        const product = await getProductByIdSelect(
            {
                product_id,
                select: ['product_name']
            }
        )
        if (!product) throw new BadrequestError('The product does not exists!')
        const query = {
            inven_shopId: shopId,
            inven_productId: product_id
        }, updateSet = {
            $inc: {
                inven_stock: stock
            },
            $set: {
                inven_location: location
            }
        }, options = { upsert: true, new: true }

        return await inventoryModel.findByIdAndUpdate(query, updateSet, options)

    }


}

export default InventoryService