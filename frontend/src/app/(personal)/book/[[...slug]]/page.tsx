import PaymentsContextProvider from "@/context/payments-form-provider";
import { cn } from "@/lib/utils";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { BookingForm } from "./_components/paymentform";
import { PageSkeleton } from "@/components/loader/skeleton";
import { MessageModal } from "@/components/messagemodal";



const page = async ({ className, params }: { className?: string, params: Promise<{ slug: string[] }> }) => {
  const { slug } = await params

  return (
    <div className={cn(" w-full", className)}>
      <ErrorBoundary fallback={<MessageModal title="Error" description="Something went wrong" />}>
        <Suspense fallback={<PageSkeleton />}>
          <PaymentsContextProvider>
            <BookingForm slug={slug} />

          </PaymentsContextProvider>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default page;
