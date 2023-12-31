'use strict'
import express from "express"
import { apiKey, permission } from "../auth/checkAuth.js"
import accessRouter from './access/index.js'
import productRouter from './product/index.js'
import checkoutRouter from './checkout/index.js'

import discountRouter from './discount/index.js'
import cartRouter from './cart/index.js'



const router = express.Router()
//check api key
router.use(apiKey)
router.use(permission('0000'))

router.use('/v1/api/product', productRouter)
router.use('/v1/api/discount', discountRouter)
router.use('/v1/api/cart', cartRouter)
router.use('/v1/api/checkout', checkoutRouter)
router.use('/v1/api', accessRouter)



export default router