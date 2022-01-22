import { GetStaticProps, GetStaticPaths } from 'next'
import Head from 'next/head'
import Date from 'components/Date'
import Layout from 'components/Layout'
import PostContent from 'components/MarkdownView'
import { getAllPostIds, getPostData } from 'lib/posts'
import utilStyles from 'styles/utils.module.css'

export default function Post({
  postData,
}: {
  postData: {
    title: string
    date: string
    contentHtml: string
  }
}) {
  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto+Mono"
          rel="stylesheet"
        />
        <meta name="og:title" content={postData.title} />
      </Head>
      <article>
        <h1 className={utilStyles.headingXl}>{postData.title}</h1>
        <div className={utilStyles.lightText}>
          <Date dateString={postData.date} />
        </div>
        <div className={utilStyles.content}>
          <PostContent content={postData.contentHtml} />
        </div>
      </article>
    </Layout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getAllPostIds()
  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const postData = await getPostData(params.id as string)
  return {
    props: {
      postData,
    },
  }
}
