
const colors = require('colors');

const app = require('./app');
const { connectDataBase } = require('./configs/db');


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

     

        app.listen(port, () => {
            console.log(`App is running on port ${port}`.yellow.bold);
        });
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}

startServer();
