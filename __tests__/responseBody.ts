import * as net from "net";
import assert from 'assert';

const expectedResponse = `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: 3\r\n\r\nabc`;

function testResponseBody() {
	return new Promise<void>((resolve, reject) => {
		const client = new net.Socket();

		client.connect(4221, 'localhost', () => {
			console.log('Connected to server');

			const request = `GET /echo/abc HTTP/1.1\r\nHost: localhost:4221\r\nUser-Agent: curl/7.64.1\r\nAccept: */*\r\n\r\n`;
			client.write(request);
		});

		let responseData = '';
		client.on('data', (data) => {
			responseData += data.toString();
		});

		client.on('end', () => {
			try {
				console.log('Server response:', JSON.stringify(responseData));
				assert.strictEqual(responseData, expectedResponse, 'Response does not match the expected output');
				console.log('Test passed: The response matches the expected output');
				resolve();
			} catch (error: any) {
				console.error('Test failed:', error.message);
				reject(error);
			}
		});

		client.on('error', (error) => {
			console.error('Connection error:', error.message);
			reject(error);
		});
	});
}

testResponseBody().catch(() => process.exit(1));
