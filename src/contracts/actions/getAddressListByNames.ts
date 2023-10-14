import type { State, Action } from '../types'

export const getAddressListByNames = async (state: State, action: Action) => {
  const { input } = action

  if (!Array.isArray(input.names)) {
    throw new ContractError('Invilide Params')
  }

  const res = {}

  for(const name of input.names) {
    const address = await SmartWeave.kv.get(name);
    if (address) {
      res[name] = address
    }
  }

  return { result: res }
}