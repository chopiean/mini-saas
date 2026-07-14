"use client";
import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const handleLogin = () => {
    signIn("credentials", {
      email: "hongan101003@gmail.com",
      password: "hongan1010",
      redirect: true,
      callbackUrl: "/dashboard",
    });
  };
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);
  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded shadow">
      <h1> LOGIN TO sAAs</h1>

      <button
        onClick={handleLogin}
        className="w-full bg-green-500 text-white p-2 rounded mt-4"
      >
        Login as TESTUSER
      </button>
    </div>
  );
}
