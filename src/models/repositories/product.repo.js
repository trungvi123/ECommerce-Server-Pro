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
    searchProduct
}