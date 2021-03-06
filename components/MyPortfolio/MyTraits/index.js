import { Fragment, useState } from 'react'
import { useWallets } from '../../../contexts/WalletsContext'
import Modal from '../../Modal'
import AssetCard from '../../AssetCard'
import styles from './MyTraits.module.css'

const MyTraits = () => {
  const { wallets, dataFrogs, noDataFrogs, getCategoriesAndTraitsCount } = useWallets()
  const [selectedTrait, setSelectedTrait] = useState({ category: '', label: '' })

  const clickTrait = (_c, _l) => {
    setSelectedTrait({ category: _c, label: _l })
  }

  return (
    <Fragment>
      <div className={styles.categories}>
        {wallets.length
          ? Object.entries(getCategoriesAndTraitsCount()).map(([_c, traits]) => (
              <div key={`trait-category-${_c}`} className={styles.category}>
                <div className={styles.header}>
                  <h3>{_c}</h3>
                  <span>{traits.length}</span>
                </div>

                {traits.length ? (
                  <Fragment>
                    {traits
                      .sort((a, b) => b.count - a.count)
                      .map(({ label, count }) => (
                        <p key={`trait-category-${_c}-value-${label}`} className={styles.trait} onClick={() => clickTrait(_c, label)}>
                          x{count} {label}
                        </p>
                      ))}
                  </Fragment>
                ) : null}

                {traits.length ? <br /> : null}
              </div>
            ))
          : null}
      </div>

      <div className={styles.categories}>
        {noDataFrogs.length ? (
          <div className={styles.category}>
            <h3 className={styles.title}>NO DATA</h3>
            <p className={styles.trait}>x{noDataFrogs.length} Frogs not included</p>

            {noDataFrogs.map((str) => (
              <p key={`no-data-asset-${str}`} className={styles.trait}>
                {str}
              </p>
            ))}

            <br />
            <p style={{ margin: '0 1rem' }}>
              If you recently minted, please wait for the developer to sync all assets with the blockchain.
              <br />
              If this took more than a day or two please DM &quot;
              <strong>Ben | ???D???#0001</strong>&quot; on Discord.
            </p>
            <br />
          </div>
        ) : null}
      </div>

      <Modal
        title={`${selectedTrait.category}: ${selectedTrait.label}`}
        open={Boolean(selectedTrait.category && selectedTrait.label)}
        onClose={() => clickTrait('', '')}
      >
        <div style={{ display: 'flex', flexFlow: 'row wrap', alignItems: 'center', justifyContent: 'center' }}>
          {dataFrogs.map((frog) =>
            frog.onchain_metadata.Attributes[selectedTrait.category] === selectedTrait.label ? (
              <AssetCard
                key={`frog-${frog.asset}`}
                name={frog.onchain_metadata.name}
                imageSrc={frog.onchain_metadata.image}
                itemUrl={`https://pool.pm/${frog.fingerprint}`}
                spanArray={Object.entries(frog.onchain_metadata.Attributes).map(([_c, _l]) => `${_c}: ${_l}`)}
              />
            ) : null
          )}
        </div>
      </Modal>
    </Fragment>
  )
}

export default MyTraits
