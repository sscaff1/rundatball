import { config } from '@fortawesome/fontawesome-svg-core';
import NProgress from 'nprogress';
import Router from 'next/router';

import 'styles/global.css';
import 'nprogress/nprogress.css';
import '@fortawesome/fontawesome-svg-core/styles.css';

config.autoAddCss = false;

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

export default function App({ Component, pageProps }) {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Component {...pageProps} />;
}
