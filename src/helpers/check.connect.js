'use strict'

import mongoose from "mongoose"
import os from 'os'
import process from "process"

const _SECONDS = 5000




const countConnect = () => {
    const numConnection = mongoose.connections.length
    console.log(`Number of connections:: ${numConnection}`);
}

const checkOverload = () => {
    setInterval(() => {
        const numConnection = mongoose.connections.length // số kết nối
        const numCores = os.cpus().length // lấy số core
        const memoryUsage = process.memoryUsage().rss; // get memory đã sử dụng

        //  Ví dụ mỗi core chịu đc 5 connect
        const maxConnections = numCores * 5

        console.log(`Number of connections:: ${numConnection}`);
        console.log(`Memory usage:: ${memoryUsage / 1024 / 1024} MB`);

        if (numConnection > maxConnections) {
            console.log('Connection overload');
        }

    }, _SECONDS)
}



export { countConnect, checkOverload }