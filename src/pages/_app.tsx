//=> O _app é o arquivo mais genérico da aplicação Next.js, de modo que todo o código da aplicação é construído dentro dele.
//=> Toda mudança de página faz o _app ser recarregado.

import { AppProps } from "next/app";
import { Header } from "../components"; // presente em todas as páginas
import "../styles/global.scss"; // estilos CSS globais

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Header />
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
