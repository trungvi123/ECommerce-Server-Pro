'use strict'
import statusCodes from '../utils/statusCodes.js'
import reasonPhrases from '../utils/reasonPhrases.js'

const STATUS_CODE = {
    FORBIDDEN: 403,
    CONFLICT: 409,
    BADREQUEST: 400
}

const REASONSTATUSCODE = {
    FORBIDDEN: 'Forbidden error',
    CONFLICT: 'Conflict error',
    BADREQUEST: 'Bad request'

}

class ErrorResponse extends Error {
    constructor(message, status) {
        super(message)
        this.status = status
    }
}

class ConflictError extends ErrorResponse {
    constructor(message = REASONSTATUSCODE.CONFLICT, status = STATUS_CODE.CONFLICT) {
        super(message, status)
    }
}

class ForbiddenError extends ErrorResponse {
    constructor(message = REASONSTATUSCODE.FORBIDDEN, status = STATUS_CODE.FORBIDDEN) {
        super(message, status)
    }
}

class BadrequestError extends ErrorResponse {
    constructor(message = REASONSTATUSCODE.BADREQUEST, status = STATUS_CODE.BADREQUEST) {
        super(message, status)
    }
}

class AuthFailureError extends ErrorResponse {
    constructor(message = reasonPhrases.UNAUTHORIZED, status = statusCodes.UNAUTHORIZED) {
        super(message, status)
    }
}

class NotFoundError extends ErrorResponse {
    constructor(message = reasonPhrases.NOT_FOUND, status = statusCodes.NOT_FOUND) {
        super(message, status)
    }
}

export { BadrequestError, ConflictError, ForbiddenError, AuthFailureError,NotFoundError }