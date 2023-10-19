import fs from 'fs';
import path from 'path';
import ArLocal from 'arlocal';
import { JWKInterface } from 'arweave/node/lib/wallet';
import { LoggerFactory, Warp, WarpFactory, Contract } from 'warp-contracts';
import { DeployPlugin } from 'warp-contracts-plugin-deploy';

import type { State, NSData } from '../src/contracts/types';
import InitialState from '../src/contracts/initial-state.json'

jest.setTimeout(30000);

describe('Testing the Filear Name Service', () => {
  let ownerWallet: JWKInterface;
  let owner: string;

  let user2Wallet: JWKInterface;
  let user2: string;

  let user3Wallet: JWKInterface;
  let user3: string;

  let initialState: State;

  let arlocal: ArLocal;
  let warp: Warp;
  let filearNS: Contract<State>;

  let contractSrc: string;

  let contractId: string;

  beforeAll(async () => {
    arlocal = new ArLocal(1820, false);
    await arlocal.start();

    LoggerFactory.INST.logLevel('error');

    warp = WarpFactory.forLocal(1820).use(new DeployPlugin());

    ({jwk: ownerWallet, address: owner} = await warp.generateWallet());

    ({jwk: user2Wallet, address: user2} = await warp.generateWallet());

    ({jwk: user3Wallet, address: user3} = await warp.generateWallet());

    console.table([
      { name: 'owner', address: owner },
      { name: 'user2', address: user2 },
      { name: 'user3', address: user3 },
    ])

    initialState = {
      ...InitialState,
      owner
    };

    contractSrc = fs.readFileSync(path.join(__dirname, '../dist/contract.js'), 'utf8');

    ({ contractTxId: contractId } = await warp.deploy({
      wallet: ownerWallet,
      initState: JSON.stringify(initialState),
      src: contractSrc,
      evaluationManifest: {
        evaluationOptions: {
          useKVStorage: true
        }
      }
    }));
    console.log('Deployed contract: ', contractId);
    filearNS = warp.contract<State>(contractId).connect(ownerWallet);
  });

  afterAll(async () => {
    await arlocal.stop();
  });

  it('should properly deploy contract', async () => {
    const contractTx = await warp.arweave.transactions.get(contractId);

    expect(contractTx).not.toBeNull();
  });

  it('should properly set name to "test"', async () => {
    const name = 'test'
    await filearNS.writeInteraction({ function: 'updateAddressNS', name });

    const { result: nsInfo } = await filearNS.viewState({
      function: 'getNSByAddress',
      address: owner,
    });
    expect((nsInfo as NSData).name).toEqual(name);
  });

  it('should show error when set name to "testtesttesttesttesttesttesttesttesttesttesttest"', async () => {
    const name = 'testtesttesttesttesttesttesttesttesttesttesttest'

    await expect(filearNS.writeInteraction({ function: 'updateAddressNS', name }, { strict: true })).rejects.toThrow(
      `the length of name must less than 40`
    );
  });

  it('should properly update name to "testUpdate"', async () => {
    const name = 'testUpdate'
    await filearNS.writeInteraction({ function: 'updateAddressNS', name });

    const { result: nsInfo } = await filearNS.viewState({
      function: 'getNSByAddress',
      address: owner,
    });
    expect((nsInfo as NSData).name).toEqual(name);
  });

  it('should show error when name "testUpdate" has registered', async () => {
    filearNS = warp.contract<State>(contractId).connect(user2Wallet);

    const name = 'testUpdate'

    await expect(filearNS.writeInteraction({ function: 'updateAddressNS', name }, { strict: true })).rejects.toThrow(
      `name ${name} has already registered`
    );
  });

  it(`should properly set name "test2" with ${user2}`, async () => {
    filearNS = warp.contract<State>(contractId).connect(user2Wallet);

    const name = 'test2'

    await filearNS.writeInteraction({ function: 'updateAddressNS', name });

    const { result: nsInfo } = await filearNS.viewState({
        function: 'getNSByAddress',
        address: user2,
      });
      expect((nsInfo as NSData).name).toEqual(name);
  });

  it('should properly getAddressList by names ["testUpdate", "test2"]', async () => {
    filearNS = warp.contract<State>(contractId).connect(user3Wallet);

    const { result: addrList } = await filearNS.viewState({ function: 'getAddressListByNames', names: ['testUpdate', 'test2'] });

    expect((addrList as Record<string, any>).testUpdate).toEqual(owner);
    expect((addrList as Record<string, any>).test2).toEqual(user2);
  });

  it(`test watchlist: `, async () => {
    filearNS = warp.contract<State>(contractId).connect(user3Wallet);

    await filearNS.writeInteraction({ function: 'addWatchlist', watchAddr: owner });
    await filearNS.writeInteraction({ function: 'addWatchlist', watchAddr: user2 });

    const { result: watchlist } = await filearNS.viewState({ function: 'getWatchlist' });
  
    expect((watchlist as string[]).join(',')).toEqual([`${owner}`, `${user2}`].join(','));
   
  });

  it(`remove owner from watchlist`, async () => {
    filearNS = warp.contract<State>(contractId).connect(user3Wallet);

    await filearNS.writeInteraction({ function: 'removeWatchlist', watchAddr: owner });

    const { result } = await filearNS.viewState({ function: 'getWatchlist' });
    expect((result as Array<string>).join(',')).toEqual([`${user2}`].join(','));
   
  });

});
