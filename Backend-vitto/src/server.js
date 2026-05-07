require('dotenv').config();
const app = require('./app');
const connectDB = require('./database/db');

const port = process.env.PORT || 5000;

// Connect to Database
connectDB().then(() => {
  // Start server
  const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err, promise) => {
    console.error(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
  });
});
