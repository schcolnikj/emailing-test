const express = require('express');
const morgan = require('morgan');
const cors = require('cors')

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const emailRoutes = require('./routes/email.routes');


const pkg = require('../package.json');
const { scheduleReset } = require('./middlewares/mailLimitReset');

const app = express();


app.set('pkg', pkg)

app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

scheduleReset();

app.use('/auth', authRoutes)
app.use('/email', emailRoutes)
app.use('/users', userRoutes)


module.exports = app;