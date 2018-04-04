var express = require('express');
var router = express.Router();
var mysqlDb = require('../dao/mysql-operator');

/* GET home page. */
router.get('/', function(req, res, next) {


    //验证登录状态
    var authElement = false;
    if (req.session.email) {
        authElement = true;
    }

    mysqlDb.query("select sku,usname,jpname,image,uslink,jplink,ifnull(uscode,'No discount') uscode,ifnull(jpcode,'割引なし') jpcode from product_detail limit 1,4",[],function (err,field) {

        if (err) {
console.log(err);
            res.redirect("/nothing");
            return;
        }
        res.render('index', { "authElement": authElement, "products" : field });
    });

});

module.exports = router;
