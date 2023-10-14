import type { State, Action } from '../types'

export const evolve = (state: State, action: Action) => {
  const { canEvolve } = state
  const { caller, input } = action

    if (input.function === 'evolve' && canEvolve) {
        if (state.owner !== action.caller) {
          throw new ContractError('Only the owner can evolve a contract.');
        }
      
        state.evolve = action.input.value;
      
        return { state };
      }
}