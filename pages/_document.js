import { Html, Head, Main, NextScript } from 'next/document';

// SEO stuff
const keywords = 'nfl rushing blog, football rushing blog, run game';
const logoImg = 'https://www.runthatball.com/logo.png';
const siteName = 'RunThatBall';

export default function Document() {
  return (
    <Html>
      <Head>
        <meta httpEquiv="Content-Language" content="en-US" />
        <meta name="HandheldFriendly" content="true" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=BioRhyme:wght@700&family=Cabin&display=swap"
          rel="stylesheet"
        />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
        {/* SEO stuff */}
        <link rel="apple-touch-icon" sizes="76x76" href="/favicon/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png?v=2" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png?v=2" />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <link rel="mask-icon" href="/favicon/safari-pinned-tab.svg" color="#111827" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="keywords" content={keywords} />
        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="website" />
        <meta property="twitter:creator" content="@Steven_Scaffidi" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: `
            {
              "@context": "http://schema.org",
              "@type": "Organization",
              "name": "${siteName}",
              "url": "https://www.nolahire.com/",
              "logo": "${logoImg}"
            }
        `,
          }}
        />
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-1RC9NFWKD7" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
          
            gtag('config', 'G-1RC9NFWKD7');
              `,
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
