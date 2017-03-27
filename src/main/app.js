import express from 'express';
import path from 'path'
import socketIo from 'socket.io';
import makeStore from './core/store';
import { slotsData } from './conf/slots.js';
import {saveSlots, readSlots} from './core/admin.js';
import bodyParser from 'body-parser';
import http from 'https';
import fs from 'fs';

const sslPath = '/etc/letsencrypt/live/xke-vote-pwa.aws.xebiatechevent.info/';

const isProd = process.env.NODE_ENV === "production";

const app = module.exports = express();
let io;
let store;

express.static.mime.default_type = "text/javascript";

//be able to load the files under the conf directory
app.use(express.static('build/main/conf'));
app.use(express.static('client/dist'));

// serve index.html for all get to anything but /api or hmr
app.get(/^\/(?!api\/).*$/, (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});

app.start = (port) => {
    store = makeStore();
    let listenPort = isProd ? 443 : 8080;
    let server = null;

    app.use(bodyParser.json());

    app.get('/api/session-start/:moment', (req, res) => {
      const slots = JSON.parse(JSON.stringify(slotsData));
      const moment = req.params.moment;

      store.dispatch({
        type: 'START_SESSION',
        slots: slots,
        moment
      });

      console.log(store.getState());
      console.log('START_SESSION by ');

      res.status(200).send(JSON.stringify(store.getState()));
    });

    app.get('/api/store', (req, res) => {
      res.status(200).send(store.getState());
    });

    app.post('/api/save-slots', function (req, res) {
      console.log(req.body);
      saveSlots(req.body.slots);
      res.send('Slots has been saved');
    });

    app.get('/api/save-slots', function (req, res) {
      res.send(readSlots());
    });

    if (isProd) {
        const options = {
            key: fs.readFileSync(sslPath + 'privkey.pem'),
            cert: fs.readFileSync(sslPath + 'fullchain.pem')
        };
        server = http.createServer(options, app);
        io = socketIo.listen(server);
        server.listen(listenPort);
    } else {
        server = app.listen(listenPort);
        io = socketIo(server);
    }
    console.log(`Server is now running at localhost:${listenPort}.`);

    // io.on('connection', (socket) => {
    //     console.log('new connection by ' + socket.id);
    //     socket.emit('updateSession', store.getState());
    //     // socket.on('action', (action) => {
    //     //     switch (action.type) {
    //     //         case 'SUBMIT_CHOOSEN_TALKS':
    //     //             store.dispatch(action);
    //     //             console.log('SUBMIT_CHOOSEN_TAKS by ' + socket.id);
    //     //             io.emit('updateVotes', store.getState());
    //     //             break;
    //     //         // case 'START_SESSION':
    //     //         //     //Copie initial slots
    //     //         //     var slots = Object.assign({}, slotsData);
    //     //         //     store.dispatch({
    //     //         //         type: 'START_SESSION',
    //     //         //         slots: slots,
    //     //         //         moment: action.moment
    //     //         //     });
    //     //         //     console.log(store.getState());
    //     //         //     console.log('START_SESSION by ' + socket.id);
    //     //         //     io.emit('updateSession', store.getState());
    //     //         //     break;
    //     //         case 'TERMINATE_SESSION':
    //     //             store.dispatch({
    //     //                 type: 'TERMINATE_SESSION'
    //     //             });
    //     //             console.log('TERMINATE_SESSION by ' + socket.id);
    //     //             io.emit('updateSession', store.getState());
    //     //             break;
    //     //         default:
    //     //             store.dispatch(action);
    //     //     }
    //     // });
    // });

    return server;
};

export default app;
