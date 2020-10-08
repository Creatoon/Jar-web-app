//Core Modules
const path = require('path');
// Third Party Modules
const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongosanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const compression = require('compression');

// Our Own Modules
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const roomRouter = require('./routes/roomRoute');
const userRouter = require('./routes/userRoute');
const viewRouter = require('./routes/viewRoute');
const proposalRouter = require('./routes/proposalRoute');

// Start Express App
const app = express();

app.enable('trust proxy');

// Pug Settings
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Serving Static Files
app.use(express.static(path.join(__dirname, '/public')));

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: [
          "'self'",
          'https://bullakijaanamaikon.s3.us-east-2.amazonaws.com'
        ],
        styleSrc: ["'self'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        scriptSrc: ["'self'"]
      }
    }
  })
);

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in one hour'
});

app.use('/api', limiter);

// Body parser middleware
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// Data Sanitization against NoSql Query Injection
app.use(mongosanitize());

// Data sanitization against XSS
app.use(xss());

app.use(compression());

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.requestTime);
  next();
});

// Router Creation

app.use('/', viewRouter);
app.use('/api/v1/rooms', roomRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/proposal', proposalRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
