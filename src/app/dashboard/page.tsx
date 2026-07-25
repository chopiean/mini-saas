"use client";
import { useSession } from "next-auth/react";
import { useUserSubscription } from "@/hooks/useUserSubscription";

const Dashboard = () => {
  const { data: session, status } = useSession();
  const { data, isLoading, error } = useUserSubscription();

  if (isLoading) return <p>Loading subscription...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!session) return <p>Please log in</p>;
  return <div>Dashboard</div>;
};
export default Dashboard;
