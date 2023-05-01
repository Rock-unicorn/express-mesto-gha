const router = require('express').Router();
const usersRouter = require('./users');
const cardsRouter = require('./cards');
const errorsRouter = require('./notfound');

router.use('/', usersRouter);
router.use('/', cardsRouter);
router.use('/*', errorsRouter);

module.exports = router;
