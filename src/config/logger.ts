import winston from "winston";

const logger = winston.createLogger({
  format: winston.format.json()
});

const alignedWithColorsAndTime = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp(),
  winston.format.align(),
  winston.format.printf((info) => {
    const {
      timestamp, level, message, ...args
    } = info;

    const ts = timestamp.slice(0, 19).replace('T', ' ');
    return `${ts} [${level}]: ${message} ${Object.keys(args).length ? JSON.stringify(args, null, 2) : ''}`;
  }),
);

logger.add(new winston.transports.Console({
  format: alignedWithColorsAndTime,
}));



export const loggerToFile = winston.createLogger({
  level: 'info',
  format: winston.format.printf(({ message }) => message),
  transports: [
    new winston.transports.File({ filename: 'all.log' }),
  ],
});

export default logger;