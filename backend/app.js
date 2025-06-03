const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');

// Routes
const authRoutes = require('./routes/authRoutes');
const customerRoutes = require('./routes/customerRoutes');
const orderRoutes = require('./routes/orderRoutes');
const segmentRoutes = require('./routes/segmentRoutes');
const campaignRoutes = require('./routes/campaignRoutes');

// Middlewares
const { errorHandler, notFound } = require('./middlewares/errorMiddleware');

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || ["*"],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// Routes
app.use('/api/users', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/segments', segmentRoutes);
app.use('/api/campaigns', campaignRoutes);


app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  next();
});

app.get('*',(req,res)=>{
  res.send("Hello World From Xeno Assignment Backend");
})

// Error handling middleware
app.use(errorHandler);
app.use(notFound);

module.exports = app;