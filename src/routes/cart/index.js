'use strict'
import express from "express"
import cartController from "../../controllers/cart.controller.js"
import { asyncHandler } from "../../helpers/asyncHandler.js"

const router = express.Router()

router.get('/', asyncHandler(cartController.getListCart))

router.post('/', asyncHandler(cartController.addToCart))
router.post('/update', asyncHandler(cartController.updateCart))

router.delete('/', asyncHandler(cartController.deleteItemInCart))




export default router