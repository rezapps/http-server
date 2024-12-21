import * as net from "net";

const PORT = 4221;

const server = net.createServer((socket) => {
	// socket.write(Buffer.from(`HTTP/1.1 200 OK\r\n\r\n`));

	socket.on('data', (data) => {
		const request = data.toString();
		const path = request.split(' ')[1];

		const response = path === '/' ? `HTTP/1.1 200 OK\r\n\r\n` : `HTTP/1.1 404 Not Found\r\n\r\n`;

		socket.write(response);
		socket.end();
	});

});

server.listen(PORT, 'localhost',() => {
	console.log(`Server is listening on port http://localhost:${PORT}`);
});
