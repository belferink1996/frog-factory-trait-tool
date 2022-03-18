import { Fragment } from 'react'
import { fromHex } from '../../functions/hex'
import blockfrostJsonFile from '../../data/blockfrost'
import CONSTANTS from '../../constants'

const TraitsAndAssets = ({ wallets = [] }) => {
  const allAssets = wallets
    .map(({ assets }) =>
      assets.map(
        (assetId) =>
          blockfrostJsonFile.assets.find(({ asset }) => asset === assetId) ??
          assetId
      )
    )
    .flat()

  const missingFromBlockfrost = []
  const traits = {}

  allAssets.forEach((item) => {
    if (typeof item === 'string') {
      missingFromBlockfrost.push(item)
      return
    }

    item.onchain_metadata.Attributes.forEach((str) => {
      const [category, value] = str.split(': ')

      if (value) {
        const payload = {
          label: value,
          count: 1,
          percent: 1 / (allAssets.length / 100),
        }
        const traitCategory = traits[category]
        const traitData = traitCategory?.find((obj) => obj.label === value)

        if (!traitCategory) {
          traits[category] = [payload]
        } else if (traitData) {
          traitData.count += 1
          traitData.percent = traitData.count / (allAssets.length / 100)
          traitCategory[traitCategory.findIndex((obj) => obj.label === value)] =
            traitData
        } else {
          traitCategory.push(payload)
        }
      }
    })
  })

  return (
    <Fragment>
      <div className='traits-categories'>
        {missingFromBlockfrost.length ? (
          <div className='category'>
            <h3 className='category-title'>No data</h3>
            <p className='category-item'>
              x{missingFromBlockfrost.length} Frogs not included
            </p>

            {missingFromBlockfrost.map((str) => (
              <p key={`no-data-asset-${str}`} className='category-item'>
                {fromHex(str.replace(CONSTANTS.POLICY_ID, ''))}
              </p>
            ))}

            <br />
            <p style={{ margin: '0 1rem' }}>
              If you recently minted, please wait for the developer to sync all
              assets with the blockchain.
              <br />
              If this took more than a day or two please DM &quot;
              <strong>Ben | ₳D₳#0001</strong>&quot; on Discord.
            </p>
            <br />
          </div>
        ) : null}

        {Object.entries(traits).map(([category, values]) => (
          <div key={`trait-category-${category}`} className='category'>
            <h3 className='category-title'>{category}</h3>
            {values
              .sort((a, b) => b.count - a.count)
              .map(({ label, count }) => (
                <p
                  key={`trait-category-${category}-value-${label}`}
                  className='category-item'
                >
                  x{count} {label}
                </p>
              ))}
            <br />
          </div>
        ))}
      </div>

      {/* {allAssets.map((item) => (
        <div key={`asset-${item.asset}`}>{item.onchain_metadata.name}</div>
      ))} */}
    </Fragment>
  )
}

export default TraitsAndAssets
