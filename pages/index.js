import Head from 'next/head'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import TraitsAndAssets from '../components/TraitsAndAssets'
const MyWallets = dynamic(() => import('../components/MyWallets'), {
  ssr: false,
})

export default function Home() {
  const [wallets, setWallets] = useState([])

  return (
    <div className='app'>
      <Head>
        <title>FF-TT</title>
        <meta
          name='description'
          content='Frog Factory community tool designed to track asset traits'
        />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <br />
      <h1>Frog Factory - Trait Tool</h1>
      <br />

      <MyWallets setParentState={setWallets} />
      <TraitsAndAssets wallets={wallets} />
    </div>
  )
}
