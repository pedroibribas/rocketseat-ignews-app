//=> A documentação do NextAuth.js descreve o padrão `auth/[...nextauth].js`.
//=> O padrão do Next.js para obter parâmetros da URL é [query] ou [...query]. O nome `[...nextauth].ts` é um spread operator entre colchetes, e representa as queries da requisição.
//=> ref: https://next-auth.js.org/providers/github

import { query as q } from "faunadb";
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { fauna } from "../../../services/fauna";

export const authOptions = {
  // Configurar opções para autenticação pelo GitHub
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      authorization: {
        params: {
          scope: "read:user" //grants access to read a user's profile data
        }
      }
    }),
  ],
  // Corrigir erro JWT,
  // Adicionar usuário na DB ao signIn
  callbacks: {
    async signIn({ user, account, profile }) {
      const { email } = user;

      // Verificar interação com o DB
      try {
        await fauna.query(
          // Validar se usuário existe
          q.If(
            q.Not(q.Exists(q.Match(
              q.Index("user_by_email"), //índice para busca criado no FaunaDb
              q.Casefold(user.email) //caracteres padronizados
            ))),
            // Adiciona novo documento a uma coleção
            q.Create(
              q.Collection("users"), //Obtém o Ref da coleção
              { data: { email } } //Obtém o documento adicionado
            ),
            //ELSE
            // Seleciona o usuário existente
            q.Get(q.Match(
              q.Index("user_by_email"),
              q.Casefold(user.email)
            ))
          )
        );
        //ref:https://docs.fauna.com/fauna/current/api/fql/cheat_sheet

        return true; // success
      } catch {
        return false; // error
      }
    },
  }
};

export default NextAuth(authOptions);