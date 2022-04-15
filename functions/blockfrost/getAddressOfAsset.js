import axios from 'axios'
import CONSTANTS from '../../constants'

const getAddressOfAsset = (assetId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await axios.get(
        `${CONSTANTS.BLOCKFROST_API}/assets/${assetId}/addresses`,
        {
          headers: {
            project_id: CONSTANTS.BLOCKFROST_KEY,
          },
        }
      )

      return resolve(res.data[0])
    } catch (error) {
      return reject(error)
    }
    return
  })
}

export default getAddressOfAsset
