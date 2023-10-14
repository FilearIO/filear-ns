const fs = require('fs');
const path = require('path');
const { WarpFactory } = require('warp-contracts');
const { ArweaveSigner, DeployPlugin } = require('warp-contracts-plugin-deploy');
const initialState = require('../src/contracts/initial-state.json');
const jwk = require('../.secrets/jwk.json');

(async () => {
  const warp = WarpFactory.forMainnet().use(new DeployPlugin());;
  const contractSrc = fs.readFileSync(path.join(__dirname, '../dist/contract.js'), 'utf8');

  console.log('Deployment started');
  const { contractTxId } = await warp.deploy({
    wallet: new ArweaveSigner(jwk),
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
