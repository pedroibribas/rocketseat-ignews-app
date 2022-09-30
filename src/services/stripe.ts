import Stripe from 'stripe';
import { name, version } from '../../package.json';

export const stripe = new Stripe(
  process.env.STRIPE_API_KEY,
  {
    apiVersion: "2022-08-01",
    appInfo: {
      name,
      version,
    }
  }
);

// A API do Stripe define rotas automaticamente debaixo dos panos.