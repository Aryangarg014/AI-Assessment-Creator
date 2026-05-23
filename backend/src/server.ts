import app from './app';
import config from './config';
import { connectDB } from './config/db';
import { getRedisClient } from './config/redis';

const bootstrap = async (): Promise<void> => {
  // Connect to MongoDB
  await connectDB();

  // Eagerly connect Redis so the first health-check isn't slow
  const redis = getRedisClient();
  if (redis.status === 'wait' || redis.status === 'close' || redis.status === 'reconnecting') {
    try {
      await redis.connect();
    } catch (e) {
      // Ignore if it's already connecting
    }
  }

  // Start HTTP server
  const server = app.listen(config.port, () => {
    console.log(`✅ Backend running on http://localhost:${config.port}`);
    console.log(`   Environment : ${config.nodeEnv}`);
    console.log(`   Health check: http://localhost:${config.port}/api/health`);
  });

  // Graceful shutdown
  const shutdown = () => {
    console.log('\nShutting down gracefully…');
    server.close(async () => {
      await redis.quit();
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
};

bootstrap().catch((err) => {
  console.error('Fatal startup error:', err);
  process.exit(1);
});
