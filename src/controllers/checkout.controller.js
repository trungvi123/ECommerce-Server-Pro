'use strict'

import { SuccessResponse, } from "../core/success.response.js"
import CheckoutSerice from "../services/checkout.service.js"


class CheckoutController {
    checkoutReview = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create discount success!',
            metadata: await CheckoutSerice.checkoutReview(
                {
                    ...req.body,
                    discount_shop: req.user.userId
                })
        }).send(res)
    }


    // QUERY
   

    // END QUERY

}

export default new CheckoutController