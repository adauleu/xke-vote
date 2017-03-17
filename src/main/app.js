import express from 'express';
import path from 'path'
import socketIo from 'socket.io';
import makeStore from './core/store';
import {slotsData} from './conf/slots.js';
import {saveSlots, readSlots} from './core/admin.js';
import bodyParser from 'body-parser';
import http from 'https';
import fs from 'fs';

const sslPath = '/etc/letsencrypt/live/xke-vote-pwa.aws.xebiatechevent.info/';

const options = {
  key: fs.readFileSync(sslPath + 'privkey.pem'),
  cert: fs.readFileSync(sslPath + 'fullchain.pem')
};

const app = module.exports = express();
let io;
let store;


//be able to load the files under the conf directory
app.use(express.static('conf'));
app.use(express.static('client/dist'));

// serve index.html for all get to anything but /api or hmr
app.get(/^\/(?!api\/).*$/, (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});

app.start = (port) => {
  store = makeStore();
  let listenPort = 443;
  let server = http.createServer(options, app);
  console.log(`Server is now running at localhost:${port}.`);

  io = socketIo.listen(server);
  io.on('connection', (socket) => {
    console.log('new connection by ' + socket.id);
    socket.emit('updateSession', store.getState());
    socket.on('action', (action) => {
      switch(action.type) {
        case 'SUBMIT_CHOOSEN_TALKS':
          store.dispatch(action);
          console.log('SUBMIT_CHOOSEN_TAKS by ' + socket.id);
          io.emit('updateVotes', store.getState());
          break;
        case 'START_SESSION':
          //Copie initial slots
          var slots = JSON.parse(JSON.stringify(slotsData));
          store.dispatch({
            type: 'START_SESSION',
            slots: slots,
            moment: action.moment
          });
          console.log(store.getState());
          console.log('START_SESSION by ' + socket.id);
          io.emit('updateSession', store.getState());
          break;
        case 'TERMINATE_SESSION':
          store.dispatch({
            type: 'TERMINATE_SESSION'
          });
          console.log('TERMINATE_SESSION by ' + socket.id);
          io.emit('updateSession', store.getState());
          break;
        default:
          store.dispatch(action);
      }
    });
  });
  server.listen(listenPort);
  return server;
};

app.use(bodyParser.json());

app.post('api/save-slots', function (req, res) {
  console.log(req.body);
  saveSlots(req.body.slots);
  res.send('Slots has been saved');
});

app.get('api/save-slots', function (req, res) {
  res.send(readSlots());
});

export default app;
