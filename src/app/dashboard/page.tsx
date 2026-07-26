"use client";
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";
import ClientDashboard from "@/src/components/ClientDashboard";

const Dashboard = () => {
  const { data: session, status } = useSession();

  if (!session?.user && status !== "loading") {
    redirect("/login");
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-bold">
            Dashboard - {session?.user?.name}
          </h1>

          <div className="flex items-center gap-3">
            <Link
              href="/subscribe"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Subscribe
            </Link>
            <button
              onClick={() => {
                signOut();
              }}
              className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-100 transition-colors cursor-pointer"
            >
              Log out
            </button>
          </div>
        </div>
      </div>
      <ClientDashboard></ClientDashboard>
    </div>
  );
};
export default Dashboard;
