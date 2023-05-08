const usersRouter = require('express').Router();

const {
  getUsers, getUserById, changeProfile, changeAvatar, getUserInfo,
} = require('../controllers/users');

usersRouter.get('/users', getUsers);
usersRouter.get('/users/:userId', getUserById);
usersRouter.patch('/users/me', changeProfile);
usersRouter.patch('/users/me/avatar', changeAvatar);
usersRouter.get('/users/me', getUserInfo);

module.exports = usersRouter;
