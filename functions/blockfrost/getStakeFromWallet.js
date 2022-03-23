import axios from 'axios'
import CONSTANTS from '../../constants'

const getStakeFromWallet = (address) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await axios.get(
        `${CONSTANTS.BLOCKFROST_API}/addresses/${address}`,
        {
          headers: {
            project_id: CONSTANTS.BLOCKFROST_KEY,
          },
        }
      )

      return resolve(res.data.stake_address)
    } catch (error) {
      return reject(error)
    }
    return
  })
}

export default getStakeFromWallet
