import { cartModel } from "../cart.model.js"

const findCartById = async(cartId)=> {
    return await cartModel.findOne(
        {
            _id: cartId,
            cart_state: 'active'
        }
    ).lean()
}


export {
    findCartById
}