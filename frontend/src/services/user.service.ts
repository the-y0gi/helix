import { axiosApi } from "@/lib/axios";

export const currentUser = async () => {
  const token = localStorage.getItem("accessToken");

  console.log("currentUser service - token:", token ? "EXISTS" : "MISSING");

  if (!token) {
    console.log("currentUser service - No token found, throwing error");
    throw new Error("No access token found");
  }

  try {
    console.log("currentUser service - Making API call to /users/me");
    const res = await axiosApi.get("/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("currentUser service - API response:", res.data);
    return res.data;
  } catch (error) {
    console.error("currentUser service - API call failed:", error);
    throw error;
  }
};
