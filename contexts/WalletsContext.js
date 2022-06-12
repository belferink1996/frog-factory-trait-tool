import { createContext, useContext, useEffect, useReducer, useState } from 'react'
import toast from 'react-hot-toast'
import blockfrostJsonFile from '../data/blockfrost'
import { getAssetsFromStake, getStakeFromWallet } from '../functions/blockfrost'
import { fromHex } from '../functions/hex'
import CONSTANTS from '../constants'

// init context
export const WalletsContext = createContext()

// export the consumer
export function useWallets() {
  return useContext(WalletsContext)
}

const walletsReducer = (state = [], action) => {
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

// export the provider (handle all the logic here)
export function WalletsProvider({ children }) {
  const [wallets, dispatch] = useReducer(walletsReducer, [])
  const [dataFrogs, setDataFrogs] = useState([])
  const [noDataFrogs, setNoDataFrogs] = useState([])

  useEffect(() => {
    // once window is loaded, get wallets from local storage,
    // and if an array is found set it to the state
    if (window) {
      const stored = JSON.parse(window.localStorage.getItem(CONSTANTS.FROG_FACTORY_WALLETS_STORAGE_KEY))

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
      window.localStorage.setItem(CONSTANTS.FROG_FACTORY_WALLETS_STORAGE_KEY, JSON.stringify(wallets))
    }
  }, [window, wallets])

  useEffect(() => {
    setDataFrogs([])
    setNoDataFrogs([])

    wallets.forEach((wallet) => {
      wallet.assets.forEach((assetId, idx, arr) => {
        const blockfrostAsset = blockfrostJsonFile.assets.find(({ asset }) => asset === assetId)

        if (!blockfrostAsset) {
          setNoDataFrogs((prev) => [...prev, fromHex(assetId.replace(CONSTANTS.POLICY_ID, ''))])
          return
        }

        setDataFrogs((prev) => [...prev, blockfrostAsset])
      })
    })
  }, [wallets])

  const addWallet = async (str) => {
    const walletAddress = String(str)

    if (walletAddress.indexOf('addr1') !== 0) {
      toast.error('Address is invalid')
      return
    }

    let stakeAddress = ''

    try {
      stakeAddress = await getStakeFromWallet(walletAddress)
    } catch (error) {
      if (error?.response?.status == 400) {
        toast.error('Wallet address not found')
      } else if (error?.response?.status == 403) {
        toast.error('Blockfrost API key is maxed out today')
      } else {
        toast.error('Failed to get data from the Blockchain')
        console.error(error)
      }
    }

    if (!stakeAddress) {
      toast.error('Stake address not found')
      return
    }

    try {
      if (wallets.find((item) => item.stakeAddress === stakeAddress)) {
        toast.info('This stake address is already added')
        return
      }

      const assets = await getAssetsFromStake(stakeAddress)
      const payload = {
        stakeAddress,
        assets,
      }

      dispatch({ type: CONSTANTS.ADD_WALLET, payload })
      toast.success('Succesfully got data from the Blockchain')
    } catch (error) {
      console.error(error)
      toast.error(`Failed to get data from the Blockchain ${error?.response?.status}`)
    }
  }

  const deleteWallet = (stakeAddress) => {
    if (window.confirm('Are you sure you want to delete this wallet?')) {
      dispatch({ type: CONSTANTS.DELETE_WALLET, payload: stakeAddress })
    }
  }

  const syncWallets = async () => {
    const syncedWallets = await Promise.all(
      wallets.map(async (item) => {
        try {
          const assets = await getAssetsFromStake(item.stakeAddress)
          const payload = {
            stakeAddress: item.stakeAddress,
            assets,
          }

          return payload
        } catch (error) {
          console.error(error)
          toast.error(`Failed to get data from the Blockchain ${error?.response?.status}`)

          return item
        }
      })
    )

    dispatch({ type: CONSTANTS.SET_WALLETS, payload: syncedWallets })
    toast.success('Succesfully synced wallets with the Blockchain')
  }

  const getCategoriesAndTraitsCount = () => {
    let payload = {}

    CONSTANTS.TRAIT_CATEGORIES.forEach((cat) => {
      payload[cat] = []
    })

    dataFrogs.forEach((blockfrostAsset) => {
      Object.entries(blockfrostAsset.onchain_metadata.Attributes).forEach(([_c, _l]) => {
        const newState = { ...payload }
        const foundTraitIndex = newState[_c].findIndex((_t) => _t.label === _l)

        if (foundTraitIndex === -1) {
          const _t = {
            label: _l,
            count: 1,
          }

          newState[_c].push(_t)
        } else {
          const _t = { ...newState[_c][foundTraitIndex] }
          _t.count += 1

          newState[_c][foundTraitIndex] = _t
        }

        payload = newState
      })
    })

    return payload
  }

  return (
    <WalletsContext.Provider
      value={{
        wallets,
        dataFrogs,
        noDataFrogs,
        addWallet,
        deleteWallet,
        syncWallets,
        getCategoriesAndTraitsCount,
      }}
    >
      {children}
    </WalletsContext.Provider>
  )
}
