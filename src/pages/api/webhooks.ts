/**
 * Webhooks são padrões de código que integram o app com sistemas de terceiros, de modo que a aplicação receba os dados de eventos ocorridos naqueles sistemas. 
 * 
 * Esta rota integra o app com o sistema do Stripe via webhooks do próprio Stripe. 
 * 
 * Para que esse arquivo funcione regularmente, é necessário estar rodando o Stripe CLI, no Terminal, cuja função é monitorar o app.
 * ref: https://stripe.com/docs/webhooks
 * 
 */

import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from "stream";
import Stripe from "stripe";
import { stripe } from "../../services/stripe";
import { saveSubscription } from "./_lib/manageSubscription";

async function buffer(readable: Readable) {
  // Os dados recebidos pelo Stripe estão em formato Stream. 
  // É necessário converter em um formato que seja legível para o JavaScript.

  const chunks = [];

  for await (const chunk of readable) {
    chunks.push(
      typeof chunk === "string" ? Buffer.from(chunk) : chunk
    );
  };

  return Buffer.concat(chunks);
};

/**
 * Esta opção é recebida pelo controlador.
 * Ela desabilita o bodyParser para que seja habilitado o consumo de Stream
 */
export const config = {
  api: {
    bodyParser: false
  }
};

// Criar lista de eventos relevantes
const relevantEvents = new Set([
  "checkout.session.completed", // = inscrição pelo app
  "customer.subscription.updated", // = assinatura atualizada
  "customer.subscription.deleted" // = assinatura deletada
  //esses são dados fornecidos pelo Stripe
]); // Set cria uma array com dados não repetidos

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    // # Obter dados enviados pelo Stripe
    const buf = await buffer(req); // eventos da requisição
    const header = req.headers["stripe-signature"]; // cabeçalho da requisição

    // # Construir evento
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        buf,
        header, // verifica que a requisição vem do Stripe
        process.env.STRIPE_WEBHOOK_SECRET // gerado no Stripe CLI
      );
    } catch (error) {
      return res.status(400).send(`Webhook Error: ${error.message}`);
      // Esse tratamento impede que terceiros estranhos utilizem esta rota.
    }

    // # Verificar eventos
    const { type } = event;
    // O nome dos eventos está em `event.type`;

    if (relevantEvents.has(type)) {
      try {
        switch (type) {
          case "customer.subscription.updated":
          case "customer.subscription.deleted":
            // # Salvar ou atualizar ou deletar assinatura na db
            const subscription = event.data.object as Stripe.Subscription;
            await saveSubscription(
              subscription.id,
              subscription.customer.toString(),
              false
            );
            break;

          case "checkout.session.completed":
            // # Salvar assinatura na db
            const checkoutSession = event.data.object as Stripe.Checkout.Session;
            await saveSubscription(
              checkoutSession.subscription.toString(),
              checkoutSession.customer.toString(),
              true
            );
            break;

          default:
            // Lançar erro de desenvolvimento para evitar que existam eventos que não foram tratados acima
            throw new Error("Event unhandled");
        }
      } catch (error) {
        // Enviar erro para o Stripe
        res.json({ error: "Webhook handler failed." });
      }
    };

    res.json({ received: true });
  } else {
    // Criar cabeçalho para contextualizar a response
    // Retornar erro
    res.setHeader("Allow", "POST");
    res.status(405).end("Method not allowed"); // 405 = Method not allowed
  }
};