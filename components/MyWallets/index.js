import { Fragment, useReducer, useEffect } from 'react'
import WalletsReducer from '../../reducers/WalletsReducer'
import AddWallet from './AddWallet'
import WalletList from './WalletList'
import CONSTANTS from '../../constants'

const MyWallets = ({ setParentState }) => {
  const [wallets, dispatch] = useReducer(WalletsReducer, [])

  useEffect(() => {
    // once window is loaded, get wallets from local storage,
    // and if an array is found set it to the state
    if (window) {
      const stored = JSON.parse(
        window.localStorage.getItem(CONSTANTS.FROG_FACTORY_WALLETS_STORAGE_KEY)
      )

      if (stored && Array.isArray(stored)) {
        dispatch({
          type: CONSTANTS.SET_WALLETS,
          payload: stored,
        })
      }
    }
  }, [window])

  useEffect(() => {
    // once the wallets change, set them to local storage
    if (window) {
      window.localStorage.setItem(
        CONSTANTS.FROG_FACTORY_WALLETS_STORAGE_KEY,
        JSON.stringify(wallets)
      )
    }
    // also update parent state, to render assets and traits
    if (setParentState) setParentState(wallets)
  }, [window, wallets])

  return (
    <Fragment>
      <AddWallet wallets={wallets} dispatch={dispatch} />
      <br />
      <WalletList wallets={wallets} dispatch={dispatch} />
    </Fragment>
  )
}

export default MyWallets
