'use strict'

import _ from 'lodash'

const getInforData = ({ fileds = [], object = {} }) => {
    return _.pick(object, fileds)
}

export { getInforData }