"use client";
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import ClientDashboard from "@/src/components/ClientDashboard";

const Dashboard = () => {
  const { data: session, status } = useSession();

  if (!session?.user && status !== "loading") {
    redirect("/login");
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mac-w-7xl mx-auto p-6">
        <h1 className="text-4xl font-bold mb-6">
          Dashboard - {session?.user?.name}
        </h1>

        <button
          onClick={() => {
            signOut();
          }}
        >
          Log out
        </button>
      </div>
      <ClientDashboard></ClientDashboard>
    </div>
  );
};
export default Dashboard;
