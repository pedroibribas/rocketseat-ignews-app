import { signIn, useSession } from "next-auth/react";
import { api } from "../../services/api";
import { getStripeJs } from "../../services/stripe-js";
import styles from "./styles.module.scss";

interface SubscribeButtonProps {
  priceId: string
};

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const { data: session } = useSession();

  async function handleSubscribe() {
    // Validar se usuário existe
    if (!session) {
      signIn("github");
      return;
    };

    try {
      // Redirecionar usuário para a página de pagamento
      const response = await api.post("/subscribe"); //init checkout
      const { sessionId } = response.data; //get checkout id
      const stripe = getStripeJs(); //init front-end
      (await stripe).redirectToCheckout({ sessionId }); //redirect user
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <button
      type="button"
      className={styles.subscribeButton}
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  );
};