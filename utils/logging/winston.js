
const winston = require('winston');
const env = process.env.NODE_ENV;
const inAWSVPC = process.env.IN_AWS_VPC;


//const colors = require('./colors')
const dev = env !== 'production';

const transports =[];
transports.push(new winston.transports.File({ filename: 'manime_err.log', level: ['error', 'crit'] }))
transports.push(new winston.transports.File({ filename: 'manime_out.log' }))
/*process.env.LOG_SERVER_CONSOLE && transports.push(new winston.transports.Console({
  format: winston.format.printf((info)=>colors[info.level](`${info.level}: ${info.message}`))
}))*/
module.exports = winston.createLogger({
  level: process.env.LOG_LEVEL?process.env.LOG_LEVEL:'warn',
  //format: winston.format.json(),
  //defaultMeta: { service: 'user-service' },
  format: winston.format.simple(),
  transports
});

