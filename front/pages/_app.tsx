import type { AppProps } from 'next/app';
import Head from 'next/head';
import { ThemeProvider } from 'styled-components';
import 'public/IBM Plex Sans/stylesheet.css';
import 'public/TT Firs/stylesheet.css';
import 'styles/globals.css';
import theme from 'styles/theme';
import Layout from 'components/Layout';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <Head>
        <title>Innoagency Startup Recommendation</title>
        <meta name="description" content="Recommendation system for startups" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link
          rel="manifest"
          crossOrigin="use-credentials"
          href="/site.webmanifest"
        />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#1f5eff" />
      </Head>

      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  );
}
export default MyApp;
