import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { auth } from "../auth/[...nextauth]/route";
import { subscriptionSchema } from "@/lib/schema/subscription";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-06-24.dahlia",
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user)
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      {
        status: 401,
      }
    );

  try {
    const body = await req.json();
    const data = subscriptionSchema.parse(body);

    const priceId =
      data.plan === "PRO"
        ? "price_1TuDetGf7L8eRYWaNFJZWKfC"
        : "price_1TuDfIGf7L8eRYWanSUEM5zC";

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${req.headers.get(
        "origin"
      )}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/subscribe`,
      customer_email: session.user.email,
      metadata: {
        userId: session.user.id,
        plan: data.plan,
      },
      billing_address_collection: "auto",
    });
    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Fail payment",
      },
      {
        status: 500,
      }
    );
  }
}
