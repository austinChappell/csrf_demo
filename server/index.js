require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authController = require('./controllers/auth');
const todosController = require('./controllers/todos');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(cookieParser());
app.use(cors({
  allowedHeaders: ['Content-Type', 'x-csrf-token'],
  credentials: true,
  exposedHeaders: ['x-csrf-token'],
  origin: 'http://www.good.com:3000'
}));

app.use('/auth', authController);
app.use('/todos', todosController);

app.listen(4000, () => {
  console.log('app running on PORT 4000');
});

