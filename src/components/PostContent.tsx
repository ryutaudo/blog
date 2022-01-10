import styles from './PostContent.module.scss'

type PostContentProps = {
  content: string
}

export default function PostContent({ content }: PostContentProps) {
  return (
    <div
      className={styles.postContent}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}
