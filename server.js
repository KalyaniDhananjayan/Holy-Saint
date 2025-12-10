require('dotenv').config();
const express = require('express');
const connectDB = require('./database/db');
const tshirtRouter = require('./routes/tshirt-route');
const authRouter = require('./routes/auth-routes');
const userRouter = require('./routes/user-routes');


const app = express();
const port = process.env.PORT || 3000;
connectDB();

//middleware to parse JSON requests
app.use(express.json());

//route
app.use('/api/v1/tshirts', tshirtRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 