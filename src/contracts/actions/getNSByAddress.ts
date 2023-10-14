import type { State, Action } from '../types'

export const getNSByAddress = async (state: State, action: Action) => {
  const { input } = action

  const ns = await SmartWeave.kv.get(input.address);

  if (ns === undefined) {
    throw new ContractError(`The Name Service of ${input.address} has not registered`)
  }

  return { result: JSON.parse(ns) }
}