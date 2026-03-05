require('dotenv').config();

const helmet = require('helmet')
const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose')
const createError = require('http-errors');
const secure = require('./src/middlewares/secure.mid')

require('./src/config/db.config');

const app = express();
const cors = require('./src/config/cors.config')
app.use(cors);

app.use(helmet());

app.use(express.json())
app.use(logger('dev'))

app.use(secure.removeId)

app.use('/api/v1', require('./src/routes/auth.routes.config'))
app.use('/api/v1', require('./src/routes/client.routes.config'))
app.use('/api/v1', require('./src/routes/project.routes.config'))

app.use((req, res, next) => next(createError(404, 'Route not found')))

app.use((error, req, res, next) => {
  if (error instanceof mongoose.Error.ValidationError) {
    error = createError(400, error)
  } else if (error instanceof mongoose.Error.CastError && error.path === '_id') {
    error = createError(404, `Resource not found`)
  } else if (error.message.includes('E11000')) {
    Object.keys(error.keyValue).forEach((key) => error.keyValue[key] = 'Already exists')
    error = createError(409, { errors: error.keyValue })
  } else if (!error.status) {
    error = createError(500 , error)
  }

  console.error(error)

  const data = {
    message: error.message
  }

  if (error.errors) {
    const errors = Object.keys(error.errors)
      .reduce((errors, errorKey) => {
        errors[errorKey] = error.errors[errorKey].message;
        return errors;
      }, {});
    data.errors = errors;
  }

  res.status(error.status)
    .json(data)
})

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Aplication running at port ${port}`))