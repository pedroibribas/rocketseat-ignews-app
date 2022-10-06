//=> O roteamento via API Routes tem a função de servir dados ao front-end quando a UI já está montada.
//=> No Next.js, variáveis de ambiente são lidas exclusivamente no server-side, via API Routes, getStaticProps ou getServerSideProps.

//route = "/subscribe" (nome do arquivo)
//method = não existe; é necessário validar o método da requisição.

import { query as q } from "faunadb";
import { NextApiRequest, NextApiResponse } from "next";
/**
 * Importar getSession()
 * # A hook useSession() está disponível apenas no front-end. No back-end, é necessário obter os dados dos cookies via getSession().
 * # Os dados guardados como cookies são acessíveis no back-end, porque eles ficam disponíveis para o domínio (diferente dos dados da localStorage, que ficam disponíveis apenas para o front-end).
 */
import { getSession } from "next-auth/react";
import { fauna } from "../../services/fauna";
import { stripe } from "../../services/stripe";

/**
 * O tipo User é necessário para corrigir erros TS ao longo da função ao utilizar dados da variável `user`
 */
type User = {
  data: {
    email: string,
    stripe_customer_id: string
  },
  ref: {
    id: string
  }
};

export default async (request: NextApiRequest, response: NextApiResponse) => {
  if (request.method === "POST") {
    const session = await getSession({
      req: request
    }); // obtem sessão do usuário via cookies com NextAuth.js

    // # READ FaunaDb
    const user = await fauna.query<User>(q.Get(q.Match(
      q.Index("user_by_email"), //índice para busca criado no FaunaDb
      q.Casefold(session.user.email) //caracteres padronizados
    ))); // obtém usuário na db da aplicação

    let customerId = user.data.stripe_customer_id;

    // Validar se stripe_customer_id existe
    if (!customerId) {
      const stripeCustomer = await stripe.customers.create({
        email: session.user.email,
      }); // registra um customer na db do Stripe

      customerId = stripeCustomer.id; //id do customer registrado

      // # UPDATE FaunaDb
      await fauna.query(q.Update(
        q.Ref(q.Collection("users"), user.ref.id), //documento?
        { stripe_customer_id: stripeCustomer.id } //novo dado?
      ));
    };

    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      billing_address_collection: "required",
      line_items: [{ price: "inserir_id_do_preço", quantity: 1 }],
      mode: "subscription",
      allow_promotion_codes: true,
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL,
    }); // gera checkout do Stripe

    return response.status(200).json({
      sessionId: stripeCheckoutSession.id
    });
  } else {
    // Criar cabeçalho para contextualizar a response
    response.setHeader("Allow", "POST");
    // Retornar erro
    response.status(405).end("Method not allowed"); // 405 = Method not allowed
  }
};