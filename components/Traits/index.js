import { Fragment, useEffect, useState } from 'react'
import { fromHex } from '../../functions/hex'
import blockfrostJsonFile from '../../data/blockfrost'
import CaretDown from '../../icons/CaretDown'
import CaretUp from '../../icons/CaretUp'
import CONSTANTS from '../../constants'
import styles from './Traits.module.css'

const mapWalletAttributes = (wallet) =>
  wallet.assets.map((assetId) => {
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
      const [_c, _l] = str.split(': ')
      if (_c && _l) attributesPayload[_c.toUpperCase()] = _l.toLowerCase()
    })

    return {
      ...foundBlockfrost,
      onchain_metadata: {
        ...onchain_metadata,
        Attributes: attributesPayload,
      },
    }
  })

const Traits = ({ wallets = [] }) => {
  const [missingFromBlockfrost, setMissingFromBlockfrost] = useState([])
  const [categories, setCategories] = useState(() => {
    const initialState = {}

    CONSTANTS.TRAIT_CATEGORIES.forEach((cat) => {
      initialState[cat] = { openUiComponent: false, traits: [] }
    })

    return initialState
  })

  useEffect(() => {
    wallets
      .map(mapWalletAttributes)
      .flat()
      .forEach((item, idx, arr) => {
        if (typeof item === 'string') {
          setMissingFromBlockfrost((prev) => [...prev, item])
          return
        }

        const allAssets = arr.length

        Object.entries(item.onchain_metadata.Attributes).forEach(([_c, _l]) => {
          const newState = { ...categories }
          const foundTraitIndex = newState[_c].traits.findIndex(
            (_t) => _t.label === _l
          )

          if (foundTraitIndex === -1) {
            const _t = {
              label: _l,
              count: 1,
              percent: 1 / (allAssets / 100),
            }

            newState[_c].traits.push(_t)
          } else {
            const _t = { ...newState[_c].traits[foundTraitIndex] }
            _t.count += 1
            _t.percent = _t.count / (allAssets / 100)

            newState[_c].traits[foundTraitIndex] = _t
          }

          setCategories(newState)
        })
      })
  }, [wallets])

  const toggleCategoryComponent = (_c) => {
    setCategories((prev) => ({
      ...prev,
      [_c]: {
        ...prev[_c],
        openUiComponent: !prev[_c].openUiComponent,
      },
    }))
  }

  return (
    <Fragment>
      <div className={styles.categories}>
        {wallets.length
          ? Object.entries(categories).map(
              ([_c, { openUiComponent, traits }]) => (
                <div key={`trait-category-${_c}`} className={styles.category}>
                  <div
                    className={styles.header}
                    onClick={() => toggleCategoryComponent(_c)}
                  >
                    <h3>{_c}</h3>
                    <span>{traits.length}</span>
                  </div>

                  {openUiComponent && traits.length ? (
                    <Fragment>
                      {traits
                        .sort((a, b) => b.count - a.count)
                        .map(({ label, count }) => (
                          <p
                            key={`trait-category-${_c}-value-${label}`}
                            className={styles.trait}
                          >
                            x{count} {label}
                          </p>
                        ))}
                    </Fragment>
                  ) : null}

                  <div
                    className={styles.caret}
                    onClick={() => toggleCategoryComponent(_c)}
                  >
                    {openUiComponent ? (
                      <CaretUp size={18} />
                    ) : (
                      <CaretDown size={18} />
                    )}
                  </div>
                </div>
              )
            )
          : null}
      </div>

      <div className={styles.categories}>
        {missingFromBlockfrost.length ? (
          <div className={styles.category}>
            <h3 className={styles.title}>NO DATA</h3>
            <p className={styles.trait}>
              x{missingFromBlockfrost.length} Frogs not included
            </p>

            {missingFromBlockfrost.map((str) => (
              <p key={`no-data-asset-${str}`} className={styles.trait}>
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
      </div>
    </Fragment>
  )
}

export default Traits
