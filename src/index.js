const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const Filter = require('bad-words');
const { generateMessage, generateLocationMessage } = require('./utils/messages');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
app.use(express.json());

const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));

let count = 0;

io.on('connection', (socket) => {
	console.log(`New WebSocket Connection`);

	socket.on('join', ({ username, room }, callback) => {
		const { error, user } = addUser({ id: socket.id, username, room });
		console.log(user);
		if (error) {
			return callback(error);
		}
		socket.join(user.room);

		socket.emit('message', generateMessage(user.username, 'Welcome!'));
		socket.broadcast
			.to(user.room)
			.emit('message', generateMessage(user.username, `${user.username} has joined`));
		io.to(user.room).emit('roomData', {
			room: user.room,
			users: getUsersInRoom(user.room),
		});
		callback();
	});

	socket.on('sendMessage', (message, callback) => {
		const filter = new Filter();

		if (filter.isProfane(message)) {
			return callback('Profanity is not allowed');
		}

		const user = getUser(socket.id);

		io.to(user.room).emit('message', generateMessage(user.username, message));
		callback();
	});

	socket.on('disconnect', () => {
		{
			const user = removeUser(socket.id);
			if (user) {
				io.to(user.room).emit(
					'message',
					generateMessage(user.username, `${user.username} has left`)
				);
				io.to(user.room).emit('roomData', {
					room: user.room,
					users: getUsersInRoom(user.room),
				});
			}
		}
	});

	socket.on('sendLocation', (coords, callback) => {
		const user = getUser(socket.id);
		io.to(user.room).emit(
			'locationMessage',
			generateLocationMessage(
				user.username,
				`http://www.google.com/maps/?q=${coords.latitude},${coords.longitude}`
			)
		);

		callback();
	});
});

server.listen(port, () => {
	console.log(`Server is up on port ${port}!`);
});
