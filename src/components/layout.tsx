import Head from 'next/head'
import Link from 'next/link'
import AppHeader from './AppHeader'
import Container from './Container'
import styles from './Layout.module.scss'

export default function Layout({
  children,
  home,
}: {
  children: React.ReactNode
  home?: boolean
}) {
  return (
    <>
      <Head>
        <link rel="icon" href="/images/logo.svg" type="image/svg+xml" />
        <meta name="description" content="Ryuta Udo's personal blog" />
        <meta
          property="og:image"
          content={'https://blog.ryutau.dev/images/logo.png'}
        />
        <meta name="og:title" content="ryutaudo/blog" />
        <meta name="twitter:card" content="summary" />
      </Head>
      <AppHeader />
      <main className={styles.main}>
        <Container>{children}</Container>
      </main>
      {!home && (
        <Container>
          <div className={styles.backToHome}>
            <Link href="/">
              <a>← Back to home</a>
            </Link>
          </div>
        </Container>
      )}
    </>
  )
}
