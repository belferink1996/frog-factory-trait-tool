import { Fragment } from 'react'
import { fromHex } from '../../functions/hex'
import blockfrostJsonFile from '../../data/blockfrost'
import CONSTANTS from '../../constants'

const TraitsAndAssets = ({ wallets = [] }) => {
  const missingFromBlockfrost = []
  const categories = {}

  CONSTANTS.TRAIT_CATEGORIES.forEach((cat) => {
    categories[cat] = []
  })

  wallets
    .map(({ assets }) =>
      assets.map((assetId) => {
        const foundBlockfrost = blockfrostJsonFile.assets.find(
          ({ asset }) => asset === assetId
        )

        if (!foundBlockfrost) return assetId

        const { onchain_metadata } = foundBlockfrost
        const attributesPayload = {}

        CONSTANTS.TRAIT_CATEGORIES.forEach((cat) => {
          attributesPayload[cat] = 'none'
        })

        onchain_metadata.Attributes.forEach((str) => {
          const [_c, _v] = str.split(': ')
          if (_c && _v) attributesPayload[_c.toUpperCase()] = _v.toLowerCase()
        })

        return {
          ...foundBlockfrost,
          onchain_metadata: {
            ...foundBlockfrost.onchain_metadata,
            Attributes: attributesPayload,
          },
        }
      })
    )
    .flat()
    .forEach((item, idx, arr) => {
      if (typeof item === 'string') {
        missingFromBlockfrost.push(item)
        return
      }

      const allAssets = arr.length

      const {
        onchain_metadata: { Attributes },
      } = item

      Object.entries(Attributes).forEach(([category, label]) => {
        const foundIndex = categories[category].findIndex(
          (obj) => obj.label === label
        )

        if (foundIndex === -1) {
          categories[category].push({
            label,
            count: 1,
            percent: 1 / (allAssets / 100),
          })
        } else {
          const payload = categories[category][foundIndex]
          payload.count += 1
          payload.percent = payload.count / (allAssets / 100)
          categories[category][foundIndex] = payload
        }
      })
    })

  return (
    <Fragment>
      <div className='traits-categories'>
        {missingFromBlockfrost.length ? (
          <div className='category'>
            <h3 className='category-title'>NO DATA</h3>
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

        {Object.entries(categories).map(([category, values]) => (
          <div key={`trait-category-${category}`} className='category'>
            <h3 className='category-title'>{category}</h3>
            {values.length ? (
              values
                .sort((a, b) => b.count - a.count)
                .map(({ label, count }) => (
                  <p
                    key={`trait-category-${category}-value-${label}`}
                    className='category-item'
                  >
                    x{count} {label}
                  </p>
                ))
            ) : (
              <p className='category-item'>no attributes</p>
            )}
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
