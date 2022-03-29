import Head from 'next/head'
import dynamic from 'next/dynamic'
const MyPortfolio = dynamic(() => import('../components/MyPortfolio'), {
  ssr: false,
})

export default function Home() {
  return (
    <div className='app'>
      <Head>
        <title>FF-TT</title>
        <meta name='description' content='Frog Factory community tool designed to track asset traits' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <br />
      <h1>Frog Factory - Trait Tool</h1>
      <br />

      <MyPortfolio />
    </div>
  )
}
