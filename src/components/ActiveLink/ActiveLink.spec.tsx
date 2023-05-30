import { render, screen } from '@testing-library/react'
import { ActiveLink } from '.'

jest.mock('next/router', () => {
  return {
    useRouter() {
      return {
        asPath: '/'
      }
    }
  }
})

describe('Active Link Component', () => {
  it('renders correctly', () => {
    render(<ActiveLink href="/" activeClassName='active'>
      Home
    </ActiveLink>
    )
  
    expect(screen.getByText('Home')).toBeInTheDocument()
  })
  
  it('add active class if the link is currentlt active', () => {
    render(
      <ActiveLink href="/" activeClassName="active">
        Home
      </ActiveLink>
    )
  
    expect(screen.getByText('Home')).toHaveClass('active')
  })
})