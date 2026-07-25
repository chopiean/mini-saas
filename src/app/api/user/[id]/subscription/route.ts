import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { UserWithSub } from "@/types/subscription";

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: { id: string };
  }
) {
  const session = await auth();
  const { id } = await params;
  if (!session?.user || session.user.id !== id) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }
  const userWithSubs = (await prisma.user.findUnique({
    where: {
      id,
    },
    include: {
      subscription: {
        include: {
          invoices: true,
        },
      },
    },
  })) as UserWithSub;
  return NextResponse.json(userWithSubs);
}
