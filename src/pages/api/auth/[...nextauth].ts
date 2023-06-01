import GitHubProvider from "next-auth/providers/github";
import NextAuth from "next-auth";
import { query as q } from "faunadb";

import { fauna } from "../../../services/fauna";

export default NextAuth({
  secret: process.env.NEXTAUTH_SECRET || "",
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
      authorization: {
        params: {
          scope: "read:user",
        },
      },
    }),
  ],
  callbacks: {
    async session({ session }) {
      try {
        const userActiveSubscription = await fauna.query(
          q.Get(
            q.Intersection([
              q.Match(
                q.Index("subscription_by_user_ref"),
                q.Select(
                  "ref",
                  q.Get(
                    q.Match(
                      q.Index("user_by_email"),
                      q.Casefold(session.user?.email || "")
                    )
                  )
                )
              ),
              q.Match(q.Index("subscription_by_status"), "active"),
            ])
          )
        );

        return {
          ...session,
          activeSubscription: userActiveSubscription,
        };
      } catch {
        return {
          ...session,
          activeSubscription: null,
        };
      }
    },
    async signIn({ user, account, profile }) {
      const { email } = user;

      try {
        //Verificar se o user existe
        await fauna.query(
          q.If(
            q.Not(
              q.Match(q.Index("user_by_email"), q.Casefold(email || ""))
            ),
            //Se não existir criar
            q.Create(q.Collection("users"), { data: { email } }),
            q.Get(
              q.Match(q.Index("user_by_email"), q.Casefold(email || ""))
            )
          )
        );
        return true;
      } catch (err) {
        console.log(err);
        return false;
      }
    },
  },
});

// FaunaDB - HTTP: Utiliza um protocolo ao qual não se torna necessaria a conexão ativa a um banco de dados

/*PostgresSQL, MongoDB - Quando vai fazer uma operação no banco, é necessário uma conexão ativa com o banco
e o serverless não */
