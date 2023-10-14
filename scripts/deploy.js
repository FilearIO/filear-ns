import fs from 'fs';
import path from 'path';
import { WarpFactory } from 'warp-contracts';
import { DeployPlugin } from 'warp-contracts-plugin-deploy';

import initialState from '../src/contracts/initial-state.json';
import jwk from '../.secrets/jwk.json';

(async () => {
  const warp = WarpFactory.forMainnet().use(new DeployPlugin());;
  const contractSrc = fs.readFileSync(path.join(__dirname, '../dist/contract.js'), 'utf8');

  console.log('Deployment started');
  const { contractTxId } = await warp.deploy({
    wallet: jwk,
    initState: JSON.stringify(initialState),
    src: contractSrc,
    evaluationManifest: {
      evaluationOptions: {
        useKVStorage: true
      }
    }
  });
  console.log('Deployment completed: ' + contractTxId);
})();
