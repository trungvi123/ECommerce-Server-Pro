'use strict'
import config from '../config/config.mongodb.js'
import mongoose from "mongoose"
import { countConnect } from "../helpers/check.connect.js"


const URI = `mongodb://${config.db.host}:${config.db.port}/${config.db.name}`
class Database {
    constructor() {
        this.connect()
    }

    connect(type = 'mongodb') {
        if (1 === 1) {
            mongoose.set('debug', true)
            mongoose.set('debug', { color: true })
        }

        mongoose.connect(URI).then(_ => {
           console.log('Connect Mongodb Success Pro') 
           countConnect()
        } ).catch(err => console.log('Error Connect'))
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database()
        }

        return Database.instance
    }

}
export { Database }