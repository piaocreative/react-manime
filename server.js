
const express = require('express');
const next = require('next');
const compression = require('compression');
const axios = require('axios');

const dotenvLoad = require('dotenv-load');
dotenvLoad();

const cookieParser = require('cookie-parser')
process.winstonLogger = require('./utils/logging/winston.js')
const log = require('./utils/logging/index.js')



// env will be
const env = process.env.NODE_ENV;
const inAWSVPC = process.env.IN_AWS_VPC;

const dev = env !== 'production';
const port = process.env.PORT || 3000;
const app = next({ dev });
const handle = app.getRequestHandler();


/**
 * For logging access
 * @param {*} req 
 * @param {*} res 
 * @param {*} nextMiddleware 
 */
function accessLog(req, res, nextMiddleware) {

  log.http(`PATH=${req.url}`)
  nextMiddleware();
}

app.prepare()
  .then(() => {
    const server = express();

    server.use(compression());
    server.use(cookieParser())

    server.use(accessLog)


    const staticTextOptions = {
      root: __dirname + '/static/',
      headers: {
        'Content-Type': 'text/plain;charset=UTF-8',
      }
    };
    const staticXmlOptions = {
      root: __dirname + '/static/',
      headers: {
        'Content-Type': 'text/xml;charset=UTF-8',
      }
    };
  
    server.get('/robots.txt', (req, res) => (
      res.status(200).sendFile('robots.txt', staticTextOptions)
    ));
  
    server.get('/sitemap.xml', (req, res) => (
      res.status(200).sendFile('sitemap.xml', staticXmlOptions)
    ));  
    
    server.get('/sitemap.txt', (req, res) => (
      res.status(200).sendFile('sitemap.txt', staticTextOptions)
    ));  
    
    server.get('/:id', (req, res) => {
      let page = '/';
      let queryParams;
  
      axios({
        method: 'get',
        url: `https://seet0wnvr7.execute-api.us-west-1.amazonaws.com/default/referrals/${req.params.id}`,
      })
      .then(result => {
        if (result.data.rowCount != 0) {
          queryParams = { id: req.params.id };
          app.render(req, res, page, queryParams);
        } else {
          page = `/${req.params.id}`;
          queryParams = { id: req.params.id };
          app.render(req, res, page, queryParams)
        }
      })
      .catch(error => {
        page = `/${req.params.id}`;
        queryParams = { id: req.params.id };
        app.render(req, res, page, queryParams);
      });
    });
  
    server.get('*', (req, res) => {
      return handle(req, res);
    });
  
    server.listen(port, err => {
      if (err) throw err;
      log.info(`${env} Ready on http://localhost:${port}`);
    });
  })
  .catch(e => {
    log.error(e.stack);
    process.exit(1);
  });
  