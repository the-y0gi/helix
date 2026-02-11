import { cn } from "@/lib/utils";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

type Props = {};

const page = ({ className }: { className?: string }) => {
  return (
    <div className={cn(" w-full", className)}>
      <ErrorBoundary fallback={<p>error</p>}>
        <Suspense fallback={<p>loading</p>}>payments</Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default page;
