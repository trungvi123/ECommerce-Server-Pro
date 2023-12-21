'use strict'

import { SuccessResponse, } from "../core/success.response.js"
import DiscountService from "../services/discount.service.js"


class DiscountController {
    createDiscount = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create discount success!',
            metadata: await DiscountService.createDiscount(
                {
                    ...req.body,
                    discount_shop: req.user.userId
                })
        }).send(res)
    }


    // QUERY
    getAllAvailableProductWithDiscount = async (req, res, next) => {
        new SuccessResponse({
            message: 'Success!',
            metadata: await DiscountService.getAllAvailableProductWithDiscount(
                {
                    ...req.body,
                    ...req.query
                })
        }).send(res)
    }
    getAllDiscountByShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Success!',
            metadata: await DiscountService.getAllDiscountByShop(
                {
                    discount_shop : req.params.id,
                    ...req.query
                })
        }).send(res)
    }

    getDiscountAmount = async (req, res, next) => {
        new SuccessResponse({
            message: 'Success!',
            metadata: await DiscountService.getDiscountAmount(
                {
                    ...req.body
                })
        }).send(res)
    }

    // END QUERY

}

export default new DiscountController