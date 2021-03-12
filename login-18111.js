// include dependencies
var express = require('express');
var proxy = require('http-proxy-middleware');



// mount `exampleProxy` in web server
var app = express();
app.use(express.static('login'));

// // 请求转发
// //proxy middleware options
// var options = {
//     target: 'http://api.qa.51xjzx.com', // target host
//     changeOrigin: true,               // needed for virtual hosted sites
//     autoRewrite:true,
//     router: {
//         // when request.headers.host == 'localhost:12',
//         // override target 'http://api.qa.51xjzx.com/act/getUserFridayUi' to 'http://localhost:3000'
//         'localhost:12' : 'http://localhost:3000',
//     }
// };

// // create the proxy (without context)
// var exampleProxy = proxy(options);

// app.use('/act', exampleProxy);


app.listen(18111);