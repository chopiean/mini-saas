"use client";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleLogin = async () => {
    setIsSigningIn(true);
    try {
      await signIn("credentials", {
        email: "hongan101003@gmail.com",
        password: "hongan1010",
        redirect: true,
        callbackUrl: "/dashboard",
      });
    } finally {
      setIsSigningIn(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-2">Welcome back</h1>
        <p className="text-gray-500 text-center mb-8">
          Log in to continue to your courses
        </p>

        <button
          onClick={handleLogin}
          disabled={isSigningIn || status === "loading"}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 cursor-pointer"
        >
          {isSigningIn ? "Signing in..." : "Login as An Le"}
        </button>
      </div>
    </div>
  );
}
