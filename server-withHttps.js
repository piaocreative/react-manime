
const express = require('express');
const next = require('next');
const compression = require('compression');
const axios = require('axios');


var fs = require('fs');
var http = require('http');
var https = require('https');

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
const app = next();
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
    const express = express();

    express.use(compression());
    express.use(cookieParser())

    express.use(
      session({


        secret: !inAWSVPC ? "XXX" : process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        ...sessionStore
      })
    );

    // namespace has to go after the session or the namespace gets lost when requests are handled. 
    express.use(namespaceBinder)
    express.use(accessLog)
    // express.get('/a/:id', (req, res) => {
    //   const page = '/auth';
    //   const queryParams = { id: req.params.id };
    //   app.render(req, res, page, queryParams);
    // })

    // express.get('/p/:id', (req, res) => {
    //   const page = '/post';
    //   const queryParams = { id: req.params.id };
    //   app.render(req, res, page, queryParams);
    // });

    // express.get('/d/:id', (req, res) => {
    //   const page = '/data';
    //   const queryParams = { id: req.params.id };
    //   app.render(req, res, page, queryParams);
    // });

    //

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
  
    express.get('/robots.txt', (req, res) => (
      res.status(200).sendFile('robots.txt', staticTextOptions)
    ));
  
    express.get('/sitemap.xml', (req, res) => (
      res.status(200).sendFile('sitemap.xml', staticXmlOptions)
    ));  
    
    express.get('/sitemap.txt', (req, res) => (
      res.status(200).sendFile('sitemap.txt', staticTextOptions)
    ));  
    
    express.get('/:id', (req, res) => {
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
  
    express.get('*', (req, res) => {
      return handle(req, res);
    });

    const credentials = {
      key: fs.readFileSync('./selfsigned.key'),
      cert: fs.readFileSync('./selfsigned.crt')
    };

    var httpServer = http.createServer(express);
    var httpsServer = https.createServer(credentials, express);

    httpServer.listen(8080, error => {
      if (err) throw err;
      console.log('> Ready on http://localhost:8080');
    });
    httpsServer.listen(8443, error => {
      if (err) throw err;
      console.log('> Ready on https://localhost:8443');
    });

  })
  .catch(e => {
    log.error(e.stack);
    process.exit(1);
  });
  