var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io'),
    io = io.listen(http),
    net = require('net'),
    tcpServer = net.createServer(),
    cors = require('cors'),
    bodyParser = require('body-parser'),
    path = require('path'),
    url = require('url'),
    fs = require('fs'),
    sys = require(process.binding('natives').util ? 'util' : 'sys'),
    listArduinos = [];

app.set('port', process.env.PORT || 8090);
app.use(cors());
app.use(bodyParser());
app.use(express.static(path.join(__dirname, 'app')));

app.get('/', function(req, res, next){
  res.sendfile('index.html');
});

// Cliente web conecta no socket.
io.on('connection', function(client){

  // Avisa aos clientes web, que um novo cliente web está conectado.
  client.broadcast.send({ message: client.id + ' conectado.' });

  // Evento de recebimento de mensagem do cliente web com o socket.
  client.on('message', function(message){

    // Avisa aos clientes web, que uma nova mensagem foi enviada.
    client.broadcast.send({ message: [ client.id, message ] });

    for (a in listArduinos) {

      // Envia a mensagem para o arduino.
      listArduinos[a].write(message);
      console.log('NodeJS - Mensagem enviada: ' + message + '.');

    }

  });

  client.on('disconnect', function(){

    // Avisa aos clientes web, que o cliente web está desconectado.
    client.broadcast.send({ message: client.id + ' desconectado.' });

  });
});

// Arduino conecta no socket.
tcpServer.on('connection',function(socket){

  // Avisa ao nodejs, que um arduino está conectado.
  console.log('NodeJS - ' + tcpServer.connections + ' arduinos conectados.');

  // Avisa próprio arduino, que ele foi conectado.
  socket.write('Arduino - Conectado ao socket.\r\n');

  // Adiciona o arduino na lista de arduinos.
  listArduinos.push(socket);

  // Evento de recebimento de mensagem do arduino o nodejs.
  socket.on('data',function(data){

    // Avisa ao nodejs, que o arduino mandou uma mensagem.
    console.log('NodeJS - Mensagem recebida: ' + data + '.');

    // Avisa ao próprio arduino, que ele mandou uma mensagem.
    //socket.write('Arduino - Mensagem enviada: ' + data + '.\r\n');

  })
});

http.listen(app.get('port'), function(){
  console.log('NodeJS está na porta: ' + app.get('port') + '.');
});

tcpServer.listen(1337, function(){
  console.log('Socket está na porta: 1337.');
});