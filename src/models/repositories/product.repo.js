import { getFiledsSelect, notGetFiledsSelect } from "../../utils/index.js"
import { productModel } from "../product.model.js"

// GET

const getDraftListByShop = async ({ query, limit, skip }) => {
    return await getListByQuery({ query, limit, skip })
}

const getPublishedListByShop = async ({ query, limit, skip }) => {
    return await getListByQuery({ query, limit, skip })
}


const getListByQuery = async ({ query, limit = 50, skip = 0 }) => {
    return await productModel.find(query)
        .populate('product_shop', 'email name -_id')
        .sort({ updateAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
}


const getAllProduct = async ({ page, limit, sort,filter,select }) => {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }

    return await productModel.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getFiledsSelect(select))
        .lean()
}

const getProductById = async ({ product_id, unselect }) => {
    return await productModel.findById(product_id)
        .select(notGetFiledsSelect(unselect))
        .lean()
}

const searchProduct = async (keyword) => {
    const regex = new RegExp(keyword)
    const result = productModel.find({
        isPublished: true,
        $text: { $search: regex }
    },
        { score: { $meta: 'textScore' } }
    )
        .sort({ score: { $meta: 'textScore' } })
        .lean()
    return result
}


// POST | PUT

const publishProductByShop = async ({ product_shop, product_id }) => {
    const foundShop = await productModel.findOne({
        product_shop,
        _id: product_id
    })

    if (!foundShop) return null
    foundShop.isDraft = false
    foundShop.isPublished = true
    return await foundShop.save()

}

const unpublishProductByShop = async ({ product_shop, product_id }) => {
    const foundShop = await productModel.findOne({
        product_shop,
        _id: product_id
    })

    if (!foundShop) return null
    foundShop.isDraft = true
    foundShop.isPublished = false
    return await foundShop.save()
}


export {
    getDraftListByShop,
    getPublishedListByShop,
    publishProductByShop,
    unpublishProductByShop,
    searchProduct,
    getAllProduct,
    getProductById
}