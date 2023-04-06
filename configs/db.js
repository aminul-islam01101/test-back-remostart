const mongoose = require('mongoose');
require('dotenv').config();

mongoose.set('strictQuery', true);
 const mongoDB = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.dtbllhc.mongodb.net/Remo?retryWrites=true&w=majority`;

const connectDataBase = async () => {
    try {
        await mongoose.connect(mongoDB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected'.bgMagenta);
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};

module.exports = {connectDataBase, mongoDB};
