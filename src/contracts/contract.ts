import type { State, Action, ContractResult } from './types'

import { evolve } from './actions/evolve'
import { getAddressListByNames } from './actions/getAddressListByNames'
import { getNSByAddress } from './actions/getNSByAddress'
import { updateAddressNS } from './actions/updateAddressNS'
import { getWatchlist } from './actions/getWatchlist'
import { addWatchlist } from './actions/addWatchlist'
import { removeWatchlist } from './actions/removeWatchlist'

export async function handle(state: State, action: Action): Promise<ContractResult> {
  const input = action.input;

  switch (input.function) {
    case 'evolve':
      return  evolve(state, action)
    case 'getAddressListByNames':
      return await getAddressListByNames(state, action)
    case 'getNSByAddress':
      return await getNSByAddress(state, action)
    case 'updateAddressNS':
      return await updateAddressNS(state, action)
    case 'getWatchlist':
      return await getWatchlist(state, action)
    case 'addWatchlist':
      return await addWatchlist(state, action)
    case 'removeWatchlist':
      return await removeWatchlist(state, action)
    default:
      throw new ContractError(`No function supplied or function not recognised: "${input.function}"`);
    }
}
