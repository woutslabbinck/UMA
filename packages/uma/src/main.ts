import * as path from 'path';
import {ComponentsManager} from 'componentsjs';
import {NodeHttpServer} from '@useid/handlersjs-http';
import {setLogger} from '@useid/handlersjs-logging'
import {WinstonLogger} from '@thundr-be/sai-helpers'
import yargs from 'yargs';

const argv = yargs(process.argv.slice(2)).options({
  config: {type: 'string'},
  host: {type: 'string', default: 'localhost'},
  protocol: {type: 'string', default: 'http'},
  mainModulePath: {type: 'string'},
  customConfigPath: {type: 'string'},
}).parseSync();

const umaPort = 4000;
const protocol = argv.protocol
const host = argv.host
const config =argv.customConfigPath

export const launch: () => Promise<void> =
async () => {
  const variables: Record<string, any> = {};

  variables['urn:authorization-service:variables:port'] = umaPort;
  variables['urn:authorization-service:variables:host'] = host;
  variables['urn:authorization-service:variables:protocol'] = protocol;
  variables['urn:authorization-service:variables:baseUrl'] = `${protocol}://${host}:${umaPort}/uma`;

  variables['urn:authorization-service:variables:mainModulePath'] =  path.join(__dirname, '../');
  variables['urn:authorization-service:variables:customConfigPath'] = config; // will return all access modes allways

  const mainModulePath = variables['urn:authorization-service:variables:mainModulePath'];

  const configPath = variables['urn:authorization-service:variables:customConfigPath'];

  setLogger(new WinstonLogger('test-logger', 60, 30));
  const manager = await ComponentsManager.build({
    mainModulePath,
    logLevel: 'silly',
    typeChecking: false
  });

  await manager.configRegistry.register(configPath);

  const umaServer: NodeHttpServer = await
  manager.instantiate('urn:authorization-service:default:NodeHttpServer',
      {variables});

  umaServer.start();
};

launch();
