import s from './MarkdownView.module.scss'

type PostContentProps = {
  content: string
}

export default function PostContent({ content }: PostContentProps) {
  return (
    <div
      className={s.markdownView}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}
