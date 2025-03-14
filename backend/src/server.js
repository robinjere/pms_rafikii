require('dotenv').config();
const App = require('./app');

async function startServer() {
  try {
    const app = new App();
    const expressApp = await app.initialize();
    
    const PORT = process.env.PORT || 5000;
    expressApp.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();