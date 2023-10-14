type Address = string
type Name = string

export interface NSData {
  address: Address
  name: Name
  avatar: string
  lastModify: number
}

export interface State {
  owner: string
  canEvolve: boolean
  evolve: null | string
}

export type ContractFunction = 'evolve' | 'getAddressListByNames' | 'getNSByAddress' | 'updateAddressNS'

export interface Input {
  function: ContractFunction
  names?: Name[]
  name?: Name
  address?: Address
  avatar?: string
  value?: string
}

export interface Action {
  input: Input
  caller: string
}

export type ContractResult = { state: State } | { result: any };