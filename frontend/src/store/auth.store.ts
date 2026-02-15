import { axiosApi } from "@/lib/axios";
import { create } from "zustand";

interface User {
  id: string;
  email: string;
  role: string;
  isVerified: boolean;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  phoneNumber?:string;
  gender?:string;
  country?:string;
  address?:string;
  zipCode?:string

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
  updateUser: (
    data: Partial<User>,
  ) => Promise<{ success: boolean; message: string }>;
  uploadFile: (
    file: File,
  ) => Promise<{ success: boolean; url?: string; message: string }>;
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

  updateUser: async (data: Partial<User>) => {
    try {
      const res = await axiosApi.patch("/users/update-me", data);
      if (res.data.success) {
        set({ currUser: res.data.data });
        return { success: true, message: "Profile updated successfully" };
      }
      return {
        success: false,
        message: res.data.message || "Failed to update profile",
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update profile",
      };
    }
  },

  uploadFile: async (file: File) => {
    const formData = new FormData();
    formData.append("files", file);
    formData.append("folder", "profiles");

    try {
      const res = await axiosApi.post("/uploads", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.data.success) {
        return {
          success: true,
          url: res.data.files[0].url,
          message: "File uploaded successfully",
        };
      }
      return {
        success: false,
        message: res.data.message || "Upload failed",
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Upload failed",
      };
    }
  },
}));
