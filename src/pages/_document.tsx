//=> O _document corresponde ao index.html de uma aplicação React.js.
//=> O _document é carregado uma única vez pela aplicação.
//=> O _document é necessariamente uma classe JS.

import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
          <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700;900&display=swap" rel="stylesheet" />
          <link rel="shortcut icon" href="/favicon.png" type="image/png" />
          {/*não definir tag de título*/}
        </Head>
        <body>
          <Main />
          <NextScript /> {/*recebe arquivos JS*/}
        </body>
      </Html>
    );
  };
};
