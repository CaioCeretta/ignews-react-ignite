import type { AppProps } from "next/app";
import { SessionProvider } from 'next-auth/react';
import { Provider as NextAuthProvider } from "next-auth/client";

import { Header } from '../components/Header';


import "../styles/global.scss";

export default function App({
  Component,
  pageProps: { session, ...pageProps},
}: AppProps) {
  

  return (
    <SessionProvider session={pageProps.session}>
      <Header />
      <Component {...pageProps} />
    </SessionProvider>
  );
}

