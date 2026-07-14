import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email as string,
          },
        });
        if (!user?.password) return null;

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password as string
        );
        if (isValid) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { password: _password, ...userWithoutPassword } = user;

          return userWithoutPassword;
        }
        return null;
      },
    }),
  ],

  callbacks: {
    async session({ session, token }) {
      if (token.sub) {
        const userWithSubs = await prisma.user.findUnique({
          where: {
            id: token.sub,
          },
          include: {
            subscription: true,
          },
        });

        if (userWithSubs) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { password: _password, ...userWithoutPassword } = userWithSubs;
          session.user = {
            ...session.user,
            ...userWithoutPassword,
            subscriptions: userWithSubs.subscription,
          };
        }
      }

      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
});

export const { GET, POST } = handlers;
