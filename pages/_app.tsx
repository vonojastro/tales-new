import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider, useSession } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';
import Header from '../components/Header/Header';


function MyApp({ Component, pageProps }: AppProps) {


  return (
    <SessionProvider session={pageProps.session}>
      <Toaster />
      <Component {...pageProps} />
    </SessionProvider>
  )
}

export default MyApp
