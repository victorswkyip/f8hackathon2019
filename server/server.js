const 
    path = require('path'),
    express = require('express'),
    //bodyParser = require('body-parser');
    //twilio = require('twilio');
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http, {}),
    dotenv = require('dotenv').config({path: `${__dirname}/.env`}),
    port = process.env.PORT;

//app.use(bodyParser.urlencoded({ extended: false } ));
app.use('/', express.static(path.join(__dirname, `/`))); 

io.on('connection', socket => {
  console.log('a user connected');
  
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('userReady', user => {
    console.log(user);
    worldState.users.push(user);
  });

  socket.on('userLeft', user => {
    console.log(user, " left room");
    const userIndex = worldState.users.findIndex(worldUser => user.id === worldUser.id);
    if (userIndex !== -1) {
      worldState.users.splice(userIndex, 1);
    }
  });

  socket.on('userUpdate', user => {
    console.log(user, " updated");
    const worldUser = worldState.users.find(worldUser => user.id === worldUser.id);
    if (worldUser) {
      worldUser.position = user.position;
      worldUser.rotation = user.rotation;
    }
  });

  setInterval(() => {
    socket.emit('tick', worldState);
  }, 60);
});

let worldState = {
  users: []
}

http.listen(port, () => {
  console.log(`listening on *:${port}`);
});