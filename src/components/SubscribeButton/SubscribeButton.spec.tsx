import { fireEvent, render, screen } from "@testing-library/react";
import { signIn, useSession } from "next-auth/react";
import { SubscribeButton } from ".";
import { Sin } from "faunadb";
import { userAgent } from "next/server";
import { useRouter } from "next/router";

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}))

jest.mock("next-auth/react");

describe("Subscribe Button Component", () => {
  it("renders correctly", () => {
    const useSessionMocked = jest.mocked(useSession);
    

    const pushMocked = jest.fn();

    useSessionMocked.mockReturnValueOnce([null, false]);

    render(<SubscribeButton />);

    expect(screen.getByText("Subscribe Now!")).toBeInTheDocument();
  });

  it("redirects user to signin when not authenticated", () => {
    const signInMocked = jest.mocked(signIn);
    const useSessionMocked = jest.mocked(useSession);


    const pushMocked = jest.fn();


    useSessionMocked.mockReturnValueOnce([null, false])
    render(<SubscribeButton />);

    const subcribeButton = screen.getByText("Subscribe Now!");

    fireEvent.click(subcribeButton);

    expect(signInMocked).toHaveBeenCalled();
  });

  it("Redirects to posts when user already has a subscription", () => {
    
    const useSessionMocked = jest.mocked(useSession)
    const useRouterMocked = jest.mocked(useRouter)

    useSessionMocked.mockReturnValue({
      data: {
        user: {
          email: "john.doe@example.com",
          name: "John Doe",
        },
        activeSubscription: "fake-active-subscription",
        expires: "fake-expire",
      },
      status: "authenticated",
    });

    const pushMock = jest.fn()

    useRouterMocked.mockReturnValueOnce({
      push: pushMock
    } as any)

    render(<SubscribeButton />);

    const subcribeButton = screen.getByText("Subscribe Now!");

    fireEvent.click(subcribeButton);

    expect(pushMock).toHaveBeenCalled();
  });
});
