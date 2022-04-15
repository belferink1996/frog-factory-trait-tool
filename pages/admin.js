import Head from 'next/head'
import { useEffect, useState } from 'react'
import blockfrostJsonFile from '../data/blockfrost'
import getAddressOfAsset from '../functions/blockfrost/getAddressOfAsset'
import CONSTANTS from '../constants'
import Loading from '../components/Loading'
import Table from '../components/Table'

const allTraits = {}

CONSTANTS.TRAIT_CATEGORIES.forEach((str) => {
  allTraits[str] = []
})

blockfrostJsonFile.assets.forEach((item) => {
  Object.entries(item.onchain_metadata.Attributes).forEach(([key, val]) => {
    const foundTraitIndex = allTraits[key].findIndex((str) => str === val)

    if (foundTraitIndex === -1) {
      allTraits[key].push(val)
    }
  })
})

export default function Admin() {
  const [pass, setPass] = useState('')
  const [selectedTrait, setSelectedTrait] = useState('none')
  const [loading, setLoading] = useState(false)
  const [allRewardAddresses, setAllRewardAddresses] = useState([])

  useEffect(() => {
    if (selectedTrait !== 'none') {
      ;(async () => {
        const GD = 'golden dart'
        const addresses = []
        setLoading(true)

        // get all assets from Blockfrost with the selected trait
        const assetsWithSelectedTrait = blockfrostJsonFile.assets.filter((item) => {
          let thisAssetIsValid = false

          Object.values(item.onchain_metadata.Attributes).forEach((val) => {
            if (val === selectedTrait) {
              thisAssetIsValid = true
            }
          })

          return thisAssetIsValid
        })

        // get all addresses containing the selected trait
        for (let i = 0; i < assetsWithSelectedTrait.length; i++) {
          try {
            const { address } = await getAddressOfAsset(assetsWithSelectedTrait[i].asset)
            const foundIdx = addresses.findIndex((item) => item.address === address)

            if (foundIdx === -1) {
              addresses.push({
                address,
                traitCount: 1,
                goldenDartCount: 0,
              })
            } else {
              addresses[foundIdx].traitCount += 1
            }
          } catch (error) {
            console.error(error)
          }
        }

        // get all assets containg a golden dart
        const assetsWithGoldenDart = blockfrostJsonFile.assets.filter((item) => {
          let thisAssetIsValid = false

          Object.values(item.onchain_metadata.Attributes).forEach((val) => {
            if (val === GD) {
              thisAssetIsValid = true
            }
          })

          return thisAssetIsValid
        })

        // get all addresses containing the golden dart
        for (let i = 0; i < assetsWithGoldenDart.length; i++) {
          try {
            const { address } = await getAddressOfAsset(assetsWithGoldenDart[i].asset)
            const foundIdx = addresses.findIndex((item) => item.address === address)

            if (foundIdx === -1) {
              addresses.push({
                address,
                traitCount: 0,
                goldenDartCount: 1,
              })
            } else {
              addresses[foundIdx].goldenDartCount += 1
            }
          } catch (error) {
            console.error(error)
          }
        }

        setAllRewardAddresses(addresses)
        setLoading(false)
      })()
    }
  }, [selectedTrait])

  const inpStyles = {
    margin: '1rem auto',
    padding: '1rem 1.5rem',
    backgroundColor: 'whitesmoke',
    borderRadius: '1rem',
    border: '1px solid black',
  }

  if (!pass || pass !== process.env.NEXT_PUBLIC_ADMIN_PASS) {
    return (
      <div className='home'>
        <Head>
          <title>FF-TT | Restricted</title>
          <link rel='icon' href='/favicon.ico' />
        </Head>

        <br />
        <h1>Frog Factory - Restricted Area</h1>
        <br />

        <input placeholder='Administrator Password' type='password' value={pass} onChange={(e) => setPass(e.target.value)} style={inpStyles} />
      </div>
    )
  }

  return (
    <div className='home'>
      <Head>
        <title>FF-TT | Admin</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <br />
      <h1>Frog Factory - Admin Panel</h1>
      <br />

      <select value={selectedTrait} onChange={(e) => setSelectedTrait(e.target.value)} style={inpStyles}>
        <option value='none'>none</option>
        {Object.entries(allTraits).map(([key, arr]) =>
          arr.map((val) => (
            <option key={`${key} - ${val}`} value={val}>
              {key} - {val}
            </option>
          ))
        )}
      </select>

      <Loading open={loading} />

      <Table
        titles={['Wallet Address', 'Traits', 'GDs']}
        items={allRewardAddresses.map((obj) => ({
          'Wallet Address': obj.address,
          Traits: obj.traitCount,
          'GDs': obj.goldenDartCount,
        }))}
      />
    </div>
  )
}
