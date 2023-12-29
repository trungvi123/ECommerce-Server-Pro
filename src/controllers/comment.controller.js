'use strict'

import CommentService from "../services/comment.service.js"
import { SuccessResponse, } from "../core/success.response.js"


class CommentController {

    createComment = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create new comment success!',
            metadata: await CommentService.createComment(req.body)
        }).send(res)
    }

    getCommentsByParentId = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get comment success!',
            metadata: await CommentService.getCommentsByParentId(req.query)
        }).send(res)
    }

    deleteComment = async (req, res, next) => {
        new SuccessResponse({
            message: 'Delete comment success!',
            metadata: await CommentService.deleteComment(req.query)
        }).send(res)
    }
}

export default new CommentController