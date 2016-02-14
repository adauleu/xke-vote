import config from '../config';
import server from '../server_old/main';
import _debug from 'debug';

const debug = _debug('app:bin:server');
const port = config.server_port;
const host = config.server_host;

server.listen(port)
debug(`Server is now running at ${host}:${port}.`);
