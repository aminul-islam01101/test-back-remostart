const ios = require('socket.io');
const colors = require('colors');
const http = require('http');
const app = require('./app');
const { connectDataBase } = require('./configs/db');
const { realRemoforceNotifications } = require('./controllers/notification.controller');
const { startSocketServer } = require('./configs/socket');

require('dotenv').config();

colors.setTheme({
    info: 'green',
    help: 'cyan',
    warn: 'yellow',
    error: 'red',
});
const port = process.env.PORT;

async function startServer() {
    try {
        await connectDataBase();

        const server = http.createServer(app);
        startSocketServer(server);

        server.listen(port, () => {
            console.log(`App is running on port ${port}`);
        });
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

startServer();
