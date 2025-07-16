const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./db/connectDB');

// Load environment variables
dotenv.config();

app.use(cors())
const app = express();
const PORT = process.env.PORT || 3000;

//  Middleware
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//  CORS Setup
// app.use(
//   cors({
//     origin: function (origin, callback) {
//       const allowedOrigins = ['http://localhost:3000', 'https://medical-backend-teal.vercel.app'];

//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error('❌ Not allowed by CORS'));
//       }
//     },
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//     credentials: true,
//   })
// );

//  Root Route
app.get('/', (req, res) => {
  res.send('Welcome to the Medicine Backend API');
});

//  Routes
app.use('/api/medicines', require('./product/routes/products.routs'));
app.use('/api/users', require('./customer/routes/auth.route'));
app.use('/api/admin', require('./admin/admin.route/admin.route.js')); //  Add admin route here
app.use('/api/orders', require('./order/controllers/routes/order.routes.js')); // for order


// ❌ Optional: if seller route is still in development
// app.use('/seller', require('./admin/seller.route/seller.route'));

//  Handle 404 for undefined routes
app.use((req, res, next) => {
  res.status(404).json({ message: '🚫 Route not found' });
});

//  Global Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Global Error:', err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? {} : err.stack,
  });
});

// Connect to DB and Start Server
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
