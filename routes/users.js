const usersRouter = require('express').Router();

const {
  getUsers, getUserById, changeProfile, changeAvatar, getUserInfo,
} = require('../controllers/users');
const { validationChangeAvatar, validationChangeProfile, validationUserId } = require('../middlewares/validation');

usersRouter.get('/users', getUsers);
usersRouter.get('/users/me', getUserInfo);
usersRouter.get('/users/:userId', validationUserId, getUserById);
usersRouter.patch('/users/me', validationChangeProfile, changeProfile);
usersRouter.patch('/users/me/avatar', validationChangeAvatar, changeAvatar);

module.exports = usersRouter;
