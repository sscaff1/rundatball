import { config } from '@fortawesome/fontawesome-svg-core';
import NProgress from 'nprogress';
import Router from 'next/router';
import Script from 'next/script';

import 'styles/global.css';
import 'nprogress/nprogress.css';
import '@fortawesome/fontawesome-svg-core/styles.css';

config.autoAddCss = false;

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

export default function App({ Component, pageProps }) {
  return (
    <>
      <Script async src="https://www.googletagmanager.com/gtag/js?id=G-PRMRS7BX38" />
      <Script id="google-analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-PRMRS7BX38');
        `}
      </Script>
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4778356606512971"
        crossorigin="anonymous"
      />
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <Component {...pageProps} />
    </>
  );
}
