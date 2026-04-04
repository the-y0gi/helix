import React, { useState } from "react";
import {
    Copy,
    Share2,
    Code2,
    MessageCircle,
    Send,
    Facebook,
    Mail,
    MoreHorizontal,
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

const SOCIAL_PLATFORMS = [
    {
        name: "WhatsApp",
        icon: <MessageCircle className="h-6 w-6" />,
        bg: "bg-[#25D366] hover:bg-[#1ebd5e]",
        action: (url: string) => window.open(`https://wa.me/?text=${encodeURIComponent(url)}`, "_blank"),
    },
    {
        name: "Facebook",
        icon: <Facebook className="h-6 w-6" />,
        bg: "bg-[#1877F2] hover:bg-[#166fe5]",
        action: (url: string) => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank"),
    },
    {
        name: "X",
        icon: <span className="font-bold text-xl text-white">𝕏</span>,
        bg: "bg-black hover:bg-zinc-800",
        action: (url: string) => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`, "_blank"),
    },
    {
        name: "Reddit",
        icon: <Send className="h-6 w-6" />,
        bg: "bg-[#FF4500] hover:bg-[#e63e00]",
        action: (url: string) => window.open(`https://www.reddit.com/submit?url=${encodeURIComponent(url)}`, "_blank"),
    },
    {
        name: "Email",
        icon: <Mail className="h-6 w-6" />,
        bg: "bg-zinc-600 hover:bg-zinc-500",
        action: (url: string) => window.location.href = `mailto:?body=${encodeURIComponent(url)}`,
    },
    // {
    //     name: "Embed",
    //     icon: <Code2 className="h-6 w-6" />,
    //     bg: "bg-zinc-800 hover:bg-zinc-700",
    //     action: () => alert("Embed logic here"),
    // },
];

export function ShareModal() {
    const videoUrl = typeof window !== "undefined" ? window.location.href : "";
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(videoUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            toast.success("Link copied to clipboard");
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2 rounded-full px-6">
                    <Share2 className="h-4 w-4" />
                    Share
                </Button>
            </DialogTrigger>

            <DialogContent className="w-[95%] sm:max-w-[500px] bg-background border-border text-foreground p-0 overflow-hidden rounded-2xl sm:rounded-3xl">
                <DialogHeader className="px-6 py-4 flex flex-row items-center justify-between border-b border-border">
                    <DialogTitle className="text-lg font-medium">Share</DialogTitle>
                </DialogHeader>

                <div className="py-6">
                    {/* Social Icons Grid (Responsive) */}
                    <div className="px-2 sm:px-3">
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 place-items-center overflow-x-auto scrollbar-hide ">
                            {SOCIAL_PLATFORMS.map((platform) => (
                                <button
                                    key={platform.name}
                                    onClick={() => platform.action(videoUrl)}
                                    className="flex flex-col items-center gap-2 w-full max-w-[90px] transition-transform active:scale-90"
                                >
                                    <div
                                        className={`h-12 w-12 sm:h-14 sm:w-14 rounded-full flex items-center justify-center text-white shadow-md ${platform.bg}`}
                                    >
                                        {platform.icon}
                                    </div>

                                    <span className="text-[11px] sm:text-xs font-medium text-zinc-400 text-center">
                                        {platform.name}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="px-4 sm:px-6 mt-6 space-y-5">
                        {/* URL Copy Section */}
                        <div className="flex items-center gap-2 sm:gap-3 bg-secondary/50 border border-border rounded-xl p-2 pl-3 sm:pl-4">
                            <span className="text-xs sm:text-sm text-foreground truncate flex-1" onClick={handleCopy}>
                                {videoUrl}
                            </span>

                            <Button
                                onClick={handleCopy}
                                size="sm"
                                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg px-3 sm:px-5 h-8 sm:h-9 shrink-0"
                            >
                                {copied ? "Copied" : "Copy"}
                            </Button>
                        </div>


                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}




