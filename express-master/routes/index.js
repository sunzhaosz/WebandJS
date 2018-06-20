var express = require('express');
var router = express.Router();
var fs = require('fs');

var PATH = './public/data/';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: '首页'
  });
});
router.get('/index', function(req, res, next) {
  res.render('index', {
    title: '首页'
  });
});

router.get('/login', function(req, res, next) {
  res.clearCookie('user');
  res.render('login', {
    title: '登录'
  });
});

router.get('/user', function(req, res, next) {
  if (!req.cookies.user) {
    return res.render('login', {});
  }
  else if(req.cookies.user == "admin"){
    res.render('admin', {
      title: '管理中心'
    });
  }
  else{
    res.render('user', {
      title: '个人中心'
    });
  }
});

router.get('/portfolio', function(req, res, next) {
  res.render('portfolio', {
    title: '选项页面'
  });
});

router.get('/emei', function(req, res, next) {
  res.render('emei', {
    title: '峨眉'
  });
});

router.get('/huashan', function(req, res, next) {
  res.render('huashan', {
    title: '华山'
  });
});

router.get('/kunlun', function(req, res, next) {
  res.render('kunlun', {
    title: '昆仑'
  });
});

router.get('/wudang', function(req, res, next) {
  res.render('wudang', {
    title: '武当'
  });
});

router.get('/qingcheng', function(req, res, next) {
  res.render('qingcheng', {
    title: '青城'
  });
});

router.get('/kongtong', function(req, res, next) {
  res.render('kongtong', {
    title: '崆峒'
  });
});

router.get('/quanzhen', function(req, res, next) {
  res.render('quanzhen', {
    title: '全真'
  });
});

router.get('/shaolin', function(req, res, next) {
  res.render('shaolin', {
    title: '少林'
  });
});

module.exports = router;