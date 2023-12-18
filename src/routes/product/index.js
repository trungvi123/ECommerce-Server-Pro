'use strict'
import express from "express"
import { authentication } from "../../auth/authUtils.js"
import productController from "../../controllers/product.controller.js"
import { asyncHandler } from "../../helpers/asyncHandler.js"

const router = express.Router()

router.use(authentication)
router.post('/', asyncHandler(productController.createProduct))


export default router