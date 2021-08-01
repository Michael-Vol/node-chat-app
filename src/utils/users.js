const users = [];

const addUser = ({ id, username, room }) => {
	//Clean the data
	username = username.trim().toLowerCase();
	room = room.trim().toLowerCase();

	//Validate the data
	if (!username || !room) {
		return {
			error: 'Username and room are required',
		};
	}

	//Check for existing user
	const existingUser = users.find((user) => {
		return user.room === room && user.username === username;
	});

	//Validate Username
	if (existingUser) {
		return {
			error: 'Username is in use',
		};
	}

	//Store user
	const user = { id, username, room };
	users.push(user);
	return { user };
};

const removeUser = (id) => {
	const index = users.findIndex((user) => user.id === id);

	if (index !== -1) {
		return users.splice(index, 1)[0];
	}
};

const getUser = (id) => {
	const user = users.find((user) => user.id === id);
	return user;
};

const getUsersInRoom = (room) => {
	room = room.trim().toLowerCase();
	const usersInRoom = users.filter((user) => user.room === room);
	return usersInRoom;
};

// addUser({
// 	id: 22,
// 	username: 'Andrew',
// 	room: 'South Philly',
// });

// addUser({
// 	id: 42,
// 	username: 'Mike',
// 	room: 'South Philly',
// });
// addUser({
// 	id: 32,
// 	username: 'Andrew',
// 	room: 'Center City',
// });

// //Test remove user

// // console.log(users);
// // const removedUser = removeUser(22);
// // console.log(removedUser);
// // console.log(users);

// //Test get user
// console.log(getUser(32));
// //Test get users in rooom
// console.log(getUsersInRoom('South Philly'));
// console.log(getUsersInRoom('Center City'));
// console.log(getUsersInRoom('fairmount'));

module.exports = {
	addUser,
	removeUser,
	getUser,
	getUsersInRoom,
};
