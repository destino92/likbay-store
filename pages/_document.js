// _document is only rendered on the server side and not on the client side
// Event handlers like onClick can't be added to this file

import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          <link rel="icon" href="/favicon.png" />
          <link
            rel="stylesheet"
            href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
            integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh"
            crossOrigin="anonymous"
          />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
          <link href="https://fonts.googleapis.com/css2?family=Khula:wght@300;400;600&display=swap" rel="stylesheet" />
          <link rel="stylesheet" href="https://unpkg.com/swiper@6.6.2/swiper-bundle.min.css" />
          <meta name="title" content="Site de commerce en ligne" key="title" />
          <meta name="description" content="Likbay est une solution de vente et d'achats en ligne" />
          <meta property="og:title" content="Likbay" />
          <meta property="og:image" content="" />
          <meta property="og:description" content="Likbay est une solution de vente et d'achats en ligne, veuillez visiter" />
          <meta property="og:url" content="likbay.co" />
          <meta property="twitter:title" content="Likbay | Achat en ligne" />
          <meta name="twitter:creator" content="@likaby" />
          <meta property="twitter:image" content="" />
          <meta property="twitter:description" content="Likbay est une solution de vente et d'achats en ligne, veuillez visiter" />
          <meta name="twitter:card" content="summary_large_image" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
