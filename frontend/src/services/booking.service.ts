import { axiosApi } from "@/lib/axios";
const token = localStorage.getItem("accessToken");
export const createBooking = async (data: any) => {
  try {
    console.log(data);

    const response = await axiosApi.post("/bookings", data);
    console.log(response, "from createBooking ");

    return response.data;
  } catch (error) {
    console.log(error, "from createBooking  error");
  }
};

export const verifyPayment = async (data: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}) => {
  const response = await axiosApi.post("/payments/verify", data);
  return response.data;
};

export const getMyBookings = async () => {
  try {
    const response = await axiosApi.get("/bookings/my-bookings");
    return response.data;
  } catch (error) {
    console.log(error, "from getMyBookings  error");
  }
};

export const getBookingById = async (id: string) => {
  try {
    console.log(id);

    const response = await axiosApi.get(`/bookings/${id}`);
    return response.data;
  } catch (error) {
    console.log(error, "from getBookingById  error");
  }
};
