'use client'

import { cn } from "@/lib/utils"
import React, { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { TabsContent } from "@/components/ui/tabscn"
import { useProfileSidebar } from "../../../providers/ProfileSidebarProvider"
import { PersonProfilePersonalData } from "./_components/personal_data/personal_data"
import Settings from "./_components/settings/settings"
import PaymentPage from "./_components/payment/payment"

type ProfileTabKey =
  | "personal_data"
  | "payment"
  | "wishlist"
  | "support"
  | "reviews"
  | "settings"
  | "all"
  | "active"
  | "completed"
  | "cancelled"

const content: Record<ProfileTabKey, React.ReactNode> = {
  personal_data: <PersonProfilePersonalData/>,
  payment: <PaymentPage/>,
  wishlist: <p>Wishlist Content</p>,
  support: <p>Support Content</p>,
  reviews: <p>Reviews Content</p>,
  settings: <Settings/>,
  all: <p>All Trips</p>,
  active: <p>Active Trips</p>,
  completed: <p>Completed Trips</p>,
  cancelled: <p>Cancelled Trips</p>,
}

export default function Page({ className }: { className?: string }) {
  const { navMain } = useProfileSidebar()

  const tabValues = [
    ...navMain.filter(t => !t.tabs).map(t => t.value),
    ...navMain.flatMap(t => t.tabs ?? []).map(t => t.value),
  ]

  return (
    <div className={cn("w-full", className)}>
      <ErrorBoundary fallback={<p>error</p>}>
        <Suspense fallback={<p>loading</p>}>
          {tabValues.map((value) => (
            <TabsContent
              key={value}
              value={value}
              className="w-full"
            >
              {content[value as ProfileTabKey]}
            </TabsContent>
          ))}
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}
