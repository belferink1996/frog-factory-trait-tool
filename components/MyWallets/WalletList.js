import CONSTANTS from '../../constants'

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
          <div key={`wallet-${stakeAddress}`} className='wallet-list-item'>
            <p>{stakeAddress}</p>
            <button onClick={() => clickDelete(stakeAddress)}>🗑️</button>
          </div>
        ))
      ) : (
        <div>•••</div>
      )}
    </div>
  )
}

export default WalletList
