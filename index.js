const http = require('http');
const projects = require('./data-store');
let server;

const port = process.env.PORT || 8000
server = http.createServer((req, res) => {

  if (req.method === 'GET') {
    if (req.url === '/projects') {
      res.statusCode = 200;
      res.write(`{"projects": ${JSON.stringify(projects)}`);
      res.end();
    } else {
      res.statusCode = 404;
      res.write(`{"message": "NOT FOUND"}`);
      res.end();
    }
  }

  if (req.method === 'POST') {
    if (req.url === '/projects') {
      let body = ''
      req.on("data", (chunk) => {
        body += chunk;
        const newProject = JSON.parse(body)
        const isStored = projects.find(project => project.id === newProject.id);

        if (isStored) {
          res.statusCode = 400;
          res.write(`{"message": "BAD REQUEST"}`);
          res.end();
        } else {
          projects.push(newProject)
          res.statusCode = 201;
          res.write(`{"projects": ${JSON.stringify(projects)}`);
          res.end();
        }

      });

    } else {
      res.statusCode = 404;
      res.write(`{"message": "NOT FOUND"}`);
      res.end();
    }
  }

})

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
})

module.exports = server;
