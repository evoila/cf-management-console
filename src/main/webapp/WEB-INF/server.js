var connect = require('connect');
connect.createServer(
    connect.static(__dirname + "/app")
).listen(8000);