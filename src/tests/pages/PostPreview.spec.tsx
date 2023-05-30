import { getPrismicClient } from "../../services/prismic";

import { render, screen } from "@testing-library/react";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import PostPreview, { getStaticProps } from "../../pages/posts/preview/[slug]";

const post = {
  slug: "my-new-post",
  title: "My New Post",
  content: "<p>Post Excerpt</p>",
  updatedAt: "27th of May of 2023",
};

jest.mock("next-auth/react");
jest.mock("../../services/prismic");
jest.mock("next/router", () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}));
describe("Post Preview page", () => {
  it("renders correctly", () => {
    const useSessionMocked = jest.mocked(useSession);
    const useRouterMocked = jest.mocked(useRouter);

    useSessionMocked.mockReturnValueOnce({data: null, status:'loading'});

    render(<PostPreview post={post} />);

    expect(screen.getByText("My New Post")).toBeInTheDocument();
    expect(screen.getByText("Post Excerpt")).toBeInTheDocument();
  });

  it("redirets user to full post when user is subscribed", async () => {
    const useSessionMocked = jest.mocked(useSession);
    const useRouterMocked = jest.mocked(useRouter);
    const pushMock = jest.fn();
    useSessionMocked.mockReturnValueOnce({
      data: {
        activeSubscription: "fake-active-subscrition",
        expires: 'fake-expires'
      },
      status: "authenticated",
    } as any);

    useRouterMocked.mockReturnValueOnce({
      push: pushMock,
    } as any);

    render(<PostPreview post={post} />);

    expect(pushMock).toHaveBeenCalledWith("/posts/my-new-post");
  });
});

it('loads initial data', async () => {
  const getPrismicClientMocked = jest.mocked(getPrismicClient);

  getPrismicClientMocked.mockReturnValueOnce({
    getByUID: jest.fn().mockResolvedValueOnce({
      data: {
        title: [{ type: 'heading', text: 'My New Post' }],
        content: [{ type: 'paragraph', text: 'Post Excerpt' }],
      },
      last_publication_date: '05-27-2023',
    }),
  } as any);

  const response = await getStaticProps({ params: { slug: 'my-new-post' } });

  expect(response).toEqual(
    expect.objectContaining({
      props: {
        post: {
          slug: 'my-new-post',
          title: 'My New Post',
          content: 'Post Excerpt',
          updatedAt: '27 de maio de 2023'
        },
      },
    })
  );
});
