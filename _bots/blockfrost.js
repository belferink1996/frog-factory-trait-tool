require('dotenv').config()
const fs = require('fs')
const axios = require('axios')
const CONSTANTS = require('../constants')
const blockfrostJsonFile = require('../data/blockfrost')

const POLICY_ID = CONSTANTS.POLICY_ID
const BLOCKFROST_API = CONSTANTS.BLOCKFROST_API
const BLOCKFROST_KEY = CONSTANTS.BLOCKFROST_KEY

const run = async () => {
  const policyAssets = []
  const populatedAssets = blockfrostJsonFile?.assets ?? []

  try {
    console.log('getting all assets from blockfrost')
    for (let page = 1; true; page++) {
      console.log(`querying page number ${page}`)

      const { data: policyAssetsPagination } = await axios.get(
        `${BLOCKFROST_API}/assets/policy/${POLICY_ID}?page=${page}`,
        {
          headers: {
            project_id: BLOCKFROST_KEY,
          },
        }
      )

      if (!policyAssetsPagination.length) break
      policyAssetsPagination.forEach((item) => policyAssets.push(item))
    }

    console.log(`got a total of ${policyAssets.length} assets from blockfrost`)
    console.log('populating new assets from blockfrost')

    for (let idx = 0; idx < policyAssets.length; idx++) {
      const { asset } = policyAssets[idx]

      if (asset !== POLICY_ID) {
        if (!populatedAssets.find((item) => item.asset === asset)) {
          console.log(`idx: ${idx}, populating new asset ${asset}`)

          const { data: populatedAsset } = await axios.get(
            `${BLOCKFROST_API}/assets/${asset}`,
            {
              headers: {
                project_id: BLOCKFROST_KEY,
              },
            }
          )

          populatedAssets.push(populatedAsset)
        }
      }
    }

    console.log('sorting assets by #ID')
    populatedAssets.sort((a, b) => {
      return (
        Number(a.onchain_metadata.name.replace('Frog Factory #', '')) -
        Number(b.onchain_metadata.name.replace('Frog Factory #', ''))
      )
    })

    console.log(`saving ${populatedAssets.length} assets to JSON file`)
    fs.writeFileSync(
      './data/blockfrost.json',
      JSON.stringify({
        _wen: Date.now(),
        policyId: POLICY_ID,
        count: populatedAssets.length,
        assets: populatedAssets,
      }),
      'utf8'
    )

    console.log('done!')
  } catch (error) {
    console.error(error)
  }
}

run()
