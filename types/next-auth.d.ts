import "next-auth";
import type { User as PrismaUser, SubScription } from "../lib/prisma";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      subscriptions: SubScription[];
    };
  }

  interface User extends PrismaUser {
    subscriptions?: SubScription[];
  }

  interface JWT {
    user?: {
      id: string;
    };
  }
}
