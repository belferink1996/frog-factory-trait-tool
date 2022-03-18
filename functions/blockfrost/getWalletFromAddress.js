import axios from 'axios'
import CONSTANTS from '../../constants'

const getWalletFromAddress = async (address) => {
  return new Promise((resolve, reject) => {
    return axios
      .get(`${CONSTANTS.BLOCKFROST_API}/addresses/${address}`, {
        headers: {
          project_id: CONSTANTS.BLOCKFROST_KEY,
        },
      })
      .then((res) => resolve(res))
      .catch((error) => reject(error))
  })
}

export default getWalletFromAddress
