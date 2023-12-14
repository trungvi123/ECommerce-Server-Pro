'use strict'
import { shopModel } from '../models/shop.model.js'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import keyTokenService from './keyToken.service.js'
import { createTokenPair } from '../auth/authUtils.js'
import { getInforData } from '../utils/index.js'
import { AuthFailureError, BadrequestError } from '../core/error.response.js'
import { findByEmail } from './shop.service.js'



const RoleShop = {
    SHOP: 'SHOP',
    WRITE: 'WRITE',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

class AccessService {
    static logout = async (keyStore) => {
        return await keyTokenService.removeKey(keyStore._id)
    }

    static login = async ({ email, password, refreshToken = null }) => {
        const checkShop = await findByEmail({ email })
        if (!checkShop) {
            throw new BadrequestError('Bad request!')
        }

        const matchPassword = bcrypt.compare(password, checkShop.password)
        if (!matchPassword) {
            throw new AuthFailureError('Authentication error!')
        }

        const privateKey = crypto.randomBytes(64).toString('hex')
        const publicKey = crypto.randomBytes(64).toString('hex')

        const tokens = await createTokenPair({
            userId: checkShop._id,
            email
        }, publicKey, privateKey)

        const keyStore = await keyTokenService.createKeyToken({
            userId: checkShop._id,
            publicKey,
            privateKey,
            refreshToken: tokens.refreshToken
        })

        if (!keyStore) {
            throw new BadrequestError('keyStore error')
        }

        return {
            shop: getInforData({ fileds: ['_id', 'name', 'email'], object: checkShop }),
            tokens
        }
    }



    static signUp = async ({ name, email, password }) => {
        const check = await shopModel.findOne({ email }).lean()
        if (check) {
            throw new BadrequestError('Error shop already')
        }
        const passwordHash = await bcrypt.hash(password, 10)

        const newShop = await shopModel.create({
            name, email, password: passwordHash, roles: [RoleShop.SHOP]
        })

        if (newShop) {
            const privateKey = crypto.randomBytes(64).toString('hex')
            const publicKey = crypto.randomBytes(64).toString('hex')

            const tokens = await createTokenPair({
                userId: newShop._id,
                email
            }, publicKey, privateKey)

            const keyStore = await keyTokenService.createKeyToken({
                userId: newShop._id,
                publicKey,
                privateKey,
                refreshToken : tokens.refreshToken
            })

            if (!keyStore) {
                throw new BadrequestError('keyStore error')
            }


            return {
                shop: getInforData({ fileds: ['_id', 'name', 'email'], object: newShop }),
                tokens
            }
        }

        return {
            code: 200,
            metadata: null
        }
    }

}

export default AccessService