const NotFoundError = require('../utils/errors/not-found-err');

const errorsRouter = (req, res, next) => {
  next(new NotFoundError('Данные по запросу не найдены'));
};

module.exports = errorsRouter;
