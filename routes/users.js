const usersRouter = require('express').Router();

const {
  getUsers, getUserById, changeProfile, changeAvatar, getUserInfo,
} = require('../controllers/users');
const { validationChangeAvatar, validationChangeProfile } = require('../middlewares/validation');

usersRouter.get('/users', getUsers);
usersRouter.get('/users/:userId', getUserById);
usersRouter.patch('/users/me', validationChangeProfile, changeProfile);
usersRouter.patch('/users/me/avatar', validationChangeAvatar, changeAvatar);
usersRouter.get('/users/me', getUserInfo);

module.exports = usersRouter;
