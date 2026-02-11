import { axiosApi } from "@/lib/axios";
import { create } from "zustand";

interface User {
  id: string;
  email: string;
  role: string;
  isVerified: boolean;
  firstName?: string;
  lastName?: string;
}

interface AuthStates {
  isLoging: boolean;
  isSiging: boolean;
  currUser: User | null;
  userLogin: (
    data: Login_signup_Data,
  ) => Promise<{ success: boolean; message: string }>;
  userSignup: (
    data: Login_signup_Data,
  ) => Promise<{ success: boolean; message: string }>;
  verifyOTP: (data: {
    email: string;
    otp: string;
  }) => Promise<{ success: boolean; message: string }>;
  resendOTP: (email: string) => Promise<{ success: boolean; message: string }>;
}

interface Login_signup_Data {
  email: string;
  password?: string;
}

export const useAuthStore = create<AuthStates>()((set, get) => ({
  isLoging: false,
  isSiging: false,
  currUser: null,

  userLogin: async (data: Login_signup_Data) => {
    set({ isLoging: true });
    try {
      const res = await axiosApi.post("/auth/login", data);
      if (res.data.success) {
        set({ currUser: res.data.data.user });
        return { success: true, message: res.data.message };
      }
      return { success: false, message: res.data.message || "Login failed" };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    } finally {
      set({ isLoging: false });
    }
  },

  userSignup: async (data: Login_signup_Data) => {
    set({ isSiging: true });
    try {
      const res = await axiosApi.post("/auth/signup", data);
      return { success: res.data.success, message: res.data.message };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Signup failed",
      };
    } finally {
      set({ isSiging: false });
    }
  },

  verifyOTP: async (data: { email: string; otp: string }) => {
    set({ isSiging: true });
    try {
      const res = await axiosApi.post("/auth/verify-otp", data);
      if (res.data.success) {
        set({ currUser: res.data.data.user });
        return { success: true, message: res.data.message };
      }
      return {
        success: false,
        message: res.data.message || "Verification failed",
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Verification failed",
      };
    } finally {
      set({ isSiging: false });
    }
  },

  resendOTP: async (email: string) => {
    try {
      const res = await axiosApi.post("/auth/resend-otp", { email });
      return { success: res.data.success, message: res.data.message };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to resend OTP",
      };
    }
  },
}));
