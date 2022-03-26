import '../styles/res.scss'
import '../styles/global.scss'
import '../styles/prism.scss'
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
