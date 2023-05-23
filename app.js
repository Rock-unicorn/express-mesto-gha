const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const routes = require('./routes/index');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const middlewareErrors = require('./utils/errors/middleware-errors');
const { validationLogin, validationCreateUser } = require('./middlewares/validation');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());
mongoose.connect('mongodb://127.0.0.1:27017/mestodb');
app.use(helmet());
app.use(requestLogger);
app.post('/signin', validationLogin, login);
app.post('/signup', validationCreateUser, createUser);
app.use(auth);
app.use('/', routes);
app.use(errorLogger);
app.use(errors());
app.use(middlewareErrors);

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
