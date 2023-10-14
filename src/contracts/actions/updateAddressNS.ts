import type { State, Action } from '../types'

export const updateAddressNS = async (state: State, action: Action) => {
  const { caller, input } = action

  const inputName = input.name?.trim()

  const tryGetRegistered =  await SmartWeave.kv.get(inputName);
  if (tryGetRegistered) {
    throw new ContractError(`name ${inputName} has already registered`)
  }

  const tryGetOldNS = await SmartWeave.kv.get(caller);
  let oldNS = tryGetOldNS ? JSON.parse(tryGetOldNS) : undefined

  if (oldNS) {
    const newNS = {
      address: caller,
      name: inputName ? inputName : oldNS.name,
      avatar: input.avatar ? input.avatar : oldNS.avatar,
      lastModify: Date.now()
    }
    // Delete first and then assign
    await SmartWeave.kv.del(oldNS.name);
    await SmartWeave.kv.put(inputName, caller);
    await SmartWeave.kv.put(caller, JSON.stringify(newNS));
  } else {
    const newNS = {
      address: caller,
      name: inputName ?? '',
      avatar: input.avatar ?? '',
      lastModify: Date.now()
    }
    await SmartWeave.kv.put(inputName, caller);
    await SmartWeave.kv.put(caller, JSON.stringify(newNS));
  }
  return { result: true }
}
