'use client'
import { Sign_in_hover } from "@/components/auth/_components/sign-in-hover";
import { cn } from "@/lib/utils";
import { IconHeart, IconHeartFilled } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { dotoggleLike } from "./hotel/hotel.service";


export const handleRefresh = (queryClient: any, queryKey: string[]) => {
  // This will refetch any query that starts with the provided queryKey
  queryClient.invalidateQueries({
    queryKey: queryKey,
    exact: false, // Matches any query that starts with these keys
  });
};
export const LikeIcon = ({ _id, className, isFavourite, name, serviceType }: { _id: string; className?: string, isFavourite: boolean, name: string, serviceType: string }) => {
  const [liked, setLiked] = useState(isFavourite);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const hasToken =
    typeof window !== "undefined" && localStorage.getItem("accessToken");

  useEffect(() => {
    setLiked(isFavourite);
  }, [isFavourite]);

  const { mutate, isPending } = useMutation({
    mutationFn: toggleLike,
    onSuccess: (data) => {
      setLiked(data.liked);
      toast.success(data.liked ? "Liked " + name : "Disliked " + name);

      // Optimistic / Immediate Query Cache updates
      if (serviceType === "adventure") {
        queryClient.setQueryData(["getAdventureCompanyDetails", _id], (oldData: any) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            data: {
              ...oldData.data,
              adventure: {
                ...oldData.data?.adventure,
                isFavorite: data.liked,
                isFavourite: data.liked,
              }
            }
          };
        });
      } else if (serviceType === "bike") {
        queryClient.setQueryData(["BilesCompanyDetailsQuery", _id], (oldData: any) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            data: {
              ...oldData.data,
              company: {
                ...oldData.data?.company,
                isFavorite: data.liked,
                isFavourite: data.liked,
              }
            }
          };
        });
      } else if (serviceType === "cab") {
        queryClient.setQueryData(["getCabCompanyDetails", _id], (oldData: any) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            data: {
              ...oldData.data,
              company: {
                ...oldData.data?.company,
                isFavorite: data.liked,
                isFavourite: data.liked,
              }
            }
          };
        });
      } else if (serviceType === "hotel") {
        // Also update getAdventureCompanyDetails in case the user meant adventure (since they wrote serviceType = hotel for getAdventureCompanyDetails)
        queryClient.setQueryData(["getAdventureCompanyDetails", _id], (oldData: any) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            data: {
              ...oldData.data,
              adventure: {
                ...oldData.data?.adventure,
                isFavorite: data.liked,
                isFavourite: data.liked,
              }
            }
          };
        });
        queryClient.setQueryData(["hotel_details", _id], (oldData: any) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            isFavorite: data.liked,
            isFavourite: data.liked,
          };
        });
      } else if (serviceType === "tour") {
        queryClient.setQueryData(["getTourDetails", _id], (oldData: any) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            data: {
              ...oldData.data,
              company: {
                ...oldData.data?.company,
                isFavorite: data.liked,
                isFavourite: data.liked,
              }
            }
          };
        });
      }
    },
    onError: () => {
      toast.error("Action failed!");
    },
  });

  const handleClick = () => {
    if (!hasToken) {
      toast.error("Please log in first!");
      return;
    }

    mutate({ id: _id, liked, serviceType });
  };

  return (
    <button
      className={cn(className)}
      onClick={(e) => {
        e.stopPropagation()
        e.preventDefault()
        handleClick()
      }}
      disabled={isPending}
    >
      {!hasToken ? (
        <Sign_in_hover
          tag="Log-in"
          forLike={{
            content: (
              <IconHeart
                className="text-muted-foreground transition-colors"
                size={24}
              />
            ),
            type: "like",
            do: _id,
            id: _id,
          }}
        />
      ) : liked ? (
        <IconHeartFilled
          className="text-destructive transition-colors h-5 w-5 md:h-6 md:w-6"
          size={16}
        />
      ) : (
        <IconHeart
          className="text-muted-foreground hover:text-destructive transition-colors h-5 w-5 md:h-6 md:w-6"
          size={24}
        />
      )}
    </button>
  );
};
// export const 
export const useLogout = () => {
  try {
    const queryClient = useQueryClient();

    const logout = () => {
      localStorage.removeItem("accessToken");

      queryClient.removeQueries({ queryKey: ["current_user"] });


    };
    logout();

    return {
      logout: true
    };
  } catch (error) {
    console.error(error);
    return {
      logout: false
    };
  }
};
export const toggleLike = async ({
  id,
  liked,
  serviceType
}: {
  id: string;
  liked: boolean;
  serviceType: string;
}) => {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("Unauthorized");

  // Dispatch background job to Inngest via our Next.js API route
  // We don't await the backend response, only the dispatch
  const res = await dotoggleLike(id, serviceType);



  // Optimistic UI update
  return { liked: !liked };
};
export const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href);
    toast.success("Link Copied");
  } catch (err) {
    console.error("Failed to copy:", err);
    toast.error("Failed to copy!");
  }
};
import { useParams } from "next/navigation";
export const validimage = (s: string | undefined, dummy: string) => {
  if (s && s.length > 50) {
    return s;
  }
  return dummy; // Fallback path
};
export function useParam(
  key: string,
  fallback = ""
): string {
  const params = useParams();

  const value = params[key];

  return Array.isArray(value)
    ? value[0] ?? fallback
    : value ?? fallback;
}

export const handleShare = async () => {
  try {
    await navigator.share({
      title: "Helix",
      text: "Check out this hotel!",
      url: window.location.href,
    });
    toast.success("Link Shared");
  } catch (err) {
    console.error("Failed to share:", err);
    toast.error("Failed to share!");
  }
};
