import { app } from "./src/app.js";


const PORT = process.env.PORT || 5000


const server = app.listen(PORT, () => {
    console.log(`WSV start with ${PORT}`);
})

process.on('SIGINT', () => {
    server.close(() => console.log('Exit server'))
})