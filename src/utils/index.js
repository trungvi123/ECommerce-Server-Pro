'use strict'

import _ from 'lodash'

const getInforData = ({ fileds = [], object = {} }) => {
    return _.pick(object, fileds)
}
// [a,b,c] => {a: 1,b:1,c:1}
const getFiledsSelect = (select) => {
    return Object.fromEntries(select.map(el => [el, 1]))
}
// [a,b,c] => {a: 0,b:0,c:0}

const notGetFiledsSelect = (select) => {
    return Object.fromEntries(select.map(el => [el, 0]))
}

const removeUndefinedInObject = obj => {
    Object.keys(obj).forEach(el => {
        if (!obj[el]) {
            delete obj[el]
        }
    })

    return obj
}

const updateNestedObjectParser = obj => {
    const final = {}
    Object.keys(obj).forEach(parentKey => {
        if (obj[parentKey]) {
            if (typeof obj[parentKey] === 'object' && !Array.isArray(obj[parentKey])) {
                const result = updateNestedObjectParser(obj[parentKey])
                Object.keys(result).forEach(childrenKey => {
                    final[`${parentKey}.${childrenKey}`] = result[childrenKey]
                })
            } else {
                final[parentKey] = obj[parentKey]
            }
        }
    })
    console.log(final);
    return final
}


export { getInforData, getFiledsSelect, notGetFiledsSelect, removeUndefinedInObject, updateNestedObjectParser }