'use strict'

import { BadrequestError } from "../core/error.response.js"
import { orderModel } from "../models/order.model.js"
import { findCartById } from "../models/repositories/checkout.repo.js"
import { checkProductByServer } from "../models/repositories/product.repo.js"
import DiscountService from "./discount.service.js"
import { acquireLock, releaseLock } from "./redis.service.js"

class CheckoutSerice {
    // {
    //     cartId,
    //     userId,
    //     shop_order_ids: [
    //         {
    //             shopId,
    //             shop_discounts: [],
    //             item_products: [
    //                 {
    //                     price,
    //                     quantity,
    //                     product_id
    //                 }
    //             ]
    //         },
    //         {
    //             shopId,
    //             shop_discounts: [
    //                 {
    //                     shopId,
    //                     discountId,
    //                     code
    //                 }
    //             ],
    //             item_products: [
    //                 {
    //                     price,
    //                     quantity,
    //                     product_id
    //                 }
    //             ]
    //         }
    //     ]
    // }

    static async checkoutReview({
        cartId, userId, shop_order_ids
    }) {
        const foundCart = await findCartById(cartId)
        if (!foundCart) throw new BadrequestError('Cart not found')

        const checkout_order = {
            totalPrice: 0,
            feeShip: 0,
            totalDiscount: 0,
            totalCheckout: 0
        }, shop_order_ids_new = []

        // tinh tong tien bill
        for (const order of shop_order_ids) {
            const { shopId, shop_discounts = [], item_products = [] } = order
            const checkProduct = await checkProductByServer(item_products)
            if (!checkProduct[0]) throw new BadrequestError('order wrong')

            const checkoutPrice = checkProduct.reduce((acc, product) => {
                return acc + (product.quantity * product.price)
            }, 0)

            // tong tien truoc khi discount
            checkout_order.totalPrice += checkoutPrice

            const itemCheckout = {
                shopId,
                shop_discounts,
                item_products: checkProduct,
                priceRaw: checkoutPrice,
                priceApplyDiscount: checkoutPrice
            }

            // co ma giam gia
            for (const discount_item of shop_discounts) {
                const { discount } = await DiscountService.getDiscountAmount({
                    code: discount_item.code,
                    discount_shop: shopId,
                    products: checkProduct,
                    userId
                })

                if (discount > 0) {
                    checkout_order.totalDiscount += discount
                    itemCheckout.priceApplyDiscount -= discount
                }

            }

            checkout_order.totalCheckout += itemCheckout.priceApplyDiscount
            shop_order_ids_new.push(itemCheckout)
        }

        return {
            shop_order_ids,
            shop_order_ids_new,
            checkout_order
        }
    }


    static async orderByUser({
        shop_order_ids,
        cartId,
        userId,
        user_address = {},
        user_payment = {}
    }) {
        const { shop_order_ids_new, checkout_order } = await CheckoutSerice.checkoutReview({
            cartId,
            shop_order_ids,
            userId
        })

        // check lai mot lan nua xem vượt tồn kho hay không?

        const products = shop_order_ids_new.flatMap(order => order.item_products)

        const acquireProduct = []

        for (const product_item of products) {
            const { product_id, quantity } = product_item
            const keyLock = await acquireLock(product_id, quantity, cartId)
            acquireProduct.push(keyLock ? true : false)
            if (keyLock) {
                await releaseLock(keyLock)
            }
        }

        // neu có 1 sản phẩm hết hàng thì trả về trạng thái lỗi
        if (acquireProduct.includes(false)) {
            throw new BadrequestError('Một số sản phẩm đã được cập nhật, vui lòng quay lại giỏ hàng!')
        }

        const newOrder = await orderModel.create({
            order_userId: userId,
            order_checkout: checkout_order,
            order_shipping: user_address,
            order_payment: user_payment,
            order_products: shop_order_ids_new

        })

        // order thanh cong thi remove cac sanpham trong gio hang
        if(newOrder){
            
        }

    }

}

export default CheckoutSerice