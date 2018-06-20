var express = require('express');
var router = express.Router();
var fs = require('fs');
var PATH = './public/data/';
var mysql = require('mysql');
//数据库连接
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'user'
});
connection.connect();

var sql = 'SELECT * FROM user';


//提交表单接口
router.post('/submit', function(req, res, next) {
    //用户名、email、subject、info
    if (!req.cookies.user) {
        return res.send({
            status: 0,
            info: '未登录'
        });
    }
    var username = req.body.username;
    var email = req.body.email;
    var subject = req.body.subject;
    var info = req.body.info;

    sql = 'INSERT INTO submit(username,name,email,subject,info,flag) VALUES(?,?,?,?,?,0)';
    var addSqlParams = [username, req.cookies.user, email, subject, info];
    connection.query(sql, addSqlParams, function(err, result) {
        if (err) {
            console.log('[INSERT ERROR] - ', err.message);
            return res.send({
                status: 0,
                info: '写入数据失败'
            });
        }

        console.log('--------------------------INSERT----------------------------');
        //console.log('INSERT ID:',result.insertId);        
        console.log('INSERT ID:', result);
        console.log('-----------------------------------------------------------------\n\n');
        return res.send({
            status: 1,
            info: '数据写入成功'
        });
    });

});


//用户查询接口
router.post('/query', function(req, res, next) {
    // req.cookies.user
    var username = req.cookies.user;

    sql = "select * from submit where username = ?";
    var SqlParams = [username];
    connection.query(sql, SqlParams,function(err, result) {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            return res.send({
                status: 0,
                info: '查询失败'
            });
        }

        console.log('--------------------------SELECT----------------------------');
        var obj = new Array();
        for (var i = 0; i < result.length; i++) {
            obj.push({
                name: result[i].name,
                email: result[i].email,
                subject: result[i].subject,
                info: result[i].info,
                flag: result[i].flag    
            });
        }    
        console.log(result);
        console.log('------------------------------------------------------------\n\n');
        return res.send({
            status: 1,
            info: obj
        });
    });

});


//用户查询接口
router.post('/admin_query', function(req, res, next) {
    // req.cookies.user
    var username = req.cookies.user;

    sql = "select * from submit";
    connection.query(sql,function(err, result) {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            return res.send({
                status: 0,
                info: '查询失败'
            });
        }

        console.log('--------------------------SELECT----------------------------');
        var obj = new Array();
        for (var i = 0; i < result.length; i++) {
            obj.push({
                name: result[i].name,
                email: result[i].email,
                subject: result[i].subject,
                info: result[i].info,
                flag: result[i].flag    
            });
        }    
        console.log(result);
        console.log('------------------------------------------------------------\n\n');
        return res.send({
            status: 1,
            info: obj
        });
    });

});

//信息查询接口
router.post('/info_query', function(req, res, next) {
    // req.cookies.user
    var name = req.body.name;
    var subject = req.body.subject;

    sql = "select * from submit where name = ? and subject = ?";
    var SqlParams = [name, subject];
    connection.query(sql,SqlParams,function(err, result) {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            return res.send({
                status: 0,
                info: '查询失败'
            });
        }

        console.log('--------------------------SELECT----------------------------');
        var info = result[0].info;

        console.log(result);
        console.log('------------------------------------------------------------\n\n');
        return res.send({
            status: 1,
            info: info
        });
    });

});

router.post('/submit_agree', function(req, res, next) {
    // req.cookies.user
    var name = req.body.name;
    var subject = req.body.subject;
    console.log(name);
    console.log(subject);
    sql = "update submit set flag = ? where name = ? and subject = ?";
    var SqlParams = [1,name, subject];
    connection.query(sql,SqlParams,function(err, result) {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            return res.send({
                status: 0,
                info: '更新失败'
            });
        }

        console.log('--------------------------SELECT----------------------------');
        console.log(result);
        console.log('------------------------------------------------------------\n\n');
        return res.send({
            status: 1,
            info: '更新成功'
        });
    });

});

router.post('/submit_reject', function(req, res, next) {
    // req.cookies.user
    var name = req.body.name;
    var subject = req.body.subject;

    sql = "update submit set flag = ? where name = ? and subject = ?";
    var SqlParams = [2,name, subject];
    connection.query(sql,SqlParams,function(err, result) {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            return res.send({
                status: 0,
                info: '更新失败'
            });
        }

        console.log('--------------------------SELECT----------------------------');
        console.log(result);
        console.log('------------------------------------------------------------\n\n');
        return res.send({
            status: 1,
            info: '更新成功'
        });
    });

});


//注册接口
router.post('/register', function(req, res, next) {
    //用户名、email、subject、info
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;

    sql = 'INSERT INTO user(username,email,password) VALUES(?,?,?)';
    var addSqlParams = [username, email, password];
    connection.query(sql, addSqlParams, function(err, result) {
        if (err) {
            console.log('[INSERT ERROR] - ', err.message);
            var info = "注册失败"
            if (/Duplicate entry/.test(err.message))
                info = "用户名已被注册";
            return res.send({
                status: 0,
                info: info
            });
        }

        console.log('--------------------------INSERT----------------------------');
        //console.log('INSERT ID:',result.insertId);        
        for (var i = 0; i < result.length; i++) {
            
            if (username === result[i].username && password === result[i].password) {
                res.cookie('user', username);
                return res.send({
                    status: 1
                });
            }
        }
        console.log('INSERT ID:', result);
        console.log('-----------------------------------------------------------------\n\n');
        return res.send({
            status: 1,
            info: '注册成功'
        });
    });

});

//登录接口
router.post('/login', function(req, res, next) {
    //用户名、密码、验证码
    var username = req.body.username;
    var password = req.body.password;


    sql = "select username,password from user";
    connection.query(sql, function(err, result) {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            return res.send({
                status: 0,
                info: '登录失败'
            });
        }

        console.log('--------------------------SELECT----------------------------');
        for (var i = 0; i < result.length; i++) {
            console.log(result[0]);
            if (username === result[i].username && password === result[i].password) {
                res.cookie('user', username);
                return res.send({
                    status: 1
                });
            }
        }
        console.log('------------------------------------------------------------\n\n');
        return res.send({
            status: 0,
            info: '登录失败'
        });
    });
});



module.exports = router;

