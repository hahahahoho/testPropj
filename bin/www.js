//const app = require('../app');
const debug = require('debug');
const http = require('http');
var express = require('express');
var path = require('path');
var app = express();
app.set('views', path.join(__dirname,'..', 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '..', 'public')));
var bodyParser = require('body-parser');                                                                     
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
var httpServer =http.createServer(app).listen(8333, "127.0.0.1", function(req,res){
    console.log('Socket IO server has been started');
  });
var io = require('socket.io').listen(httpServer);
io.on('connection', function(socket){
    console.log('소켓연결');
});
var indexRouter = require('../routes/index');
app.use(function(req, res, next){
    console.log('필터용');
    req.io = io;
    next();
})
app.use('/', indexRouter);
///////////////////////http 통신 적용////////////////////////////////////

const port = normalizePort(process.env.PORT || '8003');
//const port = 65080;


///////////////////////udp 통신 적용////////////////////////////////////
var dgram = require('dgram');
var udp_server = dgram.createSocket('udp4');
udp_server.on('listening', function(){
    var addr = udp_server.address();
    console.log('UDP Server listening port :' + addr.port);
});
udp_server.on('message', function(msg, remote){
    console.log(remote.address + ':' + remote.port + ' - ' + msg);
})
udp_server.bind(8001,"localhost");

///////////////////////tcp 통신 적용////////////////////////////////////
var net = require('net');
var tcp_server = net.createServer(function(client){
    console.log('client connection');
    client.setTimeout(1000);
    client.setEncoding('utf8');
    client.on('data', function(data){
        console.log('received' + data.toString());
    })
    client.on('end', function(){
        console.log('client disconnected');
        tcp_server.getConnections(function(err, count){
            console.log('남아있는 클라이언트 수 :' + count)
        })
    })
})
tcp_server.listen(8002, 'localhost', function(){
    console.log('server listening');
    tcp_server.on('close', function(){
        console.log('서버 끝');
    })
    tcp_server.on('error', function(err){
        console.log('Server Error: ', JSON.stringify(err));
    });
})
///////////////////////통신 적용 끝////////////////////////////////////

function normalizePort(val) {
  var port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
}
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }
  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}





//////////////////////////실제 채팅구현///////////////////////////////////////////////////
// const channel = ["channel01", "channel02", "channel03", "admin"];
// for(var i = 0 ; i<channel.length; i++){
//     io.of(`/${channel[i]}`).on('connection', function(socket){
//         console.log('client connected');
//         socket.myChannel = socket.adapter.nsp.name;
//         console.log(socket.myChannel);
//         //룸 접속
//         socket.on('joinRoom', (data)=>{
//             //새로운 room 이름 받고 저장
//             socket.myRoom = data.roomNum;
//             //room 생성 및 접속
//             socket.join(socket.myRoom);
//             data.entry = `${data.name}님이 ${socket.myRoom}방에 입장하셨습니다.`
//             io.of(socket.myChannel).to(socket.myRoom).emit('roomEntryMsg', data.entry);
//         });
//         //룸 아웃
//         socket.on('outRoom', (data)=>{
//             console.log(socket.myRoom);
//             if(socket.myRoom != null && socket.myRoom != '' && socket.myRoom != undefined){
//                 socket.leave(socket.myRoom);
//                 data.out = `${data.name}님이 ${socket.myRoom}방에서 퇴장하셨습니다.`
//                 io.of(socket.myChannel).to(socket.myRoom).emit('roomExitMsg', data.out);
//             }
//         });
//         //room user 채팅
//         socket.on('roomChat', (data)=>{
//             //socket.emit('roomChatMsg', data);
//             io.of(socket.myChannel).to(socket.myRoom).emit('roomChatMsg', data);
//         });
//         //관리자메시지
//         socket.on('adminMsg', function(data){
//             try{
//                 if(data.channel != null && data.channel != undefined && data.channel != ""){
//                     if(data.room != null && data.room != undefined && data.room != ""){
//                         console.log('ch');
//                         io.of(data.channel).to(data.room).emit('getAdminMsg', data);   
//                     }else{
//                         console.log('room');
//                         io.of(data.channel).emit('getAdminMsg', data);
//                     }    
//                 }else{
//                     console.log('all');
//                     for(var j=0; j<channel.length-1; j++){
//                         io.of(channel[j]).emit('getAdminMsg', data);
//                     }
//                 } 
//                 io.of('/admin').emit('sendMsgResult', "전송성공");
//             }catch(error){
//                 io.of('/admin').emit('sendMsgResult', "전송실패");
//             }
//         });
//         //연결해제
//         socket.on('disconnect', () => {
//             console.log('client disconnected');
//         });
//         /*socket.on('서버에서 받을 이벤트명', function(데이터) {
//             // 받은 데이터 처리
//             socket.emit('서버로 보낼 이벤트명', 데이터);
//         });*/
//     })
// }
