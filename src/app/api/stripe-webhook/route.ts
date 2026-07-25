import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature: string = req.headers.get("stripe-signature") || "";

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: "Signature verification failed",
      },
      {
        status: 500,
      }
    );
  }

  if (event.type === "checkout.session.completed") {
    const stripeSession = event.data.object as Stripe.Checkout.Session;
    const userId = stripeSession.metadata?.userId;
    const plan = stripeSession.metadata?.plan as "BASIC" | "PRO";

    if (userId && plan) {
      const pendingSub = await prisma.subscriptions.findFirst({
        where: {
          userId,
          status: "PENDING",
          plan,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      if (pendingSub) {
        await prisma.subscriptions.update({
          where: {
            id: pendingSub.id,
          },
          data: {
            status: "ACTIVE",
            stripeId: stripeSession.subscription as string,
          },
        });
        await prisma.invoices.create({
          data: {
            subId: pendingSub.id,
            amount: stripeSession.amount_total
              ? stripeSession.amount_total / 100
              : 0,
            paid: true,
            stripeId: stripeSession.id,
          },
        });
      } else {
        console.error("No peding subscription found for userId");
      }
    }
  }
  return NextResponse.json({
    received: true,
  });
}
