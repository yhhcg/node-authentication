const express = require('express');
const cookieParser = require('cookie-parser')

var session = require('express-session');
var FileStore = require('session-file-store')(session);

const app = express();
app.use(cookieParser());
app.use(express.static('./'));

var identityKey = 'skey';
app.use(session({
    name: identityKey,
    secret: 'chyingp',  // 用来对session id相关的cookie进行签名
    store: new FileStore(),  // 本地存储session（文本文件，也可以选择其他store，比如redis的）
    saveUninitialized: true,  // 是否自动保存未初始化的会话，建议false
    resave: false,  // 是否每次都重新保存会话，建议false
    cookie: {
      maxAge: 24 * 60 * 10 * 1000  // 有效期，单位是毫秒
    }
}));

const sessionData = {};

var apiRoutes = express.Router();

apiRoutes.get('/login/pager',function(req,res){
	res.sendFile('views/login.html', {root: __dirname });
})

apiRoutes.get('/oauth/authorize',function(req,res){
	sessionData[req.sessionID] = req.query.redirect_uri;
	console.log(req.sessionID)
	console.log(sessionData[req.sessionID])
	console.log(sessionData)
	/**
	 * 获取cookie，判断是否登录过
	 * 登录过则直接跳转
	 * 未登录则跳转登录页
	 */
	if (req.cookies['token'] === '123') {
		res.redirect(302, `${req.query.redirect_uri}?code=code&state=state`);
	} else {
		res.redirect(302, `${req.query.origin}?redirect_uri=${req.query.redirect_uri}`);
	}
})


var users = require('./users').items;

var findUser = function(name, password){
	return users.find(function(item){
		return item.name === name && item.password === password;
	});
};
apiRoutes.post('/login/user',function(req,res){
	console.log(req.sessionID)
	console.log(sessionData[req.sessionID])
	console.log(sessionData)

	var user = findUser((req.query || {}).name, (req.query || {}).password);
	
	if (user) {
		res.cookie('token', '123', {
			httpOnly: true
		});
		res.json({
			code: '0',
			data: sessionData[req.sessionID]
		});
	} else {
		res.json({
			code: '-1',
			message: '账号或者密码错误'
		});
	}
})

app.use('/', apiRoutes).listen(3001);
