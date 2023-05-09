const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const routes = require('./routes/index');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const middlewareErrors = require('./errors/middleware-errors');

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());
mongoose.connect('mongodb://127.0.0.1:27017/mestodb');
app.use(helmet());
app.post('/signin', login);
app.post('/signup', createUser);
app.use(auth);
app.use('/', routes);
app.use(middlewareErrors);

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
