import { Fragment, useState } from 'react'
import { useWallets } from '../../../contexts/WalletsContext'
import Loading from '../../Loading'
import SendIcon from '../../../icons/SendIcon'
import SyncIcon from '../../../icons/SyncIcon'
import TrashIcon from '../../../icons/TrashIcon'
import DownloadIcon from '../../../icons/DownloadIcon'
import styles from './MyWallets.module.css'
import writeXlsxFile from 'write-excel-file'

const MyWallets = () => {
  const { wallets, addWallet, deleteWallet, syncWallets, getCategoriesAndTraitsCount } = useWallets()

  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

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

  const handleClickDownload = async () => {
    setLoading(true)

    const data = [
      [
        {
          value: 'Category',
          fontWeight: 'bold',
        },
        {
          value: 'Trait',
          fontWeight: 'bold',
        },
        {
          value: 'Count',
          fontWeight: 'bold',
        },
      ],
    ]

    Object.entries(getCategoriesAndTraitsCount()).forEach(([_c, traits]) => {
      const sorted = traits.sort((a, b) => b.count - a.count)

      sorted.forEach(({ label, count }) => {
        data.push([
          // "Category"
          {
            type: String,
            value: _c,
          },
          // "Trait"
          {
            type: String,
            value: label,
          },
          // "Count"
          {
            type: Number,
            value: count,
          },
        ])
      })
    })

    await writeXlsxFile(data, {
      fileName: `FrogFactory_traits_${new Date().getTime()}.xlsx`,
      columns: [{ width: 30 }, { width: 30 }, { width: 10 }],
    })

    setLoading(false)
  }

  return (
    <Fragment>
      <div className={styles.container}>
        {/* Download Spreadsheet */}
        {wallets.length ? (
          <button className={styles.syncBtn} onClick={handleClickDownload} disabled={loading}>
            <DownloadIcon fill='var(--bright)' size='30' />
          </button>
        ) : null}

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

        <Loading open={loading} />
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
