import { useState } from 'react'
import toast from 'react-hot-toast'
import {
  getStakeFromWallet,
  getAssetsFromStake,
} from '../../functions/blockfrost'
import CONSTANTS from '../../constants'
import SendIcon from '../../icons/SendIcon'
import SyncIcon from '../../icons/SyncIcon'

const AddWallet = ({ wallets = [], dispatch }) => {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState('')

  const addWallet = async () => {
    const walletAddress = String(input)

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
      setInput('')
      toast.success('Succesfully got data from the Blockchain')
    } catch (error) {
      console.error(error)
      toast.error(
        `Failed to get data from the Blockchain ${error?.response?.status}`
      )
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
          toast.error(
            `Failed to get data from the Blockchain ${error?.response?.status}`
          )

          return item
        }
      })
    )

    dispatch({ type: CONSTANTS.SET_WALLETS, payload: syncedWallets })
    toast.success('Succesfully synced wallets with the Blockchain')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    await addWallet()
    setLoading(false)
  }

  const handleClickSync = async () => {
    setLoading(true)
    await syncWallets()
    setLoading(false)
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className='flex-center-stretch'>
      <form className='add-wallet-form' onSubmit={handleSubmit}>
        <input
          placeholder='Your wallet address (addr1)'
          type='text'
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type='submit'
          disabled={loading}
          className={input.length ? '' : 'hide'}
        >
          <SendIcon fill='var(--bright)' size='20' />
        </button>
      </form>

      <button className='sync-btn' onClick={handleClickSync} disabled={loading}>
        <SyncIcon fill='var(--bright)' size='30' />
      </button>
    </div>
  )
}

export default AddWallet
