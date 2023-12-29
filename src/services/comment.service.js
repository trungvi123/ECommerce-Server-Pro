'use strict'

import { NotFoundError } from "../core/error.response.js"
import { commentModel } from "../models/comment.model.js"
import { getProductByIdSelect } from "../models/repositories/product.repo.js"

class CommentService {
    static async createComment({
        product_id, userId, content, parentCommentId = null
    }) {
        const comment = new commentModel({
            comment_productId: product_id,
            comment_userId: userId,
            comment_content: content,
            comment_parentId: parentCommentId
        })

        let rightValue
        if (parentCommentId) {
            const parentComment = await commentModel.findById(parentCommentId)
            if (!parentComment) throw new NotFoundError('Comment not found')
            rightValue = parentComment.comment_right

            await commentModel.updateMany({
                comment_productId: product_id,
                comment_right: { $gte: rightValue }
            }, {
                $inc: { comment_right: 2 }
            })

            await commentModel.updateMany({
                comment_productId: product_id,
                comment_left: { $gt: rightValue }
            }, {
                $inc: { comment_left: 2 }
            })

        } else {
            const maxRightValue = await commentModel.findOne({
                comment_productId: product_id
            }, 'comment_right', { sort: { comment_right: -1 } })
            console.log(maxRightValue);

            if (maxRightValue) {
                rightValue = maxRightValue + 1
            } else {
                rightValue = 1
            }
        }

        comment.comment_left = rightValue
        comment.comment_right = rightValue + 1
        return await comment.save()
    }


    static async getCommentsByParentId({
        product_id,
        parentCommentId = null,
        limit = 50,
        page = 1
    }) {
        const skip = (page - 1) * limit
        if (parentCommentId) {
            const parentComment = await commentModel.findById(parentCommentId)
            if (!parentComment) throw new NotFoundError('Comment not found')


            const comments = await commentModel.find({
                comment_productId: product_id,
                comment_left: { $gt: parentComment.comment_left },
                comment_right: { $lte: parentComment.comment_right },
            })
                .select('comment_left comment_right comment_content comment_parentId')
                .sort({ comment_left: 1 }).skip(skip)
            return comments
        }

        const comments = await commentModel.find({
            comment_productId: product_id,
            comment_parentId: parentCommentId
        }).select('comment_left comment_right comment_content comment_parentId')
            .sort({ comment_left: 1 }).skip(skip)
        return comments
    }

    static async deleteComment({
        product_id,
        commentId
    }) {
        const foundProduct = await getProductByIdSelect({
            product_id
        })
        if (!foundProduct) throw new NotFoundError('Product not found')

        const comment = await commentModel.findById(commentId)
        if (!comment) throw new NotFoundError('Comment not found')

        const leftValue = comment.comment_left
        const rightValue = comment.comment_right
        const width = rightValue - leftValue + 1
        await commentModel.deleteMany({
            comment_productId: product_id,
            comment_left: {
                $gte: leftValue,
                $lte: rightValue
            }
        })

        await commentModel.updateMany({
            comment_productId: product_id,
            comment_right: {
                $gt: rightValue,
            }
        }, {
            $inc: { comment_right: -width }
        })
        await commentModel.updateMany({
            comment_productId: product_id,
            comment_left: {
                $gt: rightValue,
            }
        }, {
            $inc: { comment_left: -width }
        })
        return true

    }




}

export default CommentService