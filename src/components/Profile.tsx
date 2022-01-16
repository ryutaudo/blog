import Image from 'next/image'
import Link from 'next/link'
import s from './Profile.module.scss'

export default function Profile() {
  return (
    <div className={s.profile}>
      <div className={s.imageWrapper}>
        <Image
          src="/images/profile-image.jpeg"
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className={s.description}>
        <h3 className={s.name}>Ryuta Udo</h3>
        <p className={s.desc1}>Software developer based in Japan</p>
        <p className={s.desc2}>
          プログラミングから日常のことまで幅広く書いていくブログです。
        </p>
        <div className={s.social}>
          <Link href="https://twitter.com/ryuta_udo">
            <a>
              <Image src="/images/twitter.svg" width={30} height={30} />
            </a>
          </Link>
          <Link href="https://github.com/ryutaudo">
            <a>
              <Image src="/images/github.svg" width={30} height={30} />
            </a>
          </Link>
        </div>
      </div>
    </div>
  )
}
