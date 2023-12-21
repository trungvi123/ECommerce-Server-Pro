'use strict'
import express from "express"
import { authentication } from "../../auth/authUtils.js"
import discountController from "../../controllers/discount.controller.js"
import { asyncHandler } from "../../helpers/asyncHandler.js"

const router = express.Router()

router.post('/amount', asyncHandler(discountController.getDiscountAmount))
router.post('/availableProduct', asyncHandler(discountController.getAllAvailableProductWithDiscount))

router.use(authentication)


router.get('/:id', asyncHandler(discountController.getAllDiscountByShop))
router.post('/', asyncHandler(discountController.createDiscount))



export default router