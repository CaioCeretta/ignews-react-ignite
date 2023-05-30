
import { getPrismicClient } from '../../services/prismic';
import Posts, { getStaticProps } from '../../pages/posts';
import { render, screen } from '@testing-library/react'


jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}))

jest.mock('../../services/stripe');

jest.mock('next-auth/react', () => {
  return {
    useSession() {
      return [null, false];
    },
  };
});

const posts = [
  {
    slug: 'my-new-post',
    title: 'My New Post',
    excerpt: 'Post Excerpt',
    updatedAt: '27th of May of 2023'

  }
]

jest.mock('../../services/prismic')

describe('Posts pages', () => {
  it('renders correctly', () => {
    render(<Posts posts={posts}/>)

    expect(screen.getByText('My New Post')).toBeInTheDocument()
  })

  it('loads initial data', async () => {
    const getPrismicClientMocked = jest.mocked(getPrismicClient)

    getPrismicClientMocked.mockReturnValueOnce({
      query: jest.fn().mockResolvedValueOnce({
          results: [
            {
              uid: 'my-new-post',
              data: {
                title: [{ type: 'heading', text: 'My New Post'}],
                content: [{type: 'paragraph', text: 'Post Excerpt'}],
              },
              last_publication_date: '05-27-2023'
            }
          ]
        
      })
    } as any)

    const response = await getStaticProps({})

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: [{
            slug: 'my-new-post',
            title: 'My New Post',
            excerpt: 'Post Excerpt',
            updatedAt: '27 de maio de 2023'
          }]
        }
      })
    )
  })
})