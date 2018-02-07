var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', 
      name: "PriyankaSaba", username: "PSaba", tweets: 8, followers: 22 ,
      posts: [{name: "hi", username: "wellthen", date: "July 30", post: "what????", image: "/images/backimg.png"}]});
});

module.exports = router;
