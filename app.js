const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;

  if (url === '/') {
    if (method === 'POST') {
      const body = [];
      req.on('data', (chunk) => {
        body.push(chunk);
      });

      req.on('end', () => {
        const parsedBody = Buffer.concat(body).toString();
        const message = parsedBody.split('=')[1];
        fs.writeFileSync('message.txt', message);
        res.statusCode = 302;
        res.setHeader('Location', '/');
        return res.end();
      });
    } else {
      const message = fs.readFileSync('message.txt', 'utf8');

      res.setHeader('Content-Type', 'text/html');
      res.write('<html>');
      res.write('<head><title>Enter Message</title></head>');
      res.write('<body>');
      res.write('<form action="/" method="POST"><input type="text" name="message" placeholder="Enter message"><button type="submit">Send</button></form>');

      if (message) {
        res.write('<h2>Message:</h2>');
        res.write(`<p>${message}</p>`);
      }

      res.write('</body>');
      res.write('</html>');
      return res.end();
    }
  } else {
    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<head><title>My First Page</title></head>');
    res.write('<body><h1>Hello from my Node.js Server!</h1></body>');
    res.write('</html>');
    res.end();
  }
});

server.listen(3000);