import z from "zod";

export const PaymentSchema = z.object({
  dates: z.object({
    checkin: z.string(),
    checkout: z.string(),
  }),
  guests: z.object({
    adults: z.number(),
    children: z.number(),
  }),
  guestInformation: z.array(
    z.object({
      firstname: z.string().min(1, "First name is required"),
      lastname: z.string().min(1, "Last name is required"),
      email: z.string(),
      phone: z.string().min(1, "Phone is required"),
    }),
  ),
  specialRequest: z.string(),

  rooms: z.array(
    z.object({
      room: z.string(),
    }),
  ),
});

export type PaymentProps = z.infer<typeof PaymentSchema>;
