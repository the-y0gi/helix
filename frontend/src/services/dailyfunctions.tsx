'use client'
import { Sign_in_hover } from "@/components/auth/_components/sign-in-hover";
import { cn } from "@/lib/utils";
import { IconHeart, IconHeartFilled } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

export const LikeIcon = ({ _id, className }: { _id: string; className?: string }) => {
  const [liked, setLiked] = useState(false);
  const hasToken =
    typeof window !== "undefined" && localStorage.getItem("accessToken");

  const { mutate, isPending } = useMutation({
    mutationFn: toggleLike,
    onSuccess: (data) => {
      setLiked(data.liked);
      toast.success(data.liked ? "Liked" : "Disliked");
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

    mutate({ id: _id, liked });
  };

  return (
    <button
      className={cn(className)}
      onClick={handleClick}
      disabled={isPending}
    >
      {!hasToken ? (
        <Sign_in_hover
          forLike={{
            content: (
              <IconHeart
                className="text-muted-foreground transition-colors"
                size={24}
              />
            ),
            id: _id,
          }}
        />
      ) : liked ? (
        <IconHeartFilled
          className="text-destructive transition-colors"
          size={24}
        />
      ) : (
        <IconHeart
          className="text-muted-foreground hover:text-destructive transition-colors"
          size={24}
        />
      )}
    </button>
  );
};
import { useQueryClient } from "@tanstack/react-query";
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
    console.log(error);
    return {
      logout: false
    };
  }
};
export const toggleLike = async ({
  id,
  liked,
}: {
  id: string;
  liked: boolean;
}) => {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("Unauthorized");

  if (liked) {
    // 👉 call dislike API
    // await axios.delete(`/like/${id}`)
    return { liked: false };
  } else {
    // 👉 call like API
    // await axios.post(`/like/${id}`)
    return { liked: true };
  }
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
