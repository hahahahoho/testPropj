var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.io);
  
  res.render('conTest', { 
      title: 'conTest',
  });
});
//필요한것 데이터 받으면 연결된 소켓이벤트 발생시키기.
//그럼 어떻게??
//연결된 소켓을 받아와야함.
//연결된 소켓을 어떻게 받을것인가. 우선적으로 접속부터 확인해보자
router.post('/', function(req, res, next) {
  console.log('post');
  var io = req.io;
  console.log(io);
  console.log(req.body);
  io.emit('postData', req.body)
  res.send('success');
});

module.exports = router
