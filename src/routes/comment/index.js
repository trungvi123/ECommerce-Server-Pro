'use strict'
import express from "express"
import { authentication } from "../../auth/authUtils.js"
import commentController from "../../controllers/comment.controller.js"
import { asyncHandler } from "../../helpers/asyncHandler.js"

const router = express.Router()

router.use(authentication)

router.get('/', asyncHandler(commentController.getCommentsByParentId))

router.post('/', asyncHandler(commentController.createComment))

router.delete('/', asyncHandler(commentController.deleteComment))





export default router