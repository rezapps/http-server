import * as net from "net";

const PORT = 4221;

const server = net.createServer((socket) => {
	socket.on('data', (data) => {
		const request = data.toString();
		const path = request.split(' ')[1];

		let responseBody = '';
		let contentType = '';
		let contentLength = 0;
		let responseHeaders = '';

		if (path === '/') {
			responseBody = `HTTP/1.1 200 OK\r\n\r\n`;
			contentType = 'text/plain';
			contentLength = responseBody.length;
			responseHeaders = `HTTP/1.1 200 OK\r\n` +
		`Content-Type: ${contentType}\r\n` +
		`Content-Length: ${contentLength}\r\n` +
		`\r\n`;
		}
		else if (path.startsWith('/echo/')) {
			const message = path.slice(6);
			responseBody = message;
			contentType = 'text/plain';
			contentLength = responseBody.length;
			responseHeaders = `HTTP/1.1 200 OK\r\n` +
		`Content-Type: ${contentType}\r\n` +
		`Content-Length: ${contentLength}\r\n` +
		`\r\n`;
		}
		else {
			responseBody = '404 Not Found';
			contentType = 'text/plain';
			contentLength = responseBody.length;
			responseHeaders = `HTTP/1.1 404 Not Found\r\n` +
		`Content-Type: ${contentType}\r\n` +
		`Content-Length: ${contentLength}\r\n` +
		`\r\n`;
		}

		socket.write(responseHeaders);
		socket.write(responseBody);
		socket.end();
	});

});

server.listen(PORT, 'localhost',() => {
	console.log(`Server is listening on port http://localhost:${PORT}`);
});
