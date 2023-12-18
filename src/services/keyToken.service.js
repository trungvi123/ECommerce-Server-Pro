'use strict'

import { keyTokenModel } from "../models/keytoken.model.js"

class keyTokenService {
    static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
        try {
            // lv0
            // const tokens = await keyTokenModel.create({
            //     user: userId,
            //     publicKey,
            //     privateKey
            // })
            // return tokens ? tokens.publicKey : null
            // lv vip

            const filter = { user: userId }, update = {
                publicKey,
                privateKey,
                refreshTokensUsed: [],
                refreshToken
            }, options = {
                upsert: true, new: true
            }
            const tokens = await keyTokenModel.findOneAndUpdate(filter, update, options)
            return tokens ? tokens.publicKey : null
        } catch (error) {

        }
    }

    static finByUserId = async (userId) => {
        const keyStore = await keyTokenModel.findOne({ user: userId })
        return keyStore
    }

    static removeKey = async (id) => {
        return await keyTokenModel.findByIdAndDelete(id)
    }

    static deleteKeyByUserId = async (userId) => {
        return await keyTokenModel.deleteOne({user: userId})
    }
}

export default keyTokenService