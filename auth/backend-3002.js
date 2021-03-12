const express = require('express');
const cookieParser = require('cookie-parser')
const qsStringify = require('qs/lib/stringify');

const app = express();
app.use(cookieParser())

app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});


var apiRoutes = express.Router()
apiRoutes.get('/user',function(req,res){
  if (req.headers.authorization) {
    res.send({
      code: '0',
      data: {
        userCode: 'test'
      }
    })
  } else {
    res.status(401).send();
  }
})
// /**
//  * 做登录操作，登录成功后跳转
//  */
// apiRoutes.get('/login.ajax',function(req,res){
//   res.cookie('token', '123', {
//     domain: '10.129.1.3',
//     httpOnly: true
//   });
// 	res.redirect(302, `http://10.129.1.3:3001/login/oauth/authorize?redirect_uri=${req.query.redirect_uri}`);
// })

app.use('/', apiRoutes).listen(3002);
