import '../styles/res.css'
import '../styles/global.css'
import '../styles/prism.css'
import { AppProps } from 'next/app'
import GoogleTagManager from 'components/GoogleTagManager'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <GoogleTagManager />
      <Component {...pageProps} />
    </>
  )
}
