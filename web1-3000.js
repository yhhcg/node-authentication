var express = require('express');
var proxy = require('http-proxy-middleware');

// mount `exampleProxy` in web server
var app = express();
app.use(express.static('web1'));

app.listen(3000);