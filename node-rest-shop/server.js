const http = require('http');//imports something from nodejs
const app = require('./app');//imports app.js

//assigns a port at which project should run
const port = process.env.PORT || 3000;//process.env.PORT- an environment that set the variable. if is not set then we default it to 3000

const server = http.createServer(app);//create server

server.listen(port);// server starts listening on the port, then executes which ever listener or function we pass to create server

