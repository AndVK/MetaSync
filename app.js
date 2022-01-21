require('dotenv').config();
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const hbs = require('hbs');

const { checkIp } = require('./middlewares/allMiddleWares');
const indexRouter = require('./routes/index');

const app = express();
const PORT = process.env.PORT || 3000;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
hbs.registerPartials(path.join(process.env.PWD, 'views/partials'));
app.set('view engine', 'hbs');

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(checkIp);

app.use('/', indexRouter);

app.listen(PORT, () => {
  console.log('Server started on port: ', PORT);
});
