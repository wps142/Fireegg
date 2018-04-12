var express = require('express');
var router = express.Router();

var mysqlDb = require('../dao/mysql-operator');

/* GET home page. */
router.get('/', function(req, res, next) {
//console.log("discount:"+req.session.email);
    var authElement = false;
    if (req.session.email) {
        authElement = true;
    }

        mysqlDb.query("select sku,usname,jpname,image,uslink,jplink,ifnull(uscode,'No discount') uscode,ifnull(jpcode,'割引なし') jpcode from product_detail",[],function (err,field) {

            if (err) {
                console.log(err);
                res.send(err);
                return;
            }
            //console.log(field);
            res.render('discount', { "authElement" : authElement, "products" : field});
        });

    //} else{
    //   console.log("index");
    //    res.redirect("/index");
    //}
});

module.exports = router;
