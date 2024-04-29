const net = require('net');
const { handleRequest } = require('./requestHandler');

const PORT = 3000;

const server = net.createServer(connection => {
    console.log('client connected...');

    connection.on('data', async data => {
        console.log('Received data:', data.toString());
        
        try {
            await handleRequest(data, connection);
        } catch (error) {
            console.error('Error:', error);
            connection.write(`-${error}\r\n`);
        }
    });

    connection.on('end', () => {
        console.log('client disconnected...');
    });
});

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
