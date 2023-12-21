import { BadrequestError } from "../core/error.response.js"
import { DiscountModel } from "../models/discount.model.js"
import { checkDiscountExist, findAllDiscountAndUnselect } from "../models/repositories/discount.repo.js"
import { getAllProduct } from "../models/repositories/product.repo.js"

class DiscountService {

    static async createDiscount(payload) {
        const {
            code, start_date, end_date, isActive, name,
            description, type, min_order_value, discount_shop,
            max_uses, uses_count, users_used, max_uses_per_user,
            applies_to, product_ids, value,max_value
        } = payload

        
        if (new Date(start_date) >= new Date(end_date)) {
            throw new BadrequestError('Start date must be before end date')
        }

        const foundDiscount = await checkDiscountExist({
            discount_code: code,
            discount_shop
        })

        if (foundDiscount && foundDiscount.discount_isActive) {
            throw new BadrequestError('Discount exist!')
        }

        const newDiscount = await DiscountModel.create({
            discount_name: name,
            discount_description: description,
            discount_type: type, // giam theo phan tram 
            discount_value: value, // giam gia co dinh
            discount_code: code,
            discount_max_value:max_value,
            discount_start_date: new Date(start_date), // ngay bat dau
            discount_end_date: new Date(end_date), // ngay ket thuc
            discount_max_uses: max_uses, // số lượng discount
            discount_uses_count: uses_count, // số discount được sdung
            discount_users_used: users_used, // nhung nguoi da su dung
            discount_max_uses_per_user: max_uses_per_user, // 1 người sử dụng tối đa mấy lần
            discount_min_order_value: min_order_value || 0,
            discount_shop: discount_shop,
            discount_isActive: isActive,
            discount_applies_to: applies_to,
            discount_product_ids: applies_to === 'all' ? [] : product_ids
        })
        return newDiscount
    }

    static async getAllAvailableProductWithDiscount({
        code, discount_shop, limit, page
    }) {
        const foundDiscount = await checkDiscountExist({
            discount_code: code,
            discount_shop
        })

        if (!foundDiscount && !foundDiscount.discount_isActive) {
            throw new BadrequestError('Discount not exist!')
        }

        const { discount_applies_to,
            discount_product_ids
        } = foundDiscount
        let products
        if (discount_applies_to === 'all') {
            // get all product
            products = await getAllProduct({
                filter: {
                    product_shop: discount_shop,
                    isPublished: true
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        }
        if (discount_applies_to === 'specific') {
            products = await getAllProduct({
                filter: {
                    _id: { $in: discount_product_ids },
                    isPublished: true
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        }
        return products
    }

    static async getAllDiscountByShop({
        discount_shop,
        limit, page
    }) {
        return await findAllDiscountAndUnselect({
            limit: +limit,
            page: +page,
            sort: 'ctime',
            filter: {
                discount_shop,
                discount_isActive: true
            },
            unSelect: ['__v', 'discount_shop']

        })
    }


    static async getDiscountAmount({
        code, discount_shop, products, userId
    }) {
        const foundDiscount = await checkDiscountExist({
            discount_code: code,
            discount_shop
        })

        if (!foundDiscount && !foundDiscount?.discount_isActive) {
            throw new BadrequestError('Discount not exist!')
        }

        const {
            discount_min_order_value,
            discount_users_used,
            discount_max_uses_per_user,
            discount_type,
            discount_value,
            discount_start_date,
            discount_end_date
        } = foundDiscount
      

        let totalOrder = 0
        if (discount_min_order_value > 0) {
            totalOrder = products.reduce((acc, product) => {
                return acc + (product.quantity * product.price)
            }, 0)

            if (totalOrder < discount_min_order_value) {
                throw new BadrequestError('Your order is not eligible to use this discount code!')
            }
        }

        if (discount_max_uses_per_user > 0) {
            const checkUse = discount_users_used.find((user) => user.userId === userId)
            if (checkUse) {
                throw new BadrequestError('You have already used this discount code!')
            }
        }

        const amount = discount_type === 'fixed_amount' ? discount_value : totalOrder * (discount_value / 100)
        return {
            totalOrder,
            discount: amount,
            totalPrice: totalOrder - amount
        }

    }

    static async deleteDiscount({ shopId, code }) {
        return await DiscountModel.findOneAndDelete({
            discount_code: code,
            discount_shop: shopId
        })
    }

    static async cancelDiscount({ shopId, code ,userId}) {
        const foundDiscount = await checkDiscountExist({
            discount_code: code,
            discount_shop
        })

        if (!foundDiscount && !foundDiscount.discount_isActive) {
            throw new BadrequestError('Discount not exist!')
        }

        const result = await DiscountModel.findByIdAndUpdate(foundDiscount._id,{
            $pull: {
                discount_users_used: userId
            },
            $inc: {
                discount_max_uses: 1,
                discount_uses_count: -1
            }
        })  
        
        return result
    }
}

export default DiscountService