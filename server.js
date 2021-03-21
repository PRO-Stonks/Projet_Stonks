const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({
    path: './config.env'
});

process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION!!! shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});

const app = require('./app');

const database = process.env.DATABASE.replace(
    '${MONGO_USERNAME}', process.env.MONGO_USERNAME).replace(
    '${MONGO_PASSWORD}', process.env.MONGO_PASSWORD).replace(
    '${MONGO_HOSTNAME}', process.env.MONGO_HOSTNAME).replace(
    '${MONGO_PORT}', process.env.MONGO_PORT).replace(
    '${MONGO_DB}', process.env.MONGO_DB);

console.log(database);

// Connect the database
mongoose.connect(database, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(con => {
    console.log('DB connection Successfully!');
});

// Start the server
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Application is running on port ${port}`);
});

process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION!!!  shutting down ...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});