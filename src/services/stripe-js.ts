//=> Esta instância do Stripe é utilizada para integrar o front-end com o Stripe, em operações que dependem da chave pública da API.
//=> O front-end lida com o redirecionamento de página para o usuário.

import { loadStripe } from "@stripe/stripe-js";

export async function getStripeJs() {
  const stripeJs = await loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY
  ); //chave pública
  return stripeJs;
};

// A API do Stripe define rotas automaticamente debaixo dos panos.