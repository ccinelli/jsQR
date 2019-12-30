var fs = require('fs');
var http = require('http');
var https = require('https');
var privateKey  = fs.readFileSync(__dirname + '/private.key', 'utf8');
var certificate = fs.readFileSync(__dirname + '/certificate.crt', 'utf8');

var credentials = {key: privateKey, cert: certificate};
var express = require('express');
var app = express();
app.use(express.static(__dirname + '/../docs'));

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(process.env.PORT || 8080);
httpsServer.listen(process.env.SSL_PORT || 8443);