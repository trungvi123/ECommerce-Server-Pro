import { getFiledsSelect, notGetFiledsSelect } from "../../utils/index.js"
import { DiscountModel } from "../discount.model.js"

const findAllDiscountAndUnselect = async ({ page, limit, sort, filter, unSelect }) => {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }

    return await DiscountModel.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(notGetFiledsSelect(unSelect))
        .lean()
}

const findAllDiscountAndSelect = async ({ page, limit, sort, filter, select }) => {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }

    return await DiscountModel.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getFiledsSelect(select))
        .lean()
}

const checkDiscountExist = async(filter)=>{
    return await DiscountModel.findOne(filter).lean()
}


export { findAllDiscountAndSelect, checkDiscountExist,findAllDiscountAndUnselect }