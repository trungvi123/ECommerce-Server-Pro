'use strict'

import JWT from 'jsonwebtoken'
import { AuthFailureError, NotFoundError } from '../core/error.response.js'
import { asyncHandler } from '../helpers/asyncHandler.js'
import keyTokenService from '../services/keyToken.service.js'

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization',
    CLIENT_ID: 'x-client-id',
    REFRESHTOKEN : 'x-rtoken-id'
}



const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        const accessToken = await JWT.sign(payload, publicKey, {
            expiresIn: '2 days'
        })

        const refreshToken = await JWT.sign(payload, privateKey, {
            expiresIn: '7 days'
        })

        JWT.verify(accessToken, publicKey, (err, decode) => {
            if (err) {
                console.log('error vertify token');
            } else {
                // console.log('decode veitify', decode);
            }
        })


        return { accessToken, refreshToken }
    } catch (error) {
        console.log(error);
    }
}


const authentication = asyncHandler(async (req, res, next) => {
    

    const userId = req.headers[HEADER.CLIENT_ID] 
    if (!userId) throw new AuthFailureError('Invalid Request')

    
    const keyStore = await keyTokenService.finByUserId(userId)
    if (!keyStore) throw new NotFoundError('Not found key')
  
    const refreshToken = req.headers[HEADER.REFRESHTOKEN]
    if(refreshToken){
        try {
            const Userdecode = JWT.verify(refreshToken, keyStore.privateKey)
            if (Userdecode.userId !== userId) throw new AuthFailureError('Invalid User')
            req.keyStore = keyStore
            req.user = Userdecode
            req.refreshToken = refreshToken

            return next()
        } catch (error) {
            throw error
        }
    }

    const accessToken = req.headers[HEADER.AUTHORIZATION]
    
    if (!accessToken) throw new AuthFailureError('Invalid Request')

    try {
        const Userdecode = JWT.verify(accessToken, keyStore.publicKey)
        if (Userdecode.userId !== userId) throw new AuthFailureError('Invalid User')
        req.keyStore = keyStore
        req.user = Userdecode
        return next()
    } catch (error) {
        throw error
    }

})

export {
    createTokenPair, authentication
}