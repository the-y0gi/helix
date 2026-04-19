import { axiosApi } from "@/lib/axios";
export const currentUser = async () => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    return null;
  }

  try {
    const res = await axiosApi.get("/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    if (error) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      return null;

      // window.location.href = "/login";
    }

    console.error("currentUser service - API call failed:", error);
    throw error;
  }
};

// export const currentUser = async () => {
//   const token = localStorage.getItem("accessToken");

//   if (!token) {
//     throw new Error("No access token found");
//   }

//   try {
//     const res = await axiosApi.get("/users/me", {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     if (res.status === 401) {
//       localStorage.removeItem("accessToken");
//       localStorage.removeItem("refreshToken");
//       window.location.href = "/login";
//       return null;
//     }

//     return res.data;
//   } catch (error) {
//     console.error("currentUser service - API call failed:", error);
//     throw error;
//   }
// };
