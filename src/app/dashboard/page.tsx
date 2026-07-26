"use client";
import { useSession } from "next-auth/react";
import { useUserSubscription } from "@/hooks/useUserSubscription";

const Dashboard = () => {
  const { data: session, status } = useSession();
  const { data: userSubs, isLoading, error } = useUserSubscription();

  if (isLoading) return <p>Loading subscription...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!session) return <p>Please log in</p>;
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mt-4">
        Dashboard - {session.user.name}
      </h1>
      <p>
        Active Subs:{" "}
        {userSubs?.subscription.filter((s) => s.status === "ACTIVE").length}
      </p>

      <ul>
        {userSubs?.subscription.map((sub) => {
          return (
            <li key={sub.id} className="mb-2">
              Plan: {sub.plan} - Status: {sub.status} - Invoices:{" "}
              {sub.invoices.length}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
export default Dashboard;
