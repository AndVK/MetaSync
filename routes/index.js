const router = require('express').Router();
const { Course } = require('../db/models');
const sendmail = require('sendmail')({ silent: true });
const rp = require('request-promise');
const requestOptions = {
  method: 'GET',
  uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
  qs: {
    'start': '1',
    'limit': '5000',
    'convert': 'USD'
  }, 
  headers: {
    'X-CMC_PRO_API_KEY': '7ef17337-198d-46d1-8e1f-d1702a86b14f',
  },
  json: true,
  gzip: true,
};

/* GET home page. */
router.get('/', async (req, res) => {
  res.render('index');
});

router.get('/meta', async (req, res) => {
  const crypto = await rp(requestOptions);
  res.json(crypto);
});

router.post('/courses', (req, res) => {
  let cryptoData = '';
  const { coinMass, formData } = req.body;
  coinMass.forEach((item) => {
    cryptoData += `Криптовалюта: ${item.name}, стоимость: ${item.quote.USD.price.toFixed(2)}, капитализация: ${item.quote.USD.market_cap.toFixed(2)}, изменение цены за 24 часа: ${item.quote.USD.percent_change_24h.toFixed(2)}\n`;
  });
  console.log(cryptoData);
  try {
    const record = Course.create({ email: formData.email, data: cryptoData });
    res.sendStatus(200);
    sendmail({
      from: 'info@metasync.com',
      to: `${formData.email}`,
      replyTo: '',
      subject: 'Курс крипты от MetaSync',
      html: `${cryptoData}`,
    }, function (err, reply) {
      console.log(err && err.stack)
      console.dir(reply)
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

module.exports = router;
