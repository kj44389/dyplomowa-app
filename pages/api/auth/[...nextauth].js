import nextAuth from "next-auth";
import _fetch from "isomorphic-fetch";
import CredentialsProvider from "next-auth/providers/credentials";
import { absoluteUrlPrefix, basePath } from "next.config";
export default nextAuth({
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "credentials",
      // id: 'login',
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: { label: "password", type: "password" },
      },
      authorize: async (credentials, req) => {
        // Add logic here to look up the user from the credentials supplied
        // const user = {
        // 	id: 1,
        // 	name: 'J Smith',
        // 	email: 'jsmith@example.com',
        // };
        //   console.log(credentials);
        //   console.log(+"/user/getOneUser/" + req.body.email);
        console.log(credentials.email);
        const data = await (
          await _fetch(
            absoluteUrlPrefix + "/api/user/getOneUser/" + credentials.email,
            { method: "POST" }
          )
        ).json();
        console.log("next-config --------------", data);
        const user = {
          id: data.user_id,
          email: data.user_email,
          name: data.user_full_name,
          create_at: data.user_created_at,
          role: data.user_role,
        };
        if (user) {
          // Any object returned will be saved in `user` property of the JWT
          return user;
        } else {
          // If you return null or false then the credentials will be rejected
          return null;
          // You can also Reject this callback with an Error or with a URL:
          // throw new Error('error message') // Redirect to error page
          // throw '/path/to/redirect'        // Redirect to a URL
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.createdAt = user.create_at;
        token.role = user.role;
      }
      return token;
    },
    signIn: async ({ user, account, profile, email, credentials }) => {
      return true;
    },
    redirect: async ({ url, baseUrl }) => {
      return url.startsWith("/auth/signin")
        ? Promise.resolve(url)
        : Promise.resolve(baseUrl);
    },
    session: ({ session, token }) => {
      if (token) {
        session.id = token.id;
        session.email = token.email;
        session.name = token.name;
        session.createdAt = token.createdAt;
        session.role = token.role;
      }
      return session;
    },
  },
  secret: "test",
});
