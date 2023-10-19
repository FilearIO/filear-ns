import type { State, Action } from '../types'
import { getAttentionKey } from '../util'

export const addWatchlist = async (state: State, action: Action) => {
  const { caller, input } = action
  const watchAddr = input.watchAddr

  if (watchAddr === undefined || watchAddr === '') {
    throw new ContractError('Illegal parameters')
  }

  try {
    const key = getAttentionKey(caller)
    const res = await SmartWeave.kv.get(key)

    if (res === undefined || res === null) {
      await SmartWeave.kv.put(key, JSON.stringify([watchAddr]))
      return { result: true }
    }

    const list = JSON.parse(res)
    list.push(watchAddr)
    await SmartWeave.kv.put(key, JSON.stringify(list))
    return { result: true }
  } catch {
    throw new ContractError('Internal Error when exec [addWatchlist]')
  }
}
