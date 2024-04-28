const net = require('net')
const Parser = require('./respParser')

const PORT = 3000
let store = {}

const server = net.createServer(connection => {
  console.log('client connected...')

  connection.on('data', data => {
    // data comes as buffer

    const parser = new Parser({
        returnReply: (input) => {
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
        },
        returnError: (error) => {
            console.log('error = ', error)
        }
    })

    parser.execute(data)
  })
})

server.listen(PORT, () => console.log(`Server started on port ${ PORT }`))