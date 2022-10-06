import Head from "next/head";
import styles from "styles.module.scss";

export default function Posts() {
  return (
    <>
      {/* === Cabeçalho HTML dinâmico === */}
      <Head>
        <title>Posts | Ignews</title>
      </Head>
      {/* === Corpo da página ===*/}
      <main className={styles.container}>
        <div className={styles.posts}>
          <a href="#top">
            <time>03 de outubro de 2022</time>
            <strong>Lorem ipsum dolor</strong>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. A consectetur, ab ipsum natus adipisci, eos, reiciendis assumenda aliquam accusantium id provident porro at impedit laboriosam maiores ipsa eveniet iusto repellat.
            </p>
          </a>
        </div>
      </main>
    </>
  );
};