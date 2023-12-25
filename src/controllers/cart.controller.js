'use strict'

import { SuccessResponse, } from "../core/success.response.js"
import CartService from "../services/cart.service.js"


class CartController {
    addToCart = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create new cart success!',
            metadata: await CartService.addToCart(req.body)
        }).send(res)
    }

    updateCart = async (req, res, next) => {
        new SuccessResponse({
            message: 'Update cart success!',
            metadata: await CartService.addToCartV2(req.body)
        }).send(res)
    }

    deleteItemInCart = async (req, res, next) => {
        new SuccessResponse({
            message: 'Delete cart success!',
            metadata: await CartService.deleteItemInCart(req.body)
        }).send(res) 
    }
    // QUERY
    getListCart = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list cart success!',
            metadata: await CartService.getListCart(req.query)
        }).send(res)
    }
    // END QUERY

}

export default new CartController