'use strict'
import express from "express"
import { authentication } from "../../auth/authUtils.js"
import productController from "../../controllers/product.controller.js"
import { asyncHandler } from "../../helpers/asyncHandler.js"

const router = express.Router()

router.get('/search/:keyword', asyncHandler(productController.searchProduct))



router.use(authentication)

router.get('/draft', asyncHandler(productController.getDraftListByShop))
router.get('/published', asyncHandler(productController.getPublishedListByShop))

router.post('/publish/:id', asyncHandler(productController.publishProductByShop))
router.post('/unpublish/:id', asyncHandler(productController.unpublishProductByShop))

router.post('/', asyncHandler(productController.createProduct))


export default router