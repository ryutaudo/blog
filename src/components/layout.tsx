import Head from 'next/head'
import Image from 'next/image'
import styles from './layout.module.css'
import Link from 'next/link'

const name = 'ryutaudo / blog'
export const siteTitle = 'ryutaudo/blog'

export default function Layout({
  children,
  home,
}: {
  children: React.ReactNode
  home?: boolean
}) {
  return (
    <div className={styles.container}>
      <Head>
        <link rel="icon" href="/images/logo.svg" type="image/svg+xml" />
        <meta name="description" content="Ryuta Udo's personal blog" />
        <meta
          property="og:image"
          content={'https://blog.ryutau.dev/images/logo.png'}
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary" />
      </Head>
      <header className={styles.header}>
        <Link href="/">
          <a>
            <Image src="/images/logo.svg" width="33" height="36" />
          </a>
        </Link>
        <Link href="/">
          <a className={styles.blogTitle}>{name}</a>
        </Link>
      </header>
      <main>{children}</main>
      {!home && (
        <div className={styles.backToHome}>
          <Link href="/">
            <a>← Back to home</a>
          </Link>
        </div>
      )}
    </div>
  )
}
