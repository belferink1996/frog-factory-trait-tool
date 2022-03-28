import TrashIcon from '../../icons/TrashIcon'
import CONSTANTS from '../../constants'
import styles from './WalletList.module.css'

const WalletList = ({ wallets = [], dispatch }) => {
  const clickDelete = (stakeAddress) => {
    if (window.confirm('Are you sure you want to remove this stake address?')) {
      dispatch({ type: CONSTANTS.DELETE_WALLET, payload: stakeAddress })
    }
  }

  return (
    <div>
      {wallets.length ? (
        wallets.map(({ stakeAddress }) => (
          <div key={`wallet-${stakeAddress}`} className={styles.item}>
            <p>{stakeAddress}</p>
            <button onClick={() => clickDelete(stakeAddress)}>
              <TrashIcon fill='#750000' size='18' />
            </button>
          </div>
        ))
      ) : (
        <div>•••</div>
      )}
    </div>
  )
}

export default WalletList
