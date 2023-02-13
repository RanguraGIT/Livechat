'use strict'

const http = require('http')
const dotenv = require('dotenv')

dotenv.config()
const PORT = process.env.PORT || 8000

const server = http.createServer((request, response) => {
    const { method, url } = request

    response.setHeader('Content-Type', 'application/json')
    response.setHeader('X-Powered-By', 'NodeJS')

    if (method === 'GET' && url === '/') {
        response.statusCode = 200
        response.end(JSON.stringify({
            message: 'connection success!'
        }))
        return;
    }

    if (method === 'GET' && url === '/register') {
        response.statusCode = 200
        response.end(JSON.stringify({
            message: 'register success!'
        }))
        return;
    }
})

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

