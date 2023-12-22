import mongoose, { Types } from "mongoose"
import { BadrequestError, NotFoundError } from "../core/error.response.js"
import { cartModel } from "../models/cart.model.js"
import { getProductByIdSelect } from "../models/repositories/product.repo.js"

class CartService {
    static async createCart({ userId, product }) {

        const cart = await cartModel.findOne({
            cart_userId: userId,
            cart_state: 'active'
        })
        if (cart) {
            throw new BadrequestError('Cart exist')
        }

        return await cartModel.create({
            cart_userId: +userId,
            cart_state: 'active',
            cart_products: [product],
            cart_count_product: 1
        })


    }

    static async updateCartQuantity({ userId, product }) {
        const { product_id, quantity } = product
        const query = {
            cart_userId: userId,
            'cart_products.product_id': product_id,
            cart_state: 'active'
        }, update = {
            $inc: {
                'cart_products.$.quantity': quantity
            }
        }, option = { upsert: true, new: true }

        return await cartModel.findOneAndUpdate(query, update, option)

    }
    static async addToCart({ userId, product = {} }) {
        const userCart = await cartModel.findOne({ cart_userId: userId })
        const foundProduct = await getProductByIdSelect({
            product_id: product.product_id,
            select: ['product_shop', 'product_name', 'product_price']
        })
        if (!foundProduct) {
            throw new NotFoundError('Product Not Found')
        }
        const productInfor = { // lay name va gia từ db
            product_id: foundProduct._id,
            name: foundProduct.product_name,
            price: foundProduct.product_price,
            quantity: product.quantity,
            shopId: new mongoose.Types.ObjectId(product.shopId)
        }

        if (!userCart) {
            return await CartService.createCart({ userId, product: productInfor })
        }

        if (!userCart.cart_products.length) {
            userCart.cart_products = [productInfor]
            return await userCart.save()
        }

        const checkProductInCart = userCart.cart_products.find((prod) => prod.product_id.toString() === product.product_id.toString())


        if (checkProductInCart) {
            return await CartService.updateCartQuantity({ userId, product: productInfor })
        }


        userCart.cart_products.push(productInfor)
        return await userCart.save()
    }

    static async addToCartV2({ userId, shop_order_ids }) {
        const { product_id, quantity, old_quantity } = shop_order_ids[0]?.item_products[0]
        const foundProduct = await getProductByIdSelect(
            {
                product_id, select: ['product_shop','_id', 'product_name', 'product_price']
            })
        if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId) {
            throw new NotFoundError('Product do not belong to the shop')
        }
        const productInfor = { // lay name va gia từ db
            product_id: foundProduct._id,
            name: foundProduct.product_name,
            price: foundProduct.product_price,
            shopId: foundProduct.shopId
        }
        if (quantity === 0) {
            //delete
            return await CartService.deleteItemInCart({ userId, product_id: foundProduct._id })
        }

        return await CartService.updateCartQuantity({
            userId,
            product: {
                ...productInfor,
                quantity: quantity - old_quantity
            }
        })

    }

    static async deleteItemInCart({ userId, product_id }) {
        const query = { cart_userId: userId, cart_state: 'active' },
            updateSet = {
                $pull: {
                    cart_products: {
                        product_id
                    }
                }
            }, option = { new: true }

        return await cartModel.findOneAndUpdate(query, updateSet, option)
    }

    static async getListCart({ userId }) {
        return await cartModel.findOne({
            cart_userId: +userId
        }).lean()
    }

}


export default CartService