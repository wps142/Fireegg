var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

    if (req.session.email) {
        res.render('products', { "authElement": true });
        return;
    }
    res.redirect("/index");

});

module.exports = router;
