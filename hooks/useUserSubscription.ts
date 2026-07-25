import { UserWithSub } from "@/types/subscription";
import { useQuery } from "@tanstack/react-query";
import { auth } from "@/src/app/api/auth/[...nextauth]/route";

export function useUserSubscription() {
  return useQuery<UserWithSub>({
    queryKey: ["userSubscription"],
    queryFn: async () => {
      const session = await auth();
      if (!session?.user.id) {
        throw new Error("Unauthorized");
      }

      const res = await fetch(`/api/user/${session.user.id}/subscription`);
      if (!res.ok) throw new Error("Failed to fetch user subscription");

      return res.json();
    },
  });
}
