import app from './app';

import connectDB from './configs/db.config';
import environmentConfig from './configs/environment.config';

// Connecting to MongoDB and Starting Server
const start = async () => {
  try {
    await connectDB(environmentConfig.MONGODB_CONNECTION_STRING);

    console.log('MongoDB database connection established successfully to... ');

    app.listen(environmentConfig.PORT, () => {
      console.log(`Listening: http://localhost:${environmentConfig.PORT}`);
    });
  } catch (error) {
    console.log('MongoDB connection error. Please make sure MongoDB is running: ');
  }
};

// Establish http server connection
start();
