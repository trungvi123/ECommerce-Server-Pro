'use strict'

import { SuccessResponse, } from "../core/success.response.js"
import ProductFactory from "../services/product.service.js"

class ProductController {
    createProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create product success!',
            metadata: await ProductFactory.createProduct(
                req.body.product_type,
                {
                    ...req.body,
                    product_shop: req.user.userId
                })
        }).send(res)
    }

    publishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Publish product success!',
            metadata: await ProductFactory.publishProductByShop(
                {
                    product_id: req.params.id,
                    product_shop: req.user.userId
                })
        }).send(res)
    }

    unpublishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Unpublish product success!',
            metadata: await ProductFactory.unpublishProductByShop(
                {
                    product_id: req.params.id,
                    product_shop: req.user.userId
                })
        }).send(res)
    }

    searchProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'search product success!',
            metadata: await ProductFactory.searchProduct(req.params.keyword)
        }).send(res)
    }


    // QUERY

    getDraftListByShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get draft list success!',
            metadata: await ProductFactory.getDraftListByShop(
                {
                    product_shop: req.user.userId
                })
        }).send(res)
    }

    getPublishedListByShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get published list success!',
            metadata: await ProductFactory.getPublishedListByShop(
                {
                    product_shop: req.user.userId
                })
        }).send(res)
    }

    getAllProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list success!',
            metadata: await ProductFactory.getAllProduct({})
        }).send(res)
    }

    getProductById = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get product success!',
            metadata: await ProductFactory.getProductById({
                product_id: req.params.id
            })
        }).send(res)
    }

    // END QUERY

}

export default new ProductController