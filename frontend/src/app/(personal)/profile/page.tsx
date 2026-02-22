'use client'

import { cn } from "@/lib/utils"
import React, { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { TabsContent } from "@/components/ui/tabscn"
import { useProfileSidebar } from "../../../providers/ProfileSidebarProvider"
import { PersonProfilePersonalData } from "./_components/personal_data/personal_data"
import Settings from "./_components/settings/settings"
import PaymentPage from "./_components/payment/payment"
import { AllReservations } from "./_components/trips/all"
import { WishlistSection } from "./_components/wishlist/wish-list"
import { ReviewList } from "./_components/reviews/my-reviews"
// import { ActiveReservations, AllReservations, CancelledReservations, CompletedReservations } from "./_components/trips/all"

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
  personal_data: <PersonProfilePersonalData />,
  payment: <PaymentPage />,
  wishlist: <WishlistSection />,
  support: <p>Support Content</p>,
  reviews: <ReviewList  />,
  settings: <Settings />,
  all: <AllReservations variant={"all"} />,
  active: <AllReservations variant={"active"} />,
  completed: <AllReservations variant={"completed"} />,
  cancelled: <AllReservations variant={"cancelled"} />,
}

export default function Page({ className }: { className?: string }) {
  const { navMain } = useProfileSidebar()

  const tabValues = [
    ...navMain.filter(t => !t.tabs).map(t => t.value),
    ...navMain.flatMap(t => t.tabs ?? []).map(t => t.value),
  ]

  return (
    <div className={cn("w-full flex", className)}>
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
