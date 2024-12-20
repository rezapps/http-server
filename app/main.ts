import * as net from "net";

const PORT = 4221;

const server = net.createServer((socket) => {
    socket.write(Buffer.from(`HTTP/1.1 200 OK\r\n\r\n`));
    socket.end();
});

server.listen(PORT, () => {
    console.log(`Server is listening on port http://localhost:${PORT}`);
});

server.on('connection', (socket) => {
    console.log('New client connected');
});
