const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./db/connectDB');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ CORS Middleware for ALL ORIGINS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.options('*', cors()); // ✅ Handle preflight requests

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Root
app.get('/', (req, res) => {
  res.send('Welcome to the Medicine Backend API');
});

// Routes
app.use('/api/medicines', require('./product/routes/products.routs'));
app.use('/api/users', require('./customer/routes/auth.route'));
app.use('/api/admin', require('./admin/admin.route/admin.route.js'));
app.use('/api/orders', require('./order/controllers/routes/order.routes.js'));

// 404
app.use((req, res, next) => {
  res.status(404).json({ message: '🚫 Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Global Error:', err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? {} : err.stack,
  });
});

// Start
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  });
