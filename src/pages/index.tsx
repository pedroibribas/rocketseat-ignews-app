//=> A função do 'pages/index.js' é ser a Home da página, isto é, o caminho '/'.
//=> A exportação das páginas deve seguir o padrão 'export default'
//=> O cabeçalho dinâmico fica na página, enquanto o estático fica em _document.js
//=> Não é possível guardar o index.js e arquivo de estilos em pasta própria, e ambos devem ficar em './pages/'

import { GetServerSideProps, GetStaticProps } from 'next';
import Head from "next/head";
import { SubscribeButton } from "../components";
import { stripe } from '../services/stripe';
import { currency } from '../utils/currency';
import styles from './home.module.scss';

interface HomeProps {
  products: {
    priceId: string
    amount: number
  }
};

export default function Home({ products }: HomeProps) { //export default é obrigatório
  return (
    <>
      {/* === Cabeçalho HTML dinâmico === */}
      <Head>
        <title>ig.news</title>
      </Head>
      {/* === Corpo da página === */}
      {/*o componente <Header/> está em _app.tsx*/}
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>Hey, welcome!</span>
          <h1>News about the React world.</h1>
          <p>
            Get access to all publications <br />
            <span>for {products.amount} month</span>
          </p>
          <SubscribeButton priceId={products.priceId} />
        </section>
        <img
          src="/images/avatar.svg" //atribuir caminho no JSX
          alt="Girl coding"
        />
      </main>
    </>
  )
};

//=> A função nativa do Next.js GetServerSideProps faz chamadas API no server-side (e não no client-side) e recebe os dados obtidos para serem usados no front-end como props do componente React.
//=> Esta função só funciona se exportada de uma página.
//=> Esta função deve ser sempre assíncrona.
//=> ref: https://nextjs.org/docs/basic-features/data-fetching/get-server-side-props
export const getServerSideProps: GetServerSideProps = async () => {
  // === [...código lido no server-side] ===

  const priceApiId = "<cole_api_id_aqui>"; // = acessar produto cadastrado no Stripe
  // const params = { expand: ["product"] }; // expandir key "product"
  const price = await stripe.prices.retrieve(priceApiId);

  const product = {
    priceId: price.id,
    amount: currency(price.unit_amount)
  };

  return {
    props: { product } // retornar React props
  };
};

//=> A função nativa GetStaticProps tem a mesma finalidade que a função GetServerSideProps, mas salva uma versão estática da página em HTML (Server Site Generation). Assim a construção da página não ocorre em cada requisição do client-side.
//=> O GetStaticProps é útil para otimizar a geração de páginas com informações destinadas a todos os usuários, e não dinâmicas.
export const getStaticProps: GetStaticProps = async () => {
  // === [...código lido no server-side] ===

  const priceApiId = "<cole_api_id_aqui>";
  // const params = { expand: ["product"] };
  const price = await stripe.prices.retrieve(priceApiId);

  const product = {
    priceId: price.id,
    amount: currency(price.unit_amount)
  };

  return {
    props: { product },
    // Configurar revalidação da página, isto é, ciclo de tempo para a reconstrução da página estática (em segundos).
    revalidate: 60 * 60 * 24 // 24 hours
  };
};
