const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message, err);
  process.exit(1);
});

// ADDING OUR CONFIG FILE
dotenv.config({ path: './config.env' });

const socket = require('socket.io');
const app = require('./app');
const socketServer = require('./socketServer');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => console.log('DB CONNECTION SUCCESSFULL !'));

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`server is running on the port ${port}`);
});

// Mounting our server to socket
// 5e+7 is 50 mb in bytes
// options for the server
const options = {
  maxHttpBufferSize: 5e7
};

const io = socket(server, options);

io.on('connection', sock => {
  socketServer(sock);
});

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('SIGTERM RECIEVED. shutting down gracefully');
  server.close(() => {
    console.log('process terminated!');
  });
});
