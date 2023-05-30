import { SubscribeButton } from "../components/SubscribeButton";
import { stripe } from "../services/stripe";
import { GetStaticProps } from "next";
import Head from "next/head";

interface IHomeProps {
  product: {
    priceId: string;
    amount: string;
  };
}

import styles from "./home.module.scss";

export default function Home({ product }: IHomeProps) {
  return (
    <>
      <Head>
        <title>Home | ig.news</title>
      </Head>
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, Welcome!</span>
          <h1>
            News about the <span>React</span> world.
          </h1>
          <p>
            Get access to all the publications <br />
            <span>for {product.amount} per month</span>
          </p>

          <SubscribeButton/>
        </section>

        <img src="/images/avatar.svg" alt="Girls Coding" />
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve(
    "price_1Mnsq2ALOKh383KJHQEPbDky"
  );

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(
      price.unit_amount ? price.unit_amount / 100 : 0
    ),
  };

  return {
    props: {
      product,
    },

    revalidate: 60 * 60 * 24, // 24 horas
  };
};
