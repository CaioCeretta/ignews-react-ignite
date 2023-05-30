import { render, screen } from '@testing-library/react'
import { useSession } from 'next-auth/react'
import { SignInButton } from '.'
import { Sin } from 'faunadb'
import { userAgent } from 'next/server'


jest.mock('next-auth/react')

describe('SignIn Button Component', () => {
  it('renders correctly when user is not logged in', () => {
    
    const useSessionMocked = jest.mocked(useSession)

    useSessionMocked.mockReturnValueOnce({data: null, status: 'loading'})


    render(
      <SignInButton />
    )
  
    expect(screen.getByText('Sign In with GitHub')).toBeInTheDocument()
  })

  it('renders correcly when user is logged in', () => {
    const useSessionMocked = jest.mocked(useSession)

    useSessionMocked.mockReturnValue({data: {
      user: {
        email: 'john.doe@example.com',
        name: 'John Doe'
      },
      expires: 'fake-expire',
    },
    status: 'authenticated'})

    render(<SignInButton />)

    expect(screen.getByText('John Doe')).toBeInTheDocument()

  })

})