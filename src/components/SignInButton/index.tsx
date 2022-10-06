import { signIn, signOut, useSession } from "next-auth/react";
import { FaGithub } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import styles from './styles.module.scss';

export function SignInButton() {
  // Obter sessão do Provider (ver _app.tsx)
  const { data: session } = useSession();

  function handleSignIn() {
    signIn("github"); // Inicializa sessão (cookies)
  };

  function handleSignOut() {
    signOut(); // Limpa sessão do usuário
  };

  return session ? (
    <button
      className={styles.signInButton}
      type="button"
      onClick={handleSignOut}
    >
      <FaGithub color="#04d361" />
      Diego Fernandes
      <FiX color="#737380" className={styles.closeIcon} />
    </button>
  ) : (
    <button
      className={styles.signInButton}
      type="button"
      onClick={handleSignIn}
    >
      <FaGithub color="#eba417" />
      Sign in with GitHub
    </button>
  );
};