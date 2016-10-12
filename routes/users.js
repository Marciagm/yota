var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    //res.sendFile('test');
    //res.render('test', { title: 'Express' });
    res.render('users', {
        message: '<h1>TEST</h1>',
        title: 'Title-for-test'
    });
});

module.exports = router;
