import type { State, Action } from '../types'
import { getAttentionKey } from '../util'

export const getWatchlist = async (state: State, action: Action) => {
  const { caller } = action

  const key = getAttentionKey(caller)
  const res = await SmartWeave.kv.get(key);

  if (res === undefined || res === null) {
    return { result: [] }
  }

  return { result: JSON.parse(res) }
}
