import { axiosApi } from "@/lib/axios";

export const createBooking = async (data: any) => {
  const response = await axiosApi.post("/bookings", data);
  return response.data;
};

export const verifyPayment = async (data: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}) => {
  const response = await axiosApi.post("/payments/verify", data);
  return response.data;
};
