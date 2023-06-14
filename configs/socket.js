const ios = require('socket.io');
const { realRemoforceNotifications } = require('../controllers/notification.controller');


module.exports.startSocketServer = function (server) {
    const io = ios(server, {
        cors: {
            origin: process.env.CLIENT,
            methods: 'GET,POST,PUT,DELETE',
            credentials: true,
        },
    });

    let onlineUsers = [];

    const sendMessageToGroup = async (groupEmails) => {
        try {
            // Fetch messages from the database based on groupEmails

            groupEmails.forEach(async (email) => {
                const user = onlineUsers.find((u) => u.email === email);
                const notificationArr = await realRemoforceNotifications(email);
                if (user) {
                    const { socketId } = user;

                    io.to(socketId).emit('getNotification', notificationArr);
                }
            });
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const addNewUser = (email, socketId) => {
        !onlineUsers.some((user) => user.email === email) && onlineUsers.push({ email, socketId });
    };

    const removeUser = (socketId) => {
        onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
    };

    const getUser = (email) => onlineUsers.find((user) => user.email === email);

    io.on('connection', (socket) => {
        console.log('A user connected');
        socket.on('sendNotification', ({ receiverEmail, notificationArr }) => {
            const receiver = getUser(receiverEmail);
            console.log(notificationArr);
            io.to(receiver.socketId).emit('getNotification', notificationArr);
        });
        socket.on('newUser', ({ email }) => {
            addNewUser(email, socket.id);
        });
        socket.on('sendNotificationToTalents', ({ emails }) => {
            sendMessageToGroup(emails);
        });
        socket.on('disconnect', () => {
            removeUser(socket.id);
        });

        // Handle other socket events here
    });
};
