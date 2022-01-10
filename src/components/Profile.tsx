import Image from 'next/image'
import s from './Profile.module.css'

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
      </div>
    </div>
  )
}
