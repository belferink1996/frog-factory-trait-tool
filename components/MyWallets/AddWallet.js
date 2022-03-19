import { useState } from 'react'
import toast from 'react-hot-toast'
import { getWalletFromAddress } from '../../functions/blockfrost'
import CONSTANTS from '../../constants'

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
        const {
          data: { address, stake_address, amount },
        } = await getWalletFromAddress(str)

        const payload = {
          walletAddress: address,
          stakeAddress: stake_address,
          assets: amount
            .filter(({ unit }) => unit.indexOf(CONSTANTS.POLICY_ID) === 0)
            .map(({ unit }) => unit),
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

    const syncedWallets = await Promise.all(
      wallets.map(async (item) => {
        try {
          const {
            data: { address, stake_address, amount },
          } = await getWalletFromAddress(item.walletAddress)

          const payload = {
            walletAddress: address,
            stakeAddress: stake_address,
            assets: amount
              .filter(({ unit }) => unit.indexOf(CONSTANTS.POLICY_ID) === 0)
              .map(({ unit }) => unit),
          }

          return payload
        } catch (error) {
          if (error?.response?.status == 403) {
            toast.error('Blockfrost API key is maxed out today...')
          } else {
            toast.error('Failed to get data from the Blockchain')
            console.error(error)
          }

          return item
        }
      })
    )

    dispatch({ type: CONSTANTS.SET_WALLETS, payload: syncedWallets })
    setLoading(false)

    toast.success('Succesfully synced wallets with the Blockchain')
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
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
  )
}

export default AddWallet
