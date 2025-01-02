import * as net from "net";
import assert from "assert";

async function testConcurrentConnections() {
  const numberOfConnections = 10;
  let completedConnections = 0;
  const expectedResponse = `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: 12\r\n\r\nfoobar/1.2.3`;

  function createClient(index: number) {
    return new Promise<void>((resolve, reject) => {
      const client = new net.Socket();

      client.connect(4221, "localhost", () => {
        console.log(`Client ${index} connected to server`);

        const request = `GET /user-agent HTTP/1.1\r\nHost: localhost:4221\r\nUser-Agent: foobar/1.2.3\r\nAccept: */*\r\n\r\n`;
        client.write(request);
      });

      let responseData = "";
      client.on("data", (data) => {
        responseData += data.toString();
      });

      client.on("end", () => {
        try {
          assert.strictEqual(
            responseData,
            expectedResponse,
            `Client ${index}: Response does not match the expected output`
          );
          console.log(`Client ${index}: Test passed`);
          completedConnections++;
          resolve();
        } catch (error: any) {
          console.error(`Client ${index}: Test failed:`, error.message);
          reject(error);
        }
      });

      client.on("error", (error) => {
        console.error(`Client ${index}: Connection error:`, error.message);
        reject(error);
      });
    });
  }

  const clientPromises = Array.from(
    { length: numberOfConnections },
    (_, index) => createClient(index)
  );

  try {
    await Promise.all(clientPromises);
    console.log(
      `All ${completedConnections} out of ${numberOfConnections} connections passed`
    );
  } catch (error) {
    console.error("Concurrent connection test failed:", error);
    process.exit(1);
  }
}

testConcurrentConnections().catch(() => process.exit(1));

