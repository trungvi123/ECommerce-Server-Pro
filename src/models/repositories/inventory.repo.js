'use strict'

import { inventoryModel } from "../inventory.model.js"


const insertInventory = async ({
    product_id, shopId, stock, location = 'unknow'
}) => {
    return await inventoryModel.create({
        inven_productId: product_id,
        inven_stock: stock,
        inven_shopId: shopId,
        inven_location: location
    })
}

const reservationInventory = async ({
    product_id,
    quantity,
    cartId
}) => {
    const query = {
        inven_productId: product_id,
        inven_stock: { $gte: quantity }
    }, updateSet = {
        $inc: {
            inven_stock: -quantity
        },
        $push: {
            inven_reservations: {
                quantity,
                cartId,
                createOn: new Date()
            }
        }
    }, options = { upsert: true, new: true }
    return await inventoryModel.updateOne(query, updateSet, options)
}



export {
    insertInventory,
    reservationInventory
}