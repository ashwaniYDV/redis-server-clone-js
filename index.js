const net = require('net')
const RESPParser = require('./respParser')

const PORT = 3000
let store = {}


const server = net.createServer(connection => {
    console.log('client connected...')

    connection.on('data', async data => {
        console.log('Received data:', data.toString())

        try {
            const parser = new RESPParser(data)
            const input = await parser.readNewRequest()
            console.log('RESP parsed request:', input)

            const command = input[0].toLowerCase()

            switch (command) {
                case 'command': {
                    connection.write('+OK\r\n')
                }
                break
                case 'ping': {
                    connection.write('+PONG\r\n')
                }
                break
                case 'echo': {
                    const value = input[1]
                    connection.write(`$${ value.length }\r\n${ value }\r\n`)
                }
                break
                case 'set': {
                    const key = input[1]
                    const value = input[2]
                    store[key] = value
                    connection.write('+OK\r\n')
                }
                break
                case 'get': {
                    const key = input[1]
                    const value = store[key]
                    if (!value) {
                        connection.write('$-1\r\n')
                    } else {
                        connection.write(`$${ value.length }\r\n${ value }\r\n`)
                    }
                }
                break
            }
        } catch (error) {
            console.error('Error parsing request:', error)
            connection.write(`-${ error }\r\n`)
        }
    })

    connection.on('end', () => {
        console.log('client disconnected...')
    })

})

server.listen(PORT, () => console.log(`Server started on port ${ PORT }`))