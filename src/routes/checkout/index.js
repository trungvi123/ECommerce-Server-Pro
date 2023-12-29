'use strict'
import express from "express"
import { authentication } from "../../auth/authUtils.js"
import checkoutController from "../../controllers/checkout.controller.js"
import { asyncHandler } from "../../helpers/asyncHandler.js"

const router = express.Router()

router.use(authentication)

router.post('/review', asyncHandler(checkoutController.checkoutReview))



export default router