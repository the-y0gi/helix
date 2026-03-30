"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { X, ZoomIn } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

interface ImagePreviewProps {
  children: React.ReactNode;
  src: string;
  alt?: string;
}

export function ImagePreview({ children, src, alt }: ImagePreviewProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {/* <div className="  h-full "> */}
          {children}
          
        {/* </div> */}
      </DialogTrigger>
      
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 border-none bg-transparent shadow-none flex items-center justify-center overflow-hidden">
        <DialogTitle className="sr-only">Image Preview</DialogTitle>
        
        <div className="relative w-full h-full flex items-center justify-center">
          <img
            src={src}
            alt={alt || "Preview"}
            className="max-w-full max-h-[90vh] object-contain rounded-md shadow-2xl animate-in zoom-in-95 duration-300"
          />
          
          <DialogPrimitive.Close className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors flex items-center gap-1 font-medium bg-black/20 px-2 py-1 rounded-md md:bg-transparent">
            <X size={24} />
            <span className="text-sm">Close</span>
          </DialogPrimitive.Close>
        </div>
      </DialogContent>
    </Dialog>
  );
}