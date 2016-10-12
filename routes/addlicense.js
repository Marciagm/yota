var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    //res.sendFile('test');
    //res.render('test', { title: 'Express' });
    console.log('start ddd');
    res.render('license/addlicense');
});

module.exports = router;
