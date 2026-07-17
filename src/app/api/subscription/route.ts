import { NextRequest, NextResponse } from "next/server";
import { auth } from "../auth/[...nextauth]/route";
import { subscriptionSchema } from "@/lib/schema/subscription";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.user.id) {
    return NextResponse.json({ error: "Unanthenticated" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const data = subscriptionSchema.parse(body);

    const subscription = await prisma.subscriptions.create({
      data: {
        userId: session.user.id,
        plan: data.plan,
        months: data.months,
        status: "PENDING",
      },
      select: {
        id: true,
        plan: true,
        status: true,
        createdAt: true,
      },
    });
    return NextResponse.json(
      {
        success: true,
        subscription,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: "Error sever",
      },
      {
        status: 500,
      }
    );
  }
}
