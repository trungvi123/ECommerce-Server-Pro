'use strict'

import statusCodes from '../utils/statusCodes.js'
import reasonPhrases from '../utils/reasonPhrases.js'


const STATUS_CODE = {
    OK: 200,
    CREATED: 201
}

const REASONSTATUSCODE = {
    OK: 'Success',
    CREATED: 'Created!'
}

class SuccessResponse {
    constructor({ message, statusCode = STATUS_CODE.OK, reasonStatusCode = REASONSTATUSCODE.OK, metadata = {}, options = {} }) {
        this.message = message ? message : reasonStatusCode
        this.statusCode = statusCode
        this.metadata = metadata
        this.options = options
    }

    send(res, header = {}) {
        return res.status(this.statusCode).json(this)
    }
}

class OK extends SuccessResponse {
    constructor({ message, metadata }) {
        super({ message, metadata })
    }
}

class CREATED extends SuccessResponse {
    constructor({ message, statusCode = STATUS_CODE.CREATED, reasonStatusCode = REASONSTATUSCODE.CREATED, metadata }) {
        super({ message, statusCode, reasonStatusCode, metadata })
    }
}

export { OK, CREATED,SuccessResponse }