const app = require('express')();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const http = require('http').Server(app);
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE;
const cors = require('cors');
const cron = require('node-cron');
const cronReminder = require('./middlewares/cron');

global.token = '';

/*
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    optionsSuccessStatus: 200,
  })
);
*/

/*
app.post('*', (req, res) => {
  console.log('Richiesta POST ricevuta:', req.body);
});
*/

app.use(
  cors({
    origin: '*',
    optionsSuccessStatus: 200,
  })
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('DB connections successfully');
  })
  .catch((err) => {
    console.error('Errore nella connessione a MongoDB:', err);
  });

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('Unhandled rejection!');
  process.exit(1);
});

process.on('unchaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('Unchaught Exception!');
  process.exit(1);
});

var session = require('express-session');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var i18n = require('i18n-express');

app.use(cookieParser());

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

app.use(
  session({
    secret: 'secretkey',
    resave: false,
    saveUninitialized: true,
  })
);

app.use(flash());
app.use(
  i18n({
    translationsPath: path.join(__dirname, 'i18n'),
    siteLangs: ['es', 'en', 'de', 'it', 'fr'],
    textsVarName: 'translation',
  })
);

app.use(express.static(path.join(__dirname, 'public')));

const authRouter = require('./routers/authRoutes');
const dashboardRouter = require('./routers/dashboardRoutes');
const userRouter = require('./routers/userRoutes');
const reminderRouter = require('./routers/reminderRoutes');
const categoryRouter = require('./routers/categoryRoutes');

app.use('/api/', authRouter);
app.use('/api/', dashboardRouter);
app.use('/api/', userRouter);
app.use('/api/', reminderRouter);
app.use('/api/', categoryRouter);

// Pianifica il cronjob giornaliero alle 23:00
cron.schedule('00 23 * * *', () => {
  cronReminder();
});

http.listen(8001, function () {
  console.log('listening on *:8001');
});
