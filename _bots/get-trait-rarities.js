const fs = require('fs')
const blockfrostJsonFile = require('../data/blockfrost')

const run = async () => {
  const traits = {}
  const populatedAssets = blockfrostJsonFile?.assets ?? []
  const numOfAssets = populatedAssets.length

  try {
    for (let idx = 0; idx < populatedAssets.length; idx++) {
      populatedAssets[idx].onchain_metadata.Attributes.forEach((str) => {
        const [key, value] = str.split(': ')
        
        if (value) {
          const payload = {
            label: value,
            count: 1,
            percent: 1 / (numOfAssets / 100),
          }
          const traitKey = traits[key]
          const traitData = traitKey?.find((obj) => obj.label === value)

          if (!traitKey) {
            traits[key] = [payload]
          } else if (traitData) {
            traitData.count += 1
            traitData.percent = traitData.count / (numOfAssets / 100)
            traitKey[traitKey.findIndex((obj) => obj.label === value)] =
              traitData
          } else {
            traitKey.push(payload)
          }
        }
      })
    }

    Object.entries(traits).forEach(([key, val]) => {
      traits[key] = val.sort((a, b) => a.count - b.count)
    })

    fs.writeFileSync('./data/traits.json', JSON.stringify(traits), 'utf8')

    console.log('done!')
  } catch (error) {
    console.error(error)
  }
}

run()
