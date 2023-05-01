const { ERROR_CODE_NOT_FOUND } = require('../utils/errors');

const errorsRouter = (req, res) => {
  res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Данные по запросу не найдены' });
};

module.exports = errorsRouter;
