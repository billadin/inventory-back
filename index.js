require('dotenv').config();
require('express-async-errors');
const express = require('express')
const app = express()
const cors = require('cors')


// DB connection
const connectDB = require('./db/connect');
const authenticateUser = require('./middleware/authentication');

// Routers
const authRouter = require('./routes/auth');
const storeRouter = require('./routes/store')
const productRouter = require('./routes/product')
const salesRouter = require('./routes/sales')
const planRouter = require('./routes/plan')

//Error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

//Middleware
app.use(express.json());
app.use(cors())

//Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/store', authenticateUser, storeRouter);
app.use('/api/v1/products', authenticateUser, productRouter);
app.use('/api/v1/sales', authenticateUser, salesRouter);
app.use('/api/v1/plan', authenticateUser, planRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();