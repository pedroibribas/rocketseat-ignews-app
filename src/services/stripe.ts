//=> Esta instância do Stripe é utilizada para integrar o back-end com o Stripe, em operações que dependem da chave privada da API. 
//=> O back-end lida com registros na database do Stripe.

import Stripe from 'stripe';
import { name, version } from '../../package.json';

export const stripe = new Stripe(
  process.env.STRIPE_API_KEY, //chave privada
  {
    apiVersion: "2022-08-01",
    appInfo: {
      name,
      version,
    }
  }
);

// A API do Stripe define rotas automaticamente debaixo dos panos.