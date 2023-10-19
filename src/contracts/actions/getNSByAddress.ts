import type { State, Action } from '../types'
import { getNSKey } from '../util'

export const getNSByAddress = async (state: State, action: Action) => {
  const { input } = action

  const key = getNSKey(input.address)
  const ns = await SmartWeave.kv.get(key);

  if (ns === undefined) {
    throw new ContractError(`The Name Service of ${input.address} has not registered`)
  }

  return { result: JSON.parse(ns) }
}
