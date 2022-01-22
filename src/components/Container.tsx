import { ReactNode } from 'react'
import s from './Container.module.scss'

type Props = {
  children: ReactNode
}

export default function Container({ children }: Props) {
  return <div className={s.container}>{children}</div>
}
