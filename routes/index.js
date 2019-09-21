var express = require('express');
var category = require('../modules/category');

var router = express.Router();


/* GET home page. */
router.get('/', function (req, res, next) {
  console.log('request.session - ', req.session);
  console.log('request.user - ', req.user);

  category.getCategories(function (category) {
    var fmsg = req.flash();
    var feedback = '';
    if(fmsg.signinMsg){
      feedback = fmsg.signinMsg[0];
    }
    var viewData = {
      title: 'CHOVA CLUB',
      category: category,
      loginUser: req.user,
      feedback: feedback
    };

    res.render('index', viewData);
  });
});

module.exports = router;
