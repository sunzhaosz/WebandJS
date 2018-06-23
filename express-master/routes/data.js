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
    var name = req.body.username;
    var email = req.body.email;
    var subject = req.body.subject;
    var info = req.body.info;

    sql = 'INSERT INTO submit(username,name,email,subject,info,flag) VALUES(?,?,?,?,?,0)';
    var addSqlParams = [req.cookies.user, name, email, subject, info];
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

//密码修改接口
router.post('/save', function(req, res, next) {
    // req.cookies.user
    var username = req.cookies.user;
    var oldpwd = req.body.oldpwd;
    var newpwd = req.body.newpwd;
    console.log(username);

    sql = "update user set password = ? where username = ? and password = ?";
    var SqlParams = [newpwd,username,oldpwd];
    connection.query(sql, SqlParams,function(err, result) {
        if (err) {
            console.log('[UPDATE ERROR] - ', err.message);
            return res.send({
                status: 0,
                info: '修改失败'
            });
        }

        console.log('--------------------------UPDATE----------------------------');
        if(result.affectedRows !== 1)
            return res.send({
                status: 0,
                info: '密码错误'
            });
        console.log(result);
        console.log('------------------------------------------------------------\n\n');
        return res.send({
            status: 1,
            info: '修改成功'
        });
    });

});

//用户提交表单查询接口
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

//查询用户接口
router.post('/user_query', function(req, res, next) {
    // req.cookies.user
    var admin = "admin";

    sql = "select * from user where username != ?";
    var SqlParams = [admin];
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
            console.log(result[i].username);
            obj.push({
                username: result[i].username,
                email: result[i].email, 
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

//查询门派接口
router.post('/subject_query', function(req, res, next) {

    sql = "SELECT subjects.subject,chairman,COUNT(submit.`subject`) as amount from subjects LEFT JOIN submit on subjects.`subject` = submit.`subject` GROUP BY subjects.subject ORDER BY amount DESC";
    connection.query(sql,function(err, result) {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            return res.send({
                status: 0,
                info: '查询失败'
            });
        }
        var subject = []
        console.log('--------------------------SELECT----------------------------');
        var obj = new Array();
        for (var i = 0; i< result.length; i++) {
                obj.push({
                    rank: i+1,
                    subject: result[i].subject,
                    chairman: result[i].chairman,
                    amount: result[i].amount
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


//管理员查询接口
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
            console.log('[UPDATE ERROR] - ', err.message);
            return res.send({
                status: 0,
                info: '更新失败'
            });
        }

        console.log('--------------------------UPDATE----------------------------');
        console.log(result);
        console.log('------------------------------------------------------------\n\n');
        return res.send({
            status: 1,
            info: '更新成功'
        });
    });

});

//管理员删除用户接口
router.post('/delete_user', function(req, res, next) {
    // req.cookies.user
    var username = req.body.username;
    console.log(username)
    sql = "DELETE FROM user WHERE username = ?";
    var SqlParams = [username];
    connection.query(sql,SqlParams,function(err, result) {
        if (err) {
            console.log('[DELETE ERROR] - ', err.message);
            return res.send({
                status: 0,
                info: '更新失败'
            });
        }

        console.log('--------------------------DELETE----------------------------');
        console.log(result);
        console.log('------------------------------------------------------------\n\n');
        return res.send({
            status: 1,
            info: '更新成功'
        });
    });

});


//管理员审查接口
router.post('/submit_reject', function(req, res, next) {
    // req.cookies.user
    var name = req.body.name;
    var subject = req.body.subject;

    sql = "update submit set flag = ? where name = ? and subject = ?";
    var SqlParams = [2,name, subject];
    connection.query(sql,SqlParams,function(err, result) {
        if (err) {
            console.log('[UPDATE ERROR] - ', err.message);
            return res.send({
                status: 0,
                info: '更新失败'
            });
        }

        console.log('--------------------------UPDATE----------------------------');
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

