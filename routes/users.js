const usersRouter = require('express').Router();

const {
  getUsers, getUserById, createUser, changeProfile, changeAvatar,
} = require('../controllers/users');

usersRouter.get('/users', getUsers);
usersRouter.get('/users/:userId', getUserById);
usersRouter.post('/users', createUser);
usersRouter.patch('/users/me', changeProfile);
usersRouter.patch('/users/me/avatar', changeAvatar);

module.exports = usersRouter;
