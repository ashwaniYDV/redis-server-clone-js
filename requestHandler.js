const RESPParser = require('./respParser');

let store = {};

async function handleRequest(data, connection) {
    const parser = new RESPParser(data);
    const input = await parser.readNewRequest();
    console.log('RESP parsed request:', input);

    const command = input[0].toLowerCase();

    switch (command) {
        case 'command': {
            connection.write('+OK\r\n');
            break;
        }
        case 'ping': {
            connection.write('+PONG\r\n');
            break;
        }
        case 'echo': {
            const value = input[1];
            connection.write(`$${value.length}\r\n${value}\r\n`);
            break;
        }
        case 'set': {
            const key = input[1];
            const value = input[2];
            store[key] = value;
            connection.write('+OK\r\n');
            break;
        }
        case 'get': {
            const key = input[1];
            const value = store[key];
            if (!value) {
                connection.write('$-1\r\n');
            } else {
                connection.write(`$${value.length}\r\n${value}\r\n`);
            }
            break;
        }
        default: {
            connection.write('-ERR unknown command\r\n');
        }
    }
}

module.exports = { handleRequest };
