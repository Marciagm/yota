var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    //res.sendFile('test');
    //res.render('test', { title: 'Express' });
    res.render('carmanage/addcarinfo', {
        title: '添加车辆信息'
    });
});

module.exports = router;
