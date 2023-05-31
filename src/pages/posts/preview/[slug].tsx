import { GetStaticProps, GetStaticPaths } from "next"
import { getSession, useSession } from "next-auth/react"
import { redirect } from 'next/dist/server/api-utils'
import Head from "next/head"
import Link from 'next/link'
import { useRouter } from 'next/router'

import { RichText } from "prismic-dom"
import { useEffect } from 'react'
import { getPrismicClient } from "../../../services/prismic"

import styles from '../post.module.scss';
import { ParsedUrlQuery } from "querystring"



interface IPostPreviewProps {
  post: {
    slug: string;
    title: string;
    content: string;
    updatedAt: string;
  }
}

interface Params extends ParsedUrlQuery {
  slug: string;
}

// export const getStaticPaths = () => {
//   return {
//     paths: [],
//     fallback: 'blocking'
//   };
// }

export default function PostPreview({ post }: IPostPreviewProps) {
  const {data: session} = useSession()
  const router = useRouter()


  useEffect(() => {

    if(session?.activeSubscription) {
      router.push(`/posts/${post.slug}`);
    }

  }, [session])

  return (
    <>
      <Head>
        <title>{post.title} | ig.news </title>
      </Head>
      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div
            className={`${styles.postContent} ${styles.previewContent}`}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className={styles.continueReading}>
            Want to continue reading?
            <Link href="/" >
              Subscribe Now 🤗 
            </Link>
          </div>
        </article>
      
      </main>
    </>
  )
}


export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params as Params;

  const prismic = getPrismicClient();

  const response = await prismic.getByUID('publication', String(slug), {});

  const post = {
    slug,
    title: RichText.asText(response.data.title),
    content: RichText.asText(response.data.content.splice(0, 3)),
    updatedAt: new Date(response.last_publication_date || '').toLocaleDateString(
      'pt-BR',
      {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }
    ),
  };

  return {
    props: { post },
    revalidate: 60 * 30,
  };
};
