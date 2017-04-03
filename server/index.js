/* eslint consistent-return:0 */

const express = require('express');
const fs = require('fs');
const https = require('https');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const logger = require('./logger');

const argv = require('minimist')(process.argv.slice(2));
const setup = require('./middlewares/frontendMiddleware');
const isDev = process.env.NODE_ENV !== 'production';
const ngrok = (isDev && process.env.ENABLE_TUNNEL) || argv.tunnel ? require('ngrok') : false;
const resolve = require('path').resolve;
const app = express();
const slotsData = require('./conf/slots');
const { readSlots, saveSlots } = require('./core/admin');
const makeStore = require('./core/store');

express.static.mime.default_type = 'text/javascript';

const store = makeStore();

// If you need a backend, e.g. an API, add your custom backend-specific middleware here
// app.use('/api', myApi);
app.use(bodyParser.json());

app.get('/api/session-start/:moment', (req, res) => {
  const slots = JSON.parse(JSON.stringify(slotsData));
  const moment = req.params.moment;

  store.dispatch({
    type: 'START_SESSION',
    slots,
    moment,
  });

  console.log(store.getState());
  console.log('START_SESSION by ');

  res.status(200).send(JSON.stringify(store.getState()));
});

app.post('/api/save-slots', (req, res) => {
  console.log(req.body);
  saveSlots(req.body.slots);
  res.send('Slots has been saved');
});

app.get('/api/save-slots', (req, res) => {
  res.send(readSlots());
});

// In production we need to pass these values in instead of relying on webpack
setup(app, {
  outputPath: resolve(process.cwd(), 'build'),
  publicPath: '/',
});

// get the intended host and port number, use localhost and port 3000 if not provided
const customHost = argv.host || process.env.HOST;
const host = customHost || null; // Let http.Server use its default IPv6/4 host
const prettyHost = customHost || 'localhost';

const port = argv.port || process.env.PORT || 3000;
const httpsPort = argv.port || process.env.PORT || 443;

let io;

// Start your app.
if (isDev) {
  const server = app.listen(port, host, (err) => {
    if (err) {
      return logger.error(err.message);
    }

    // Connect to ngrok in dev mode
    if (ngrok) {
      ngrok.connect(port, (innerErr, url) => {
        if (innerErr) {
          return logger.error(innerErr);
        }

        logger.appStarted(port, prettyHost, url);
      });
    } else {
      logger.appStarted(port, prettyHost);
    }
  });
  io = socketIo(server);
} else {
  const sslPath = '/etc/letsencrypt/live/xke-vote-pwa.aws.xebiatechevent.info/';
  const opt = {
    key: fs.readFileSync(`${sslPath}privkey.pem`),
    cert: fs.readFileSync(`${sslPath}fullchain.pem`),
  };
  const server = https.createServer(opt, app);
  io = socketIo.listen(server);
  server.listen(httpsPort);
}
