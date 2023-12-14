import dotenv from 'dotenv'
dotenv.config()

const dev = {
    app: {
        port: process.env.DEV_APP_PORT || 3000
    },
    db: {
        host: process.env.DEV_DB_HOST || 'localhost',
        port: process.env.DEV_DB_PORT || 27017,
        name: process.env.DEV_DB_NAME || 'SHOPDEV'
    }
}

const production = {
    app: {
        port: process.env.PRODUCTION_APP_PORT || 4000
    },
    db: {
        host: process.env.PRODUCTION_DB_HOST || 'localhost',
        port: process.env.PRODUCTION_DB_PORT || 27017,
        name: process.env.PRODUCTION_DB_NAME || 'SHOPPRO'
    }
}

const config = {dev,production}
const env = process.env.NODE_ENV || 'dev'
console.log(`ENV:: ${env}`);
export default config[env]