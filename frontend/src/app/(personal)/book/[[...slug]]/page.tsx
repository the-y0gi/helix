import PaymentsContextProvider from "@/context/payments-form-provider";
import { cn } from "@/lib/utils";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { BookingDetailsCard, PaymentForm, StepsView } from "./_components/paymentform";


type Props = {};

const page = async ({ className, params }: { className?: string, params: Promise<{ slug: string }> }) => {
  const { slug } = await params
  console.log(slug);
  // const [hotel, setHotel] = React.useState<Hotel | null>(null);
  // const [loading, setLoading] = React.useState(true);

  // React.useEffect(() => {
  //   if (!hotelId) return;
  //   if (hotelId && typeof hotelId === "string") {
  //     getHotelById(hotelId)
  //       .then((data) => setHotel(data)).then(() => {
  //         console.log(hotel);
  //       })
  //       .finally(() => setLoading(false));
  //   }
  // }, [hotelId]);

  // if (loading) return <p>Loading...</p>;
  // if (!hotel) return <p>Hotel not found</p>;
  return (
    <div className={cn(" w-full", className)}>
      <ErrorBoundary fallback={<p>error</p>}>
        <Suspense fallback={<p>loading</p>}>
          <PaymentsContextProvider>
            <StepsView />
            <div className="flex flex-col lg:flex-row lg:gap-8 xl:gap-12">
              <PaymentForm />

              <aside className="hidden  lg:block lg:w-[320px] xl:w-[360px] flex-shrink-0 pt-6 lg:pt-10">
                <div className="sticky top-24 lg:top-28 z-10">
                  <BookingDetailsCard hotelid={slug[0]} />
                </div>
              </aside>
            </div>

          </PaymentsContextProvider>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default page;
