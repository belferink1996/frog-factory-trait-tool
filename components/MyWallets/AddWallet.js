import { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { getWalletFromAddress } from '../../functions/blockfrost'
import CONSTANTS from '../../constants'
import { Fragment } from 'react/cjs/react.production.min'

const AddWallet = ({ wallets = [], dispatch }) => {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState('')

  const addWallet = async (event) => {
    event.preventDefault()
    setLoading(true)

    const str = String(input)

    if (str.indexOf('addr1') !== 0) {
      toast.error('This address is invalid')
    } else {
      if (wallets.find(({ walletAddress }) => walletAddress === str)) {
        toast.error('This address is already added')
        return
      }

      try {
        const res = await getWalletFromAddress(str)
        const payload = {
          walletAddress: res.data.address,
          stakeAddress: res.data.stake_address,
          assets: res.data.amount
            .filter((item) => item.unit.indexOf(CONSTANTS.POLICY_ID) === 0)
            .map((item) => item.unit),
        }

        dispatch({ type: CONSTANTS.ADD_WALLET, payload })
        setInput('')

        toast.success('Succesfully got data from the Blockchain')
      } catch (error) {
        if (error?.response?.status == 400) {
          toast.error('This address does not exist')
        } else if (error?.response?.status == 403) {
          toast.error('Blockfrost API key is maxed out today...')
        } else {
          toast.error('Failed to get data from the Blockchain')
          console.error(error)
        }
      }
    }

    setLoading(false)
  }

  const syncWallets = async () => {
    setLoading(true)
    const syncedWallets = []

    for (let i = 0; i < wallets.length; i++) {
      const { walletAddress } = wallets[i]

      try {
        const res = await getWalletFromAddress(walletAddress)
        const payload = {
          walletAddress: res.data.address,
          stakeAddress: res.data.stake_address,
          assets: res.data.amount
            .filter((item) => item.unit.indexOf(CONSTANTS.POLICY_ID) === 0)
            .map((item) => item.unit),
        }

        syncedWallets.push(payload)
      } catch (error) {
        if (error?.response?.status == 403) {
          toast.error('Blockfrost API key is maxed out today...')
        } else {
          toast.error('Failed to get data from the Blockchain')
          console.error(error)
        }
      }
    }

    dispatch({ type: CONSTANTS.SET_WALLETS, payload: syncedWallets })
    setLoading(false)

    toast.success('Succesfully synced wallets with the Blockchain')
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <Fragment>
      <div className='flex-center-stretch'>
        <button className='sync-btn' onClick={syncWallets} disabled={loading}>
          🔄
        </button>

        <form className='add-wallet-form' onSubmit={addWallet}>
          <input
            placeholder='Your address (addr1)'
            type='text'
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type='submit'
            disabled={loading}
            className={input.length ? '' : 'hide'}
          >
            ✅
          </button>
        </form>
      </div>
      <Toaster />
    </Fragment>
  )
}

export default AddWallet
