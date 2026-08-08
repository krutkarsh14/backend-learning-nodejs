const http = require('http');
const fs = require('fs');
const url = require('url');

const Myserver = http.createServer((req, res) => {

    const log = `${Date.now()} ${req.url}: New Request Received\n`;

    const myurl = url.parse(req.url, true);
    console.log(myurl);

    fs.appendFile("log.txt", log, (err) => {

        switch (req.url) {

            case '/':
                res.end("Hello this is Home page");
                break;

            case '/about':
                res.end("Hey i am Anup");
                break;

            case '/contact':
                res.end("656885555");
                break;

            default:
                res.end("404 Not Found");
        }
    });
});

Myserver.listen(5000, () => {
    console.log('my server is running...');
});