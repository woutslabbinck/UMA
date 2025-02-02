/* eslint-disable @typescript-eslint/consistent-type-assertions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Logger } from './loggers/logger';

const loggerKey = '__LOGGER__HANDLERSJS__LOGGING__';

const getGlobalLogger = (): Logger => (global as any)[loggerKey];

const setGlobalLogger = (newLogger: Logger): void => {

  (global as any)[loggerKey] = newLogger;

};

export const setLogger = (
  logger: Logger,
): void => {

  setGlobalLogger(logger);

};

export const getLogger = (): Logger => {

  const logger = getGlobalLogger();
  // if (!logger) throw new Error('No logger was set. Set a logger using setLogger()');

  return logger;

};
