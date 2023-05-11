require('dotenv').config();
const colors = require('colors');
const http = require('http');
const mongoose = require('mongoose');
const app = require('./app');
const { connectDataBase } = require('./configs/db');

const mongoDB = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.dtbllhc.mongodb.net/Remo?retryWrites=true&w=majority`;

const port = process.env.PORT;

// mongoose.connect(mongoDB, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// }).then(() => {
//     console.log('Database connected');

// })

colors.setTheme({
    info: 'green',
    help: 'cyan',
    warn: 'yellow',
    error: 'red',
});
// const server = http.createServer(app);

// connectDataBase().then(() => {
//     server.listen(port, () => {
//         console.log('Server running on port'.warn.italic, port);
//     });
// });

// app.listen(port, () => {
//   console.log(`App is running on port ${port}`.yellow.bold);
// });
async function startServer() {
    try {
        await connectDataBase();

        app.listen(port, () => {
            console.log(`App is running on port ${port}`.yellow.bold);
        });
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}

startServer();
