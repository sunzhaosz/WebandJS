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

//读取数据模块，供客户端调用
//查询接口，token校验
//公共接口，无需校验
//data/read?type=it
//data/read?type=it.json
router.get('/read', function(req, res, next) {
    var type = req.param('type') || "";
    fs.readFile(PATH + type + '.json', function(err, data) {
        if (err) {
            return res.send({
                status: 0,
                info: '读取文件异常'
            });
        }
        var COUNT = 50;
        // TODO: try{}catch(){}
        var obj = [];
        try {
            obj = JSON.parse(data.toString());
        } catch (e) {
            obj = [];
        }
        if (obj.length > COUNT) {
            obj = obj.slice(0, COUNT);
        }
        return res.send({
            status: 1,
            data: obj
        });
    });
});


// 数据存储模块——后台开发使用
router.post('/write', function(req, res, next) {
    if (!req.cookies.user) {
        return res.render('login', {});
    }
    // 文件名
    var type = req.param('type') || "";
    // 关键字段
    var url = req.param('url') || '';
    var title = req.param('title') || '';
    var img = req.param('img') || '';
    if (!type || !url || !title || !img) {
        return res.send({
            status: 0,
            info: '提交的字段不全'
        });
    }
    //1)读取文件
    var filePath = PATH + type + '.json';
    fs.readFile(filePath, function(err, data) {
        if (err) {
            return res.send({
                status: 0,
                info: '读取数据失败'
            });
        }
        var arr = JSON.parse(data.toString());
        //代表每一条记录
        var obj = {
            img: img,
            url: url,
            title: title,
            id: guidGenerate(),
            time: new Date()
        };
        arr.splice(0, 0, obj);
        //2)写入文件
        var newData = JSON.stringify(arr);
        fs.writeFile(filePath, newData, function(err) {
            if (err) {
                return res.send({
                    status: 0,
                    info: '写入文件失败'
                });
            }
            return res.send({
                status: 1,
                info: obj
            });
        });
    });
});

//阅读模块写入接口 后台开发使用
router.post('/write_config', function(req, res, next) {
    if (!req.cookies.user) {
        return res.render('login', {});
    }
    //TODO:后期进行提交数据的验证
    //防xss攻击 xss
    // npm install xss
    // require('xss')
    // var str = xss(name);
    var data = req.body.data;
    //TODO ： try catch
    var obj = JSON.parse(data);
    var newData = JSON.stringify(obj);

    // 写入
    fs.writeFile(PATH + 'config.json', newData, function(err, data) {
        if (err) {
            return res.send({
                status: 0,
                info: '写入数据失败'
            });
        }
        return res.send({
            status: 1,
            info: '数据写入成功',
            data: newData
        })
    })
});


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

    sql = 'INSERT INTO register(username,email,subject,info) VALUES(?,?,?,?)';
    var  addSqlParams = [username, email,subject,info];
    connection.query(sql,addSqlParams, function(err, result) {
        if(err){
        console.log('[INSERT ERROR] - ',err.message);
            return res.send({
                status: 0,
                info: '写入数据失败'
            });
        }        
 
        console.log('--------------------------INSERT----------------------------');
        //console.log('INSERT ID:',result.insertId);        
        console.log('INSERT ID:',result);        
        console.log('-----------------------------------------------------------------\n\n'); 
        return res.send({
            status: 1,
            info: '数据写入成功'
        });
    });

});



//提交表单接口
router.post('/register', function(req, res, next) {
    //用户名、email、subject、info
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;

    sql = 'INSERT INTO user(username,email,password) VALUES(?,?,?)';
    var  addSqlParams = [username,email,password];
    connection.query(sql,addSqlParams, function(err, result) {
        if(err){
        console.log('[INSERT ERROR] - ',err.message);
        var info="注册失败"
        if(/Duplicate entry/.test(err.message))
            info = "用户名已被注册";
            return res.send({
                status: 0,
                info: info
            });
        }        
 
        console.log('--------------------------INSERT----------------------------');
        //console.log('INSERT ID:',result.insertId);        
        console.log('INSERT ID:',result);        
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

    //TODO ：对用户名、密码进行校验
    //xss处理、判空

    //密码加密 md5(md5(password + '随机字符串'))
    //密码需要加密－> 可以写入JSON文件

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
        for (var i = 0; i < result.length; i++){
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

//guid
function guidGenerate() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    }).toUpperCase();
}

module.exports = router;