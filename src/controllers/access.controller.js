'use strict'

import { CREATED, SuccessResponse, } from "../core/success.response.js"
import AccessService from "../services/access.service.js"

class AccessController {
    login = async (req, res, next) => {
        new SuccessResponse({
            message: 'Login success!',
            metadata: await AccessService.login(req.body)
        }).send(res)
    }
    signUp = async (req, res, next) => {
        new CREATED({
            message: 'Created Account!',
            metadata: await AccessService.signUp(req.body)
        }).send(res)
    }
    logout = async (req, res, next) => {
        console.log('3');

        new SuccessResponse({
            message: 'Logout success!',
            metadata: await AccessService.logout(req.keyStore)
        }).send(res)
    }
}

export default new AccessController