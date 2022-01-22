import Link from 'next/link'
import Image from 'next/image'
import Container from './Container'
import s from './AppHeader.module.scss'

export default function AppHeader() {
  return (
    <header className={s.header}>
      <Container>
        <div className={s.inner}>
          <Link href="/">
            <a>
              <Image src="/images/logo.svg" width="33" height="36" />
            </a>
          </Link>
          <Link href="/">
            <a className={s.blogTitle}>ryutaudo / blog</a>
          </Link>
        </div>
      </Container>
    </header>
  )
}
