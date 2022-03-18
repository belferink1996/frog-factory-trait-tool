import CONSTANTS from '../../constants'

const WalletList = ({ wallets = [], dispatch }) => {
  const clickDelete = (walletAddress) => {
    if (window.confirm('Are you sure you want to remove this address?')) {
      dispatch({ type: CONSTANTS.DELETE_WALLET, payload: walletAddress })
    }
  }

  return (
    <div>
      {wallets.length ? (
        wallets.map(({ walletAddress }) => (
          <div key={`wallet-${walletAddress}`} className='wallet-list-item'>
            <p>{walletAddress}</p>
            <button onClick={() => clickDelete(walletAddress)}>🗑️</button>
          </div>
        ))
      ) : (
        <div>•••</div>
      )}
    </div>
  )
}

export default WalletList
