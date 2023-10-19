import type { State, Action } from '../types'
import { getAttentionKey } from '../util'

export const removeWatchlist = async (state: State, action: Action) => {
  const { caller, input } = action
  const watchAddr = input.watchAddr

  if (watchAddr === undefined || watchAddr === '') {
    throw new ContractError('Illegal parameters')
  }

  const key = getAttentionKey(caller)
  const res = await SmartWeave.kv.get(key)

  if (res === undefined || res === null) {
    return { result: true }
  }

  try {
    const list = JSON.parse(res)
    const newList = list.filter(addr => addr !== watchAddr)
    await SmartWeave.kv.put(key, JSON.stringify(newList))
    return { result: true }
  } catch {
    throw new ContractError('Internal Error when exec [removeWatchlist]')
  }
}
