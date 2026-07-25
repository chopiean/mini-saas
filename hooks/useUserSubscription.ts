import { UserWithSub } from "@/types/subscription";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export function useUserSubscription() {
  const { data: session } = useSession();

  return useQuery<UserWithSub>({
    queryKey: ["userSubscription", session?.user.id],
    queryFn: async () => {
      const res = await fetch(`/api/user/${session?.user.id}/subscription`);
      if (!res.ok) throw new Error("Failed to fetch user subscription");

      return res.json();
    },
    enabled: !!session?.user.id, //boolean is compulsory
  });
}
