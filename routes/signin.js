var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

    var authElement = false;
    if (req.session.email) {
        authElement = true;
    }

    res.render("signin", { "authElement": authElement });
});

module.exports = router;
