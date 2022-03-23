import axios from 'axios'
import CONSTANTS from '../../constants'

const getAssetsFromStake = (stakeAddress) => {
  return new Promise(async (resolve, reject) => {
    let assets = []
    let error = undefined

    for (let page = 1; true; page++) {
      try {
        const { data } = await axios.get(
          `${CONSTANTS.BLOCKFROST_API}/accounts/${stakeAddress}/addresses/assets?page=${page}`,
          {
            headers: {
              project_id: CONSTANTS.BLOCKFROST_KEY,
            },
          }
        )

        if (!data.length) {
          break
        }

        assets = assets.concat(data)
      } catch (e) {
        return reject(error)
      }
    }

    return resolve(
      assets
        .filter(({ unit }) => unit.indexOf(CONSTANTS.POLICY_ID) === 0)
        .map(({ unit }) => unit)
    )
  })
}

export default getAssetsFromStake
