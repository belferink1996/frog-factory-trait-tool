import { WalletsProvider } from '../../contexts/WalletsContext'
import MyTraits from './MyTraits'
import MyWallets from './MyWallets'

const MyPortfolio = () => {
  return (
    <WalletsProvider>
      <MyWallets />
      <MyTraits />
    </WalletsProvider>
  )
}

export default MyPortfolio
