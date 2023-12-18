import { productModel } from "../product.model.js"


const getDraftListByShop = async ({ query, limit = 50, skip = 0 }) => {
    return await productModel.find(query)
    .populate('product_shop','email name -_id')
    .sort({updateAt: -1})
    .skip(skip)
    .limit(limit)
    .lean()
}


export {
    getDraftListByShop
}