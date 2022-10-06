import { query as q } from "faunadb";
import { fauna } from "../../../services/fauna";
import { stripe } from "../../../services/stripe";

export async function saveSubscription(
  subscriptionId: string,
  customerId: string,
  createAction = false
) {
  // Obter ref do user
  const userRef = await fauna.query(
    q.Select(
      "ref", //campo desejado
      q.Get( //documento?
        q.Match(
          q.Index("user_by_stripe_customer_id"), //index de pesquisa
          customerId //valor do index
        )
      )
    )
  );

  // Obter dados da assinatura
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  const subscriptionData = {
    userId: userRef,
    id: subscription.id,
    status: subscription.status, // = active
    price_id: subscription.items.data[0].price.id
  };

  if (createAction) {
    // # CRIAR documento na coleção SUBSCRIPTIONS
    await fauna.query(q.Create(
      q.Collection("subscriptions"),
      { data: subscriptionData }
    ));
  } else {
    // # ATUALIZAR documento na coleção SUBSCRIPTIONS
    await fauna.query(
      // Substituir todos os campos
      q.Replace(
        q.Select(
          "ref",
          q.Get(q.Match(
            q.Index("subscription_by_id"),
            subscription.id
          ))),
        { data: subscriptionData }
      )
    );
  };
};