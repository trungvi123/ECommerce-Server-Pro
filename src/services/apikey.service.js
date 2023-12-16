'use strict'

import { apikeyModel } from "../models/apikey.model.js"
import crypto from 'crypto'

const findById = async (key) => {
    // await new apikeyModel({
    //     key: crypto.randomBytes(64).toString('hex'), permissions: ['0000']
    // }).save()

    const objKey = await apikeyModel.findOne({ key, status: true }).lean()
    return objKey
}


export { findById }