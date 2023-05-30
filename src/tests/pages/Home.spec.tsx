import { useSession } from 'next-auth/react';
import Home, { getStaticProps } from '../../pages'
import { stripe } from '../../services/stripe';
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
describe('Home page', () => {
  it('renders correctly', () => {
    

    render(<Home product={{priceId: 'fake-price-id', amount: 'fake-amount'}}/>)

    expect(screen.getByText('for fake-amount per month')).toBeInTheDocument()
  })

  it('loads initial data', async () => {
    const retriveStripePricesMocked = jest.mocked(stripe.prices.retrieve);

    retriveStripePricesMocked.mockResolvedValueOnce({
      id: 'fake-price-id',
      unit_amount: 1000,
    } as any)

    const response = await getStaticProps({})

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          product: {
            priceId: 'fake-price-id',
            amount: '$10.00'
          }
        }
      })
    )
  })
})