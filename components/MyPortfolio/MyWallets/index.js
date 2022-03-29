import { Fragment, useState } from 'react'
import { useWallets } from '../../../contexts/WalletsContext'
import Loading from '../../Loading'
import SendIcon from '../../../icons/SendIcon'
import SyncIcon from '../../../icons/SyncIcon'
import TrashIcon from '../../../icons/TrashIcon'
import styles from './MyWallets.module.css'

const MyWallets = () => {
  const { wallets, addWallet, deleteWallet, syncWallets } = useWallets()

  const [input, setInput] = useState('')
  const [loading, setLoading] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!loading) {
      setLoading(true)
      await addWallet(input)
      setLoading(false)
      setInput('')
    }
  }

  const handleClickSync = async () => {
    setLoading(true)
    await syncWallets()
    setLoading(false)
  }

  return (
    <Fragment>
      <div className={styles.container}>
        {/* Add wallet */}
        <form className={styles.form} onSubmit={handleSubmit}>
          <input placeholder='Your wallet address (addr1)' type='text' value={input} onChange={(e) => setInput(e.target.value)} />
          <button type='submit' disabled={loading} className={input.length ? '' : styles.hide}>
            <SendIcon fill='var(--bright)' size='20' />
          </button>
        </form>

        {/* Sync wallets */}
        {wallets.length ? (
          <button className={styles.syncBtn} onClick={handleClickSync} disabled={loading}>
            <SyncIcon fill='var(--bright)' size='30' />
          </button>
        ) : null}

        {loading ? <Loading /> : null}
      </div>

      <br />

      {/* Wallet list */}
      <div>
        {wallets.length ? (
          wallets.map(({ stakeAddress }) => (
            // Wallet list item
            <div key={`wallet-${stakeAddress}`} className={styles.item}>
              <p>{stakeAddress}</p>
              {/* Delete Wallet */}
              <button onClick={() => deleteWallet(stakeAddress)}>
                <TrashIcon fill='#750000' size='18' />
              </button>
            </div>
          ))
        ) : (
          <div>•••</div>
        )}
      </div>
    </Fragment>
  )
}

export default MyWallets
