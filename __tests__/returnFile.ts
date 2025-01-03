import * as net from "net";
import assert from 'assert';

const expectedResponse = `HTTP/1.1 200 OK\r\nContent-Type: application/octet-stream\r\nContent-Length: 35\r\n\r\nHello, World! from sample.txt file.`;

const expected404Response = `HTTP/1.1 404 Not Found\r\nContent-Type: text/plain\r\nContent-Length: 13\r\n\r\n404 Not Found`;

const request = `GET /files/sample.txt HTTP/1.1\r\nHost: localhost:4221\r\nUser-Agent: curl/7.64.1\r\nAccept: */*\r\n\r\n`;

const request404 = `GET /files/nonexistentfile HTTP/1.1\r\nHost: localhost:4221\r\nUser-Agent: curl/7.64.1\r\nAccept: */*\r\n\r\n`;

function testReturnFile(request: string, expectedResponse: string, testName?: string) {
	return new Promise<void>((resolve, reject) => {
		const client = new net.Socket();

		client.connect(4221, 'localhost', () => {
			console.log('Connected to server');
			request = request;
			client.write(request);
		});

		let responseData = '';
		client.on('data', (data) => {
			responseData += data.toString();
		});

		client.on('end', () => {
			try {
				assert.strictEqual(responseData, expectedResponse, `Test ${testName}: failed:Response does not match the expected output`);
				console.log(`Test ${testName}: passed: The response matches the expected output`);
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


testReturnFile(request, expectedResponse, 'testReturnFile').catch(() => process.exit(1));

testReturnFile(request404, expected404Response, 'testReturnNotFound').catch(() => process.exit(1));
