'use strict'

import redis from 'redis'
import { promisify } from 'util'
import { reservationInventory } from '../models/repositories/inventory.repo.js'

const redisClient = redis.createClient()

const pexpire = promisify(redisClient.pexpire).bind(redisClient)
const setnxAsync = promisify(redisClient.setnx).bind(redisClient)


const acquireLock = async (product_id, quantity, cartId) => {
    const key = `lock_v2023_${product_id}`
    const retryTimes = 10
    const expireTime = 3000

    for (let i = 0; i < retryTimes.length; i++) {
        const result = await setnxAsync(key, expireTime)
        console.log('result:::', result);
        if (result === 1) {
            const isReversation = await reservationInventory({
                product_id, quantity, cartId
            })
            if (isReversation) {
                await pexpire(key, expireTime)
                return key
            }
            return null
        } else {
            await new Promise((resolve) => setTimeout(resolve, 50))
        }
    }
}

const releaseLock = async keyLock => {
    const delAsyncKey = promisify(redisClient.del).bind(redisClient)
    return await delAsyncKey(keyLock)
}

export {
    acquireLock,
    releaseLock
}