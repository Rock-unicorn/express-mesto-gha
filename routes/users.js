const usersRouter = require('express').Router();

const {
  getUsers, getUserById, changeProfile, changeAvatar, getUserInfo,
} = require('../controllers/users');
const { validationChangeAvatar, validationChangeProfile, validationUserId } = require('../middlewares/validation');

usersRouter.get('/', getUsers);
usersRouter.get('/me', getUserInfo);
usersRouter.get('/:userId', validationUserId, getUserById);
usersRouter.patch('/me', validationChangeProfile, changeProfile);
usersRouter.patch('/me/avatar', validationChangeAvatar, changeAvatar);

module.exports = usersRouter;
