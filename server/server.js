const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const express = require('express');
const connectDB = require('./database/db');
const tshirtRouter = require('./routes/tshirt-route');
const authRouter = require('./routes/auth-routes');
const userRouter = require('./routes/user-routes');
const homeRouter = require('./routes/home-routes');
const orderRouter = require('./routes/order-routes');


const app = express();
const port = process.env.PORT || 5000;
connectDB();


app.use(cors({
  origin: 'https://holy-saint-fadn47gjz-kalyani-dhananjayans-projects.vercel.app/',
  credentials: true
}));


app.use(cookieParser());

//middleware to parse JSON requests
app.use(express.json());
app.set('etag', false);

//route
app.use('/api/v1/tshirts', tshirtRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/home', homeRouter);
app.use('/api/v1/orders', orderRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 