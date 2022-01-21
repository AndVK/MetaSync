const { Guest } = require('../db/models');

const checkIp = (async (req, res, next) => {
  res.locals.ip = req.ip;
  try {
    await Guest.create({ ip: res.locals.ip });
    next();
  } catch (error) {
    console.log(error);
    next();
  }
});

module.exports = { checkIp };
