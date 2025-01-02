import * as net from "net";
import assert from 'assert';

const expectedResponse = `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: 12\r\n\r\nfoobar/1.2.3`;


function testUserAgent() {
	return new Promise<void>((resolve, reject) => {
		const client = new net.Socket();

		client.connect(4221, 'localhost', () => {
			console.log('Connected to server');

			const request = `GET /user-agent HTTP/1.1\r\nHost: localhost:4221\r\nUser-Agent: foobar/1.2.3\r\nAccept: */*\r\n\r\n`;
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

testUserAgent().catch(() => process.exit(1));
