
import { getPrismicClient } from '../../services/prismic';
import Post, { getServerSideProps } from '../../pages/posts/[slug]';
import { render, screen } from '@testing-library/react'
import { getSession } from 'next-auth/react';


jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}))

jest.mock('../../services/stripe');

// jest.mock('next-auth/react', () => {
//   return {
//     useSession() {
//       return [null, false];
//     },
//   };
// });

const post =
  {
    slug: 'my-new-post',
    title: 'My New Post',
    content: '<p>Post Excerpt</p>',
    updatedAt: '27th of May of 2023'
  }


jest.mock('next-auth/react');


jest.mock('../../services/prismic')

describe('Post page', () => {
  it('renders correctly', () => {
    render(<Post post={post}/>)

    expect(screen.getByText('My New Post')).toBeInTheDocument()
    expect(screen.getByText('Post Excerpt')).toBeInTheDocument()
  })

  it('redirects user if no subscription is found', async () => {
    const getSessionMocked = jest.mocked(getSession)

    getSessionMocked.mockResolvedValueOnce(null)

    const response = await getServerSideProps({ params: { slug: 'my-new-post' } } as any)

    expect(response).toEqual(
      expect.objectContaining({
        redirect: expect.objectContaining({
          destination: '/'
        })
      })
    )
  });

  it('it loads initial data', async () => {
    const getSessionMocked = jest.mocked(getSession)

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: 'fake-active-subscription'
    } as any)

    const getPrismicClientMocked = jest.mocked(getPrismicClient);

    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
          data: {
            title: [{ type: 'heading', text: 'My New Post'}],
            content: [{type: 'paragraph', text: 'Post Excerpt'}],
          },
          last_publication_date: '05-27-2023' 
      })
    } as any)

    const response = await getServerSideProps({
      params: { slug: 'my-new-post'}
    } as any)

    expect(response).toEqual(
      expect.objectContaining({
         props: {
          post: {
            slug: 'my-new-post',
            title: 'My New Post',
            content: '<p>Post Excerpt</p>',
            updatedAt: '27 de maio de 2023'
          }
         }
      })
    )
  })
 })