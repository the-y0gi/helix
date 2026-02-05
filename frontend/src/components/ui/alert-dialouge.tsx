import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import React from "react"

export function AlertOverlay({trigger, title , description , canecelTitle , continueTitle,variant , handelSumbit}:{
  trigger:string,
  variant?: "default" | "destructive" | "link" | "outline" | "secondary" | "ghost"
  title:string,
  description:string,
  canecelTitle:string,
  continueTitle:string,
  handelSumbit:()=>void,
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={variant} >{trigger}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{canecelTitle}</AlertDialogCancel>
          <AlertDialogAction onClick={handelSumbit}>{continueTitle}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
