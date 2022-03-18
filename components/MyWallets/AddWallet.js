import { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { getWalletFromAddress } from '../../functions/blockfrost'
import CONSTANTS from '../../constants'

const AddWallet = ({ wallets = [], dispatch }) => {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)

    const str = String(input)

    if (str.indexOf('addr1') !== 0) {
      toast.error('This address is invalid')
    } else {
      if (wallets.find((item) => item.walletAddress === str)) {
        toast.error('This address is already added')
        return
      }

      try {
        const res = await getWalletFromAddress(str)
        const { address, amount, stake_address } = res.data

        const payload = {
          walletAddress: address,
          stakeAddress: stake_address,
          assets: amount
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

  return (
    <form className='add-wallet-form' onSubmit={handleSubmit}>
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

      <Toaster />
    </form>
  )
}

export default AddWallet
