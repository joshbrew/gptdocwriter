//just some sample code, not finished

const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // Serve the frontend static files
  if (pathname.startsWith('/frontend')) {
    const filePath = path.join(__dirname, pathname);
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end("Not Found");
      } else {
        res.writeHead(200);
        res.end(data);
      }
    });
    return;
  }

  // Home Page
  if (pathname === '/') {
    fs.readFile(path.join(__dirname, '/index.html'), (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end("Not Found");
      } else {
        res.writeHead(200);
        res.end(data);
      }
    });
    return;
  }

  // Chat API
  if (pathname === '/chat' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString(); // convert Buffer to string
    });
    req.on('end', () => {
      let user;
      try {
        const parsedBody = JSON.parse(body);
        user = parsedBody.user;
        
        ask(req.body.text).then((output) => {
            res.send({text:output.text});
        });

        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ text: "Response from the server" })); // Replace with actual response
      } catch (err) {
        res.writeHead(400);
        res.end("Invalid JSON");
      }
    });
    return;
  }

  // 404 for other routes
  res.writeHead(404);
  res.end("Not Found");
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});
