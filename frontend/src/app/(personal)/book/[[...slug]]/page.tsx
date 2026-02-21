import PaymentsContextProvider from "@/context/payments-form-provider";
import { cn } from "@/lib/utils";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { BookingDetailsCard, BookingForm, PaymentForm, StepsView } from "./_components/paymentform";


type Props = {};

const page = async ({ className, params }: { className?: string, params: Promise<{ slug: string[] }> }) => {
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
            <BookingForm slug={slug} />

          </PaymentsContextProvider>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default page;
