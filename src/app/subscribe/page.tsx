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
  const onSubmit = async (data: SubscriptionFormData) => {
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (res.ok) {
        alert(`Subcribed ${data.plan} for ${data.months} months successfully`);
        router.push("/dashboard");
      } else {
        alert(result.error || "Error server");
      }
    } catch (error) {
      alert("Error server");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          Regist Subscription
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Plan</label>
            <select
              {...register("plan")}
              className="w-full pd-3 rounded-lg border"
            >
              <option value="">Choose plan</option>
              <option value="BASIC">Basic (9$/ month)</option>
              <option value="PRO">Pro (29$/ month)</option>
            </select>
            {errors.plan && (
              <p className="text-red-500 text-sm mt-1">{errors.plan.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Months</label>
            <input
              type="number"
              {...register("months", { valueAsNumber: true })}
              placeholder="1-12"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            {errors.months && (
              <p className="text-red-500 text-sm mt-1">
                {errors.months.message}
              </p>
            )}
          </div>
          <button
            className="w-full bg-blue-600 text-white py-3 rounded-lg disabled:opacity-50"
            type="submit"
            disabled={isSubmitting || !isValid}
          >
            {isSubmitting ? "Forming" : "Regist"}
          </button>
        </form>
      </div>
    </div>
  );
}
