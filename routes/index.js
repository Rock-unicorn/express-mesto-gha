const router = require('express').Router();
const usersRouter = require('./users');
const cardsRouter = require('./cards');
const errorsRouter = require('./notfound');

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);
router.use('/*', errorsRouter);

module.exports = router;
