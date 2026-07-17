"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  type SubscriptionFormData,
  subscriptionSchema,
} from "@/lib/schema/subscription";
import { zodResolver } from "@hookform/resolvers/zod";
export default function SubcribePage() {
  const { data: session, status } = useSession();

  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SubscriptionFormData>({
    resolver: zodResolver(subscriptionSchema),
    mode: "onTouched",
  });

  if (status === "loading")
    return (
      <>
        <p>Loading...</p>
      </>
    );
  if (!session)
    return (
      <p>
        <a href="/login">Log in</a>
      </p>
    );

    return <>
    HELLO SUBSCRIBE
    </>
}
