import CONSTANTS from '../constants'

const WalletsReducer = (state = [], action) => {
  switch (action.type) {
    case CONSTANTS.SET_WALLETS:
      return action.payload

    case CONSTANTS.ADD_WALLET:
      return [action.payload, ...state]

    case CONSTANTS.DELETE_WALLET:
      const copyState = [...state]
      return copyState.filter((item) => item.stakeAddress !== action.payload)

    default:
      return state
  }
}

export default WalletsReducer
