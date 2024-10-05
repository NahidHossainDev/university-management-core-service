/* eslint-disable no-unused-expressions */
import { Server } from 'http';
import app from './app';
import config from './config';
import { errorlogger, logger } from './shared/logger';

async function bootstrap() {
  const server: Server = app.listen(config.port, () => {
    config.env === 'development'
      ? console.log(`Server running on port ${config.port}`)
      : logger.info(`Server running on port ${config.port}`);
  });

  const exitHandler = () => {
    if (server) {
      server.close(() => {
        config.env === 'development'
          ? console.log('Server closed')
          : logger.info('Server closed');
      });
    }
    process.exit(1);
  };

  const unexpectedErrorHandler = (error: unknown) => {
    config.env === 'development'
      ? console.log(error)
      : errorlogger.error(error);
    exitHandler();
  };

  process.on('uncaughtException', unexpectedErrorHandler);
  process.on('unhandledRejection', unexpectedErrorHandler);

  process.on('SIGTERM', () => {
    config.env === 'development'
      ? console.log('SIGTERM received')
      : logger.info('SIGTERM received');
    if (server) {
      server.close();
    }
  });
}

bootstrap();
