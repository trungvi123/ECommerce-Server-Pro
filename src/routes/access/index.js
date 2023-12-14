'use strict'
import express from "express"
import { authentication } from "../../auth/authUtils.js"
import AccessController from "../../controllers/access.controller.js"
import { asyncHandler } from "../../helpers/asyncHandler.js"

const router = express.Router()


router.post('/shop/signup', asyncHandler(AccessController.signUp))
router.post('/shop/login', asyncHandler(AccessController.login))

router.use(authentication)
router.post('/shop/logout', asyncHandler(AccessController.logout))


export default router