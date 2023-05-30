
import Prismic from '@prismicio/client';
import Link from 'next/link';
import { GetStaticProps } from 'next';
import { RichText } from 'prismic-dom';
import Head from "next/head";




import { getPrismicClient } from '../../services/prismic';

import styles from "./styles.module.scss";
import { useSession } from 'next-auth/react';

type Post = {
  slug: string;
  title: string;
  excerpt: string;
  updatedAt: string;
}

interface IPostProps {
  posts: Post[]
}

export default function Posts({ posts }: IPostProps) {
  const { data: session } = useSession();


  return (
    <>
      <Head>
        <title> Posts | ig.news </title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map(post => (
            <Link key={post.slug} href={session?.user?.email ? `/posts/${post.slug}` : `/posts/preview/${post.slug}`}>
                <time> {post.updatedAt} </time>
                <strong> {post.title} </strong>
                <p> {post.excerpt} </p>
            </Link>
          ))}

        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const response = await prismic.query([
    Prismic.predicates.at('document.type', 'publication')
  ], {
    fetch: ['publication.title', 'publication.content'],
    pageSize: 100
  })
  

  const posts = response.results.map(post => ({
    slug: post.uid,
    title: RichText.asText(post.data.title),
    excerpt: post.data.content.find((content: any) => content.type === 'paragraph')?.text ?? '',
    updatedAt: new Date(post.last_publication_date || '').toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }))

  return {
    props: {
      posts
    }
  }
}