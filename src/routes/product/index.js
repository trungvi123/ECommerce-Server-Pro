'use strict'
import express from "express"
import { authentication } from "../../auth/authUtils.js"
import productController from "../../controllers/product.controller.js"
import { asyncHandler } from "../../helpers/asyncHandler.js"

const router = express.Router()

router.get('/', asyncHandler(productController.getAllProduct))
router.get('/search/:keyword', asyncHandler(productController.searchProduct))

router.get('/detail/:id', asyncHandler(productController.getProductById))


router.use(authentication)

router.get('/draft', asyncHandler(productController.getDraftListByShop))
router.get('/published', asyncHandler(productController.getPublishedListByShop))

router.post('/publish/:id', asyncHandler(productController.publishProductByShop))
router.post('/unpublish/:id', asyncHandler(productController.unpublishProductByShop))

router.post('/', asyncHandler(productController.createProduct))


router.patch('/:id', asyncHandler(productController.updateProduct))




export default router