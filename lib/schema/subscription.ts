import { z } from "zod";

export const subscriptionSchema = z.object({
  plan: z.enum(["BASIC", "PRO"]).refine((val) => val != undefined, {
    error: "PLease choose plan",
  }),
  months: z
    .number()
    .int()
    .min(1, "At least 1 month")
    .max(12, "Maximum 12 months"),
});

export type SubscriptionFormData = z.infer<typeof subscriptionSchema>;
