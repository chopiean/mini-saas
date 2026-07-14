import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

const registerSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email("Email is invalid"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

type registerBody = z.infer<typeof registerSchema>;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { name, email, password } = registerSchema.parse(
      body
    ) as registerBody;

    //Check user existed or not
    const existedUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existedUser)
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 400 }
      );

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        message: "User registered successfully",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: "Data invalid",
        details: error.issues,
      });
    }

    return NextResponse.json(
      {
        message: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}
