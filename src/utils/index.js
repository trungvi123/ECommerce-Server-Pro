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



export { getInforData, getFiledsSelect, notGetFiledsSelect }