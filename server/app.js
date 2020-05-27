const port = 3000;
const express = require('express');
const app = express();
const server = app.listen(port, () => {
    console.log("Listening on port: " + port);
});
const io = require('socket.io')(server);

let roomName='';
io.on('connection', function(socket){
	
	io.sockets.emit("user-joined", socket.id, io.engine.clientsCount, Object.keys(io.sockets.clients().sockets),socket.rooms);

	socket.on('signal', (toId, message) => {
		io.to(toId).emit('signal', socket.id, message);
		
	  });
	  
	  socket.on('room', (room) => {
		socket.join(room, () => {
			roomName = room;
			console.log(socket.rooms); // [ <socket.id>, 'room 237' ]
		  });
		  
	  });

    socket.on("message", function(data){
		io.sockets.emit("broadcast-message", socket.id, data);
    })

	socket.on('disconnect', function() {
		io.sockets.emit("user-left", socket.id);
	})
});

// app.listen(3000, function(){
	// console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
// });