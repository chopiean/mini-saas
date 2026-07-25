import { Prisma } from "@/src/generated/prisma/client";

export type UserWithSub = Prisma.UserGetPayload<{
  include: {
    subscription: {
      include: {
        invoices: true;
      };
    };
  };
}>;

export type SubscriptionWithInvoices = Prisma.SubscriptionsGetPayload<{
  include: {
    invoices: true;
  };
}>;
