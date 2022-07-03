import { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';

export default function Document() {
  return (
    <Html>
      <Head>
        <meta httpEquiv="Content-Language" content="en-US" />
        <meta name="HandheldFriendly" content="true" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=BioRhyme:wght@700&family=Cabin&family=Splash&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        {/* <link
          rel="alternate"
          type="application/rss+xml"
          title="NFL Visuals Blog RSS Feed"
          href="/rss.xml"
        /> */}
        <meta charset="utf-8" />
        <meta name="theme-color" content="#ffffff" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="website" />
        <meta property="twitter:creator" content="@Steven_Scaffidi" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
